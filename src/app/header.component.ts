import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from './task.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="header__brand">
        <span class="header__logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="#b8f94a"/>
            <path d="M7 14l5 5 9-9" stroke="#0f1117" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span class="header__title">TaskFlow</span>
      </div>
      <div class="header__stats">
        <div class="stat">
          <span class="stat__value">{{ svc.stats().total }}</span>
          <span class="stat__label">Total</span>
        </div>
        <div class="stat stat--blue">
          <span class="stat__value">{{ svc.stats().inProgress }}</span>
          <span class="stat__label">Active</span>
        </div>
        <div class="stat stat--lime">
          <span class="stat__value">{{ svc.stats().completed }}</span>
          <span class="stat__label">Done</span>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 1rem 2rem;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-subtle);
      position: sticky; top: 0; z-index: 100;
    }
    .header__brand { display: flex; align-items: center; gap: 0.625rem; }
    .header__logo  { display: flex; align-items: center; filter: drop-shadow(0 0 8px rgba(184,249,74,0.3)); }
    .header__title { font-family: var(--font-display); font-size: 1.25rem; font-weight: 700; letter-spacing: -0.02em; }
    .header__stats { display: flex; gap: 1.5rem; }
    .stat { display: flex; flex-direction: column; align-items: center; }
    .stat__value { font-family: var(--font-display); font-size: 1.25rem; font-weight: 700; color: var(--text-secondary); line-height: 1.2; }
    .stat__label { font-size: 0.6875rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 500; }
    .stat--blue .stat__value { color: var(--accent-blue); }
    .stat--lime .stat__value { color: var(--accent-lime); }
    @media (max-width: 600px) {
      .header { padding: 0.875rem 1rem; }
      .header__stats { gap: 1rem; }
    }
  `]
})
export class HeaderComponent {
  protected svc = inject(TaskService);
}
