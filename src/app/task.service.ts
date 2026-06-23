import { Injectable, signal, computed } from '@angular/core';
import { Task, TaskStatus, FilterStatus } from './task.model';

const STORAGE_KEY = 'taskflow_tasks';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasksSignal = signal<Task[]>(this.loadFromStorage());
  private filterSignal = signal<FilterStatus>('all');
  private searchSignal = signal<string>('');

  readonly tasks  = this.tasksSignal.asReadonly();
  readonly filter = this.filterSignal.asReadonly();
  readonly search = this.searchSignal.asReadonly();

  readonly stats = computed(() => {
    const all = this.tasksSignal();
    return {
      total:      all.length,
      pending:    all.filter(t => t.status === 'pending').length,
      inProgress: all.filter(t => t.status === 'in-progress').length,
      completed:  all.filter(t => t.status === 'completed').length,
    };
  });

  addTask(partial: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'>): void {
    const now = new Date().toISOString();
    const tasks = this.tasksSignal();
    const task: Task = {
      ...partial,
      id:        crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      order:     tasks.length,
    };
    this.update([...tasks, task]);
  }

  updateTask(id: string, changes: Partial<Omit<Task, 'id' | 'createdAt'>>): void {
    this.update(
      this.tasksSignal().map(t =>
        t.id === id ? { ...t, ...changes, updatedAt: new Date().toISOString() } : t
      )
    );
  }

  deleteTask(id: string): void {
    this.update(this.tasksSignal().filter(t => t.id !== id));
  }

  toggleComplete(id: string): void {
    const task = this.tasksSignal().find(t => t.id === id);
    if (!task) return;
    const next: TaskStatus = task.status === 'completed' ? 'pending' : 'completed';
    this.updateTask(id, { status: next });
  }

  reorder(tasks: Task[]): void {
    this.update(tasks.map((t, i) => ({ ...t, order: i })));
  }

  setFilter(f: FilterStatus): void { this.filterSignal.set(f); }
  setSearch(q: string): void       { this.searchSignal.set(q); }

  private update(tasks: Task[]): void {
    this.tasksSignal.set(tasks);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); } catch { /* noop */ }
  }

  private loadFromStorage(): Task[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return this.seedData();
      const parsed = JSON.parse(raw) as Task[];
      return Array.isArray(parsed) ? parsed : this.seedData();
    } catch { return this.seedData(); }
  }

  private seedData(): Task[] {
    const now = new Date().toISOString();
    const data: Task[] = [
      { id: crypto.randomUUID(), title: 'Design component architecture', description: 'Plan the folder structure and component tree.', status: 'completed',    priority: 'high',   dueDate: null, tags: ['design'],    createdAt: now, updatedAt: now, order: 0 },
      { id: crypto.randomUUID(), title: 'Integrate CDK DragDrop',       description: 'Add drag-to-reorder using Angular CDK.',        status: 'in-progress', priority: 'high',   dueDate: null, tags: ['angular'],   createdAt: now, updatedAt: now, order: 1 },
      { id: crypto.randomUUID(), title: 'Write unit tests',             description: 'Cover TaskService and pipes with tests.',       status: 'pending',     priority: 'medium', dueDate: null, tags: ['testing'],   createdAt: now, updatedAt: now, order: 2 },
      { id: crypto.randomUUID(), title: 'Deploy to Vercel',             description: 'Connect GitHub and configure CI/CD.',           status: 'pending',     priority: 'low',    dueDate: null, tags: ['devops'],    createdAt: now, updatedAt: now, order: 3 },
    ];
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* noop */ }
    return data;
  }
}
