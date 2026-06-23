import { Component } from '@angular/core';
import { HeaderComponent } from './header.component';
import { TaskListComponent } from './task-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, TaskListComponent],
  template: `
    <app-header />
    <main class="main">
      <div class="container">
        <app-task-list />
      </div>
    </main>
  `,
  styles: [`
    .main { padding: 1.5rem 1rem; min-height: calc(100vh - 64px); }
    .container { max-width: 800px; margin: 0 auto; }
  `]
})
export class AppComponent {}
