import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from './task.model';
import { TooltipDirective } from './tooltip.directive';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, TooltipDirective],
  template: `
    <div class="task"
      [class.task--completed]="task.status === 'completed'"
      [class.task--in-progress]="task.status === 'in-progress'">

      <!-- Drag handle -->
      <span class="task__drag" appTooltip="Drag to reorder" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="5.5" cy="4"  r="1.25" fill="currentColor"/>
          <circle cx="10.5" cy="4" r="1.25" fill="currentColor"/>
          <circle cx="5.5" cy="8"  r="1.25" fill="currentColor"/>
          <circle cx="10.5" cy="8" r="1.25" fill="currentColor"/>
          <circle cx="5.5" cy="12" r="1.25" fill="currentColor"/>
          <circle cx="10.5" cy="12" r="1.25" fill="currentColor"/>
        </svg>
      </span>

      <!-- Checkbox -->
      <button class="task__check" [class.task__check--done]="task.status === 'completed'"
        (click)="toggle.emit(task.id)"
        [attr.aria-label]="task.status === 'completed' ? 'Mark incomplete' : 'Mark complete'">
        @if (task.status === 'completed') {
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="#0f1117" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        }
      </button>

      <!-- Body -->
      <div class="task__body" (click)="expanded = !expanded">
        <div class="task__row">
          <span class="task__title">{{ task.title }}</span>
          <div class="task__badges">
            <span class="badge" [class]="'badge--' + task.priority">{{ priorityLabel }}</span>
            <span class="badge badge--status" [class]="'badge--s-' + task.status">{{ statusLabel }}</span>
            @if (isOverdue) { <span class="badge badge--overdue">Overdue</span> }
          </div>
        </div>
        @if (task.description && expanded) {
          <p class="task__desc animate-slide-down">{{ task.description }}</p>
        }
        <div class="task__meta">
          @if (task.dueDate) {
            <span class="task__due" [class.overdue]="isOverdue">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <rect x="1" y="2" width="9" height="8" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
                <path d="M3.5 1v2M7.5 1v2M1 5h9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
              </svg>
              {{ task.dueDate | date:'MMM d' }}
            </span>
          }
          @if (task.tags.length) {
            <div class="task__tags">
              @for (tag of task.tags; track tag) {
                <span class="task__tag">#{{ tag }}</span>
              }
            </div>
          }
        </div>
      </div>

      <!-- Actions -->
      <div class="task__actions">
        <button class="task__action" (click)="edit.emit(task)" appTooltip="Edit" aria-label="Edit task">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9.5 2l2.5 2.5-7 7H2.5V9l7-7z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="task__action task__action--danger" (click)="delete.emit(task.id)" appTooltip="Delete" aria-label="Delete task">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 3.5h10M5.5 3.5V2h3v1.5M5.5 6v4M8.5 6v4M3 3.5l.75 8h6.5l.75-8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .task {
      display: flex; align-items: flex-start; gap: 0.75rem;
      padding: 0.875rem 1rem; background: var(--bg-surface);
      border: 1px solid var(--border-subtle); border-radius: var(--radius-md);
      transition: border-color var(--transition), background var(--transition), box-shadow var(--transition);
      animation: fadeInUp 0.2s ease forwards; cursor: default; position: relative;
    }
    .task:hover { border-color: var(--border-medium); background: var(--bg-elevated); box-shadow: 0 2px 12px rgba(0,0,0,0.2); }
    .task:hover .task__actions { opacity: 1; }
    .task--in-progress { border-left: 2px solid var(--accent-blue); }
    .task--completed { opacity: 0.6; }
    .task--completed .task__title { text-decoration: line-through; color: var(--text-muted); }
    .task__drag { display: flex; align-items: center; justify-content: center; width: 20px; flex-shrink: 0; color: var(--text-muted); cursor: grab; padding-top: 2px; transition: color var(--transition); }
    .task__drag:hover { color: var(--text-secondary); }
    .task__drag:active { cursor: grabbing; }
    .task__check {
      display: flex; align-items: center; justify-content: center;
      width: 20px; height: 20px; flex-shrink: 0;
      border: 1.5px solid var(--border-medium); border-radius: 50%;
      background: transparent; cursor: pointer; margin-top: 1px;
      transition: all var(--transition);
    }
    .task__check:hover { border-color: var(--accent-lime); background: rgba(184,249,74,0.08); }
    .task__check--done { background: var(--accent-lime); border-color: var(--accent-lime); animation: checkPop 0.3s ease; }
    .task__body { flex: 1; min-width: 0; cursor: pointer; }
    .task__row  { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.75rem; }
    .task__title { font-size: 0.9375rem; font-weight: 500; color: var(--text-primary); line-height: 1.4; flex: 1; min-width: 0; }
    .task__desc  { font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.6; margin-top: 0.375rem; }
    .task__badges { display: flex; gap: 0.375rem; flex-shrink: 0; flex-wrap: wrap; justify-content: flex-end; }
    .task__meta { display: flex; align-items: center; gap: 0.75rem; margin-top: 0.5rem; flex-wrap: wrap; }
    .task__due   { display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; color: var(--text-muted); }
    .task__due.overdue { color: var(--accent-red); }
    .task__tags  { display: flex; gap: 0.375rem; flex-wrap: wrap; }
    .task__tag   { font-size: 0.6875rem; color: var(--text-muted); background: var(--bg-hover); padding: 1px 6px; border-radius: 99px; font-weight: 500; }
    .task__actions { display: flex; gap: 0.25rem; opacity: 0; transition: opacity var(--transition); flex-shrink: 0; }
    .task__action {
      display: flex; align-items: center; justify-content: center;
      width: 28px; height: 28px; border: none; background: var(--bg-hover);
      color: var(--text-muted); border-radius: var(--radius-sm); cursor: pointer;
      transition: all var(--transition);
    }
    .task__action:hover { background: var(--bg-elevated); color: var(--text-primary); }
    .task__action--danger:hover { background: rgba(255,92,92,0.15); color: var(--accent-red); }
    .badge { font-size: 0.6875rem; font-weight: 600; padding: 2px 7px; border-radius: 99px; letter-spacing: 0.03em; }
    .badge--low    { background: rgba(91,141,238,0.15); color: var(--accent-blue); }
    .badge--medium { background: rgba(255,177,74,0.15);  color: #ffb14a; }
    .badge--high   { background: rgba(255,92,92,0.15);   color: var(--accent-red); }
    .badge--s-pending     { background: var(--bg-hover); color: var(--text-muted); }
    .badge--s-in-progress { background: rgba(91,141,238,0.12); color: var(--accent-blue); }
    .badge--s-completed   { background: rgba(184,249,74,0.12); color: var(--accent-lime-dim); }
    .badge--overdue { background: rgba(255,92,92,0.15); color: var(--accent-red); }
  `]
})
export class TaskItemComponent {
  @Input({ required: true }) task!: Task;
  @Output() edit   = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<string>();
  @Output() toggle = new EventEmitter<string>();

  expanded = false;

  get priorityLabel(): string { return { low: 'Low', medium: 'Med', high: 'High' }[this.task.priority] ?? ''; }
  get statusLabel():   string { return { pending: 'Pending', 'in-progress': 'Active', completed: 'Done' }[this.task.status] ?? ''; }
  get isOverdue(): boolean {
    if (!this.task.dueDate || this.task.status === 'completed') return false;
    return new Date(this.task.dueDate) < new Date();
  }
}
