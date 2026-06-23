import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from './task.service';
import { FilterStatus } from './task.model';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="filter-bar">
      <div class="filter-bar__search">
        <svg class="filter-bar__icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <input
          class="filter-bar__input"
          type="search"
          placeholder="Search tasks, tags…"
          [value]="svc.search()"
          (input)="onSearch($event)"
          aria-label="Search tasks"
        />
      </div>
      <div class="filter-bar__tabs" role="tablist">
        @for (f of filters; track f.value) {
          <button
            class="filter-bar__tab"
            [class.active]="svc.filter() === f.value"
            (click)="svc.setFilter(f.value)"
            role="tab"
            [attr.aria-selected]="svc.filter() === f.value"
          >
            {{ f.label }}
            @if (f.value !== 'all') {
              <span class="filter-bar__count">
                {{ f.value === 'pending' ? svc.stats().pending
                   : f.value === 'in-progress' ? svc.stats().inProgress
                   : svc.stats().completed }}
              </span>
            }
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .filter-bar { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
    .filter-bar__search { position: relative; flex: 1; min-width: 200px; }
    .filter-bar__icon { position: absolute; left: 0.875rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; }
    .filter-bar__input {
      width: 100%; background: var(--bg-elevated); border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md); padding: 0.5rem 0.875rem 0.5rem 2.5rem;
      color: var(--text-primary); font-family: var(--font-body); font-size: 0.875rem;
      transition: border-color var(--transition), box-shadow var(--transition);
    }
    .filter-bar__input::placeholder { color: var(--text-muted); }
    .filter-bar__input:focus { outline: none; border-color: rgba(184,249,74,0.4); box-shadow: 0 0 0 3px rgba(184,249,74,0.08); }
    .filter-bar__input::-webkit-search-cancel-button { -webkit-appearance: none; }
    .filter-bar__tabs { display: flex; gap: 0.25rem; background: var(--bg-elevated); border-radius: var(--radius-md); padding: 0.25rem; }
    .filter-bar__tab {
      display: flex; align-items: center; gap: 0.375rem;
      padding: 0.375rem 0.875rem; border: none; background: transparent;
      color: var(--text-secondary); font-family: var(--font-body); font-size: 0.8125rem;
      font-weight: 500; border-radius: var(--radius-sm); cursor: pointer;
      transition: all var(--transition); white-space: nowrap;
    }
    .filter-bar__tab:hover { color: var(--text-primary); background: var(--bg-hover); }
    .filter-bar__tab.active { background: var(--bg-surface); color: var(--text-primary); box-shadow: 0 1px 4px rgba(0,0,0,0.3); }
    .filter-bar__count { background: var(--bg-hover); color: var(--text-muted); font-size: 0.6875rem; padding: 1px 5px; border-radius: 99px; font-weight: 600; }
    .filter-bar__tab.active .filter-bar__count { background: rgba(184,249,74,0.15); color: var(--accent-lime); }
  `]
})
export class FilterBarComponent {
  protected svc = inject(TaskService);

  readonly filters: { value: FilterStatus; label: string }[] = [
    { value: 'all',         label: 'All' },
    { value: 'pending',     label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed',   label: 'Done' },
  ];

  onSearch(e: Event): void {
    this.svc.setSearch((e.target as HTMLInputElement).value);
  }
}
