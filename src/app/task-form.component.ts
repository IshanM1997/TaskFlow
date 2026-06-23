import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Task, TaskPriority, TaskStatus } from './task.model';
import { TaskService } from './task.service';
import { AutoFocusDirective } from './auto-focus.directive';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AutoFocusDirective],
  template: `
    <div class="modal-backdrop" (click)="close()" role="dialog" aria-modal="true">
      <div class="modal animate-scale-in" (click)="$event.stopPropagation()">

        <div class="modal__header">
          <h2 class="modal__title">{{ isEdit ? 'Edit Task' : 'New Task' }}</h2>
          <button class="modal__close" (click)="close()" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" class="modal__form" novalidate>

          <!-- Title — appAutoFocus used as bare attribute (boolean transform handles it) -->
          <div class="field" [class.field--error]="titleError">
            <label class="field__label" for="title">Title <span class="required">*</span></label>
            <input
              id="title"
              class="field__input"
              type="text"
              formControlName="title"
              placeholder="What needs to be done?"
              appAutoFocus
            />
            @if (titleError) {
              <span class="field__error">{{ titleError }}</span>
            }
          </div>

          <!-- Description -->
          <div class="field">
            <label class="field__label" for="desc">Description</label>
            <textarea id="desc" class="field__input field__input--ta" formControlName="description" placeholder="Add details…" rows="3"></textarea>
          </div>

          <!-- Priority + Status -->
          <div class="field-row">
            <div class="field">
              <label class="field__label">Priority</label>
              <div class="prio-group">
                @for (p of priorities; track p) {
                  <button type="button" class="prio-btn" [class]="'prio-btn--' + p"
                    [class.active]="form.get('priority')?.value === p"
                    (click)="form.patchValue({ priority: p })">
                    {{ p | titlecase }}
                  </button>
                }
              </div>
            </div>
            <div class="field">
              <label class="field__label" for="status">Status</label>
              <select id="status" class="field__input field__input--sel" formControlName="status">
                @for (s of statuses; track s.value) {
                  <option [value]="s.value">{{ s.label }}</option>
                }
              </select>
            </div>
          </div>

          <!-- Due date + Tags -->
          <div class="field-row">
            <div class="field">
              <label class="field__label" for="due">Due Date</label>
              <input id="due" class="field__input" type="date" formControlName="dueDate" />
            </div>
            <div class="field">
              <label class="field__label" for="tags">Tags</label>
              <input id="tags" class="field__input" type="text" formControlName="tags" placeholder="angular, work" />
            </div>
          </div>

          <div class="modal__actions">
            <button type="button" class="btn btn--ghost" (click)="close()">Cancel</button>
            <button type="submit" class="btn btn--primary" [disabled]="form.invalid">
              {{ isEdit ? 'Save Changes' : 'Add Task' }}
            </button>
          </div>

        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed; inset: 0; background: rgba(0,0,0,0.7);
      backdrop-filter: blur(4px); display: flex; align-items: center;
      justify-content: center; z-index: 1000; padding: 1rem;
    }
    .modal {
      background: var(--bg-surface); border: 1px solid var(--border-medium);
      border-radius: var(--radius-xl); width: 100%; max-width: 540px;
      box-shadow: var(--shadow-pop); overflow: hidden;
    }
    .modal__header { display: flex; align-items: center; justify-content: space-between; padding: 1.375rem 1.5rem 0; }
    .modal__title  { font-family: var(--font-display); font-size: 1.125rem; font-weight: 700; }
    .modal__close  {
      display: flex; align-items: center; justify-content: center;
      width: 32px; height: 32px; border: none; background: var(--bg-elevated);
      color: var(--text-secondary); border-radius: var(--radius-sm); cursor: pointer;
      transition: all var(--transition);
    }
    .modal__close:hover { background: var(--bg-hover); color: var(--text-primary); }
    .modal__form { padding: 1.25rem 1.5rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
    .modal__actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem; }
    .field { display: flex; flex-direction: column; gap: 0.375rem; }
    .field__label { font-size: 0.8125rem; font-weight: 500; color: var(--text-secondary); }
    .field__input {
      background: var(--bg-elevated); border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md); padding: 0.5625rem 0.875rem;
      color: var(--text-primary); font-family: var(--font-body); font-size: 0.875rem;
      transition: border-color var(--transition), box-shadow var(--transition);
    }
    .field__input::placeholder { color: var(--text-muted); }
    .field__input:focus { outline: none; border-color: rgba(184,249,74,0.4); box-shadow: 0 0 0 3px rgba(184,249,74,0.08); }
    .field__input--ta { resize: vertical; min-height: 80px; line-height: 1.5; }
    .field__input--sel {
      cursor: pointer; appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238b92ad' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 0.75rem center; padding-right: 2rem;
      background-color: var(--bg-elevated);
    }
    .field__input--sel option { background: var(--bg-elevated); color: var(--text-primary); }
    .field__input[type="date"] { cursor: pointer; color-scheme: dark; }
    .field__error { font-size: 0.75rem; color: var(--accent-red); }
    .field--error .field__input { border-color: rgba(255,92,92,0.5); }
    .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.875rem; }
    .prio-group { display: flex; gap: 0.375rem; }
    .prio-btn {
      flex: 1; padding: 0.4375rem 0; border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm); background: transparent;
      color: var(--text-secondary); font-family: var(--font-body); font-size: 0.8125rem;
      font-weight: 500; cursor: pointer; transition: all var(--transition);
    }
    .prio-btn:hover { border-color: var(--border-medium); color: var(--text-primary); }
    .prio-btn--low.active    { background: rgba(91,141,238,0.15); border-color: var(--accent-blue); color: var(--accent-blue); }
    .prio-btn--medium.active { background: rgba(255,177,74,0.15); border-color: #ffb14a; color: #ffb14a; }
    .prio-btn--high.active   { background: rgba(255,92,92,0.15);  border-color: var(--accent-red);  color: var(--accent-red); }
    .required { color: var(--accent-red); margin-left: 2px; }
    .btn {
      padding: 0.5rem 1.25rem; border-radius: var(--radius-md);
      font-family: var(--font-body); font-size: 0.875rem; font-weight: 600;
      cursor: pointer; transition: all var(--transition); border: none;
    }
    .btn--primary { background: var(--accent-lime); color: #0f1117; }
    .btn--primary:hover:not(:disabled) { background: var(--accent-lime-dim); }
    .btn--primary:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn--ghost { background: transparent; color: var(--text-secondary); border: 1px solid var(--border-subtle); }
    .btn--ghost:hover { color: var(--text-primary); border-color: var(--border-medium); }
  `]
})
export class TaskFormComponent implements OnInit {
  @Input() editTask: Task | null = null;
  @Output() closed = new EventEmitter<void>();

  private fb  = inject(FormBuilder);
  private svc = inject(TaskService);

  form = this.fb.group({
    title:       ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    status:      ['pending' as TaskStatus],
    priority:    ['medium' as TaskPriority],
    dueDate:     [null as string | null],
    tags:        [''],
  });

  readonly priorities: TaskPriority[] = ['low', 'medium', 'high'];
  readonly statuses = [
    { value: 'pending'     as TaskStatus, label: 'Pending'     },
    { value: 'in-progress' as TaskStatus, label: 'In Progress' },
    { value: 'completed'   as TaskStatus, label: 'Completed'   },
  ];

  get isEdit(): boolean { return !!this.editTask; }

  ngOnInit(): void {
    if (this.editTask) {
      this.form.patchValue({ ...this.editTask, tags: this.editTask.tags.join(', ') });
    }
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const raw  = this.form.value;
    const tags = (raw.tags ?? '').split(',').map((t: string) => t.trim()).filter(Boolean);
    const payload = {
      title:       raw.title!.trim(),
      description: raw.description?.trim() ?? '',
      status:      raw.status as TaskStatus,
      priority:    raw.priority as TaskPriority,
      dueDate:     raw.dueDate ?? null,
      tags,
    };
    this.isEdit ? this.svc.updateTask(this.editTask!.id, payload) : this.svc.addTask(payload);
    this.closed.emit();
  }

  close(): void { this.closed.emit(); }

  get titleError(): string {
    const c = this.form.get('title');
    if (c?.touched && c.errors?.['required'])  return 'Title is required.';
    if (c?.touched && c.errors?.['minlength']) return 'Min 3 characters.';
    return '';
  }
}
