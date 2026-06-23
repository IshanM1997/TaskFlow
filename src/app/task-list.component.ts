import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { TaskService } from './task.service';
import { Task } from './task.model';
import { FilterTasksPipe } from './filter-tasks.pipe';
import { TaskItemComponent } from './task-item.component';
import { TaskFormComponent } from './task-form.component';
import { FilterBarComponent } from './filter-bar.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    FilterTasksPipe,
    TaskItemComponent,
    TaskFormComponent,
    FilterBarComponent,
  ],
  template: `
    <div class="tl-wrap">

      <!-- Toolbar -->
      <div class="tl-toolbar">
        <app-filter-bar />
        <button class="add-btn" (click)="openAdd()" aria-label="Add task">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          New Task
        </button>
      </div>

      <!-- List -->
      <div
        class="tl-list"
        cdkDropList
        [cdkDropListData]="filtered()"
        (cdkDropListDropped)="drop($event)"
      >
        @for (task of svc.tasks() | filterTasks:svc.filter():svc.search(); track task.id) {
          <div cdkDrag [cdkDragData]="task">
            <app-task-item
              [task]="task"
              (edit)="openEdit($event)"
              (delete)="confirmDelete($event)"
              (toggle)="svc.toggleComplete($event)"
            />
          </div>
        } @empty {
          <div class="tl-empty">
            <div class="tl-empty__icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="8" y="12" width="32" height="28" rx="4" stroke="currentColor" stroke-width="2"/>
                <path d="M16 12V9a2 2 0 012-2h12a2 2 0 012 2v3" stroke="currentColor" stroke-width="2"/>
                <path d="M17 24h14M17 31h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <p class="tl-empty__title">No tasks found</p>
            <p class="tl-empty__sub">
              @if (svc.search()) { No results for "{{ svc.search() }}" }
              @else if (svc.filter() !== 'all') { No {{ svc.filter() }} tasks }
              @else { Add your first task to get started }
            </p>
            @if (!svc.search() && svc.filter() === 'all') {
              <button class="add-btn add-btn--ghost" (click)="openAdd()">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Add your first task
              </button>
            }
          </div>
        }
      </div>
    </div>

    <!-- Task form modal -->
    @if (showForm()) {
      <app-task-form [editTask]="editTarget()" (closed)="closeForm()" />
    }

    <!-- Delete confirm -->
    @if (deleteId()) {
      <div class="modal-back" (click)="cancelDelete()">
        <div class="confirm animate-scale-in" (click)="$event.stopPropagation()">
          <div class="confirm__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 9v4M12 17h.01" stroke="#ff5c5c" stroke-width="2" stroke-linecap="round"/>
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#ff5c5c" stroke-width="1.5" fill="none"/>
            </svg>
          </div>
          <h3 class="confirm__title">Delete Task?</h3>
          <p class="confirm__body">This cannot be undone.</p>
          <div class="confirm__actions">
            <button class="btn btn--ghost" (click)="cancelDelete()">Cancel</button>
            <button class="btn btn--danger" (click)="doDelete()">Delete</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .tl-wrap { display: flex; flex-direction: column; gap: 1rem; }
    .tl-toolbar { display: flex; align-items: center; gap: 0.875rem; flex-wrap: wrap; }
    .tl-list { display: flex; flex-direction: column; gap: 0.5rem; min-height: 120px; }
    .tl-empty {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; padding: 3rem 1rem; text-align: center; gap: 0.5rem;
    }
    .tl-empty__icon { color: var(--text-muted); opacity: 0.4; margin-bottom: 0.5rem; }
    .tl-empty__title { font-family: var(--font-display); font-size: 1rem; font-weight: 600; color: var(--text-secondary); }
    .tl-empty__sub { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.5rem; }
    .add-btn {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.5rem 1rem; background: var(--accent-lime); color: #0f1117;
      border: none; border-radius: var(--radius-md); font-family: var(--font-body);
      font-size: 0.875rem; font-weight: 600; cursor: pointer; white-space: nowrap;
      transition: all var(--transition); flex-shrink: 0;
    }
    .add-btn:hover { background: var(--accent-lime-dim); }
    .add-btn:active { transform: scale(0.97); }
    .add-btn--ghost {
      background: var(--bg-elevated); color: var(--text-secondary);
      border: 1px solid var(--border-subtle); margin-top: 0.5rem;
    }
    .add-btn--ghost:hover { background: var(--bg-hover); color: var(--text-primary); }
    .modal-back {
      position: fixed; inset: 0; background: rgba(0,0,0,0.7);
      backdrop-filter: blur(4px); display: flex; align-items: center;
      justify-content: center; z-index: 1000;
    }
    .confirm {
      background: var(--bg-surface); border: 1px solid var(--border-medium);
      border-radius: var(--radius-lg); padding: 2rem; width: 100%; max-width: 360px;
      text-align: center; box-shadow: var(--shadow-pop);
    }
    .confirm__icon  { margin-bottom: 0.875rem; }
    .confirm__title { font-family: var(--font-display); font-size: 1.0625rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.375rem; }
    .confirm__body  { font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1.5rem; }
    .confirm__actions { display: flex; gap: 0.75rem; justify-content: center; }
    .btn { padding: 0.5rem 1.25rem; border-radius: var(--radius-md); font-family: var(--font-body); font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all var(--transition); border: none; }
    .btn--ghost  { background: transparent; color: var(--text-secondary); border: 1px solid var(--border-subtle); }
    .btn--ghost:hover { color: var(--text-primary); border-color: var(--border-medium); }
    .btn--danger { background: rgba(255,92,92,0.15); color: var(--accent-red); border: 1px solid rgba(255,92,92,0.3); }
    .btn--danger:hover { background: rgba(255,92,92,0.25); }
  `]
})
export class TaskListComponent {
  protected svc = inject(TaskService);

  showForm      = signal(false);
  editTarget    = signal<Task | null>(null);
  deleteId      = signal<string | null>(null);

  openAdd():        void { this.editTarget.set(null); this.showForm.set(true); }
  openEdit(t: Task): void { this.editTarget.set(t);   this.showForm.set(true); }
  closeForm():      void { this.showForm.set(false); this.editTarget.set(null); }
  confirmDelete(id: string): void { this.deleteId.set(id); }
  cancelDelete():   void { this.deleteId.set(null); }
  doDelete():       void { const id = this.deleteId(); if (id) { this.svc.deleteTask(id); this.deleteId.set(null); } }

  filtered(): Task[] {
    const pipe = new FilterTasksPipe();
    return pipe.transform(this.svc.tasks(), this.svc.filter(), this.svc.search());
  }

  drop(event: CdkDragDrop<Task[]>): void {
    const list = this.filtered();
    moveItemInArray(list, event.previousIndex, event.currentIndex);
    this.svc.reorder(list);
  }
}
