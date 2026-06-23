[README.md](https://github.com/user-attachments/files/29239968/README.md)
# ✅ TaskFlow — Angular Task Manager

![Angular](https://img.shields.io/badge/Angular-17-DD0031?style=flat-square&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Angular CDK](https://img.shields.io/badge/Angular_CDK-DragDrop-00897B?style=flat-square&logo=angular&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-Styled-CC6699?style=flat-square&logo=sass&logoColor=white)
![LocalStorage](https://img.shields.io/badge/Storage-LocalStorage-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

---

## 📖 About

**TaskFlow** is a fully offline, browser-based task manager built with **Angular 17** standalone components. It covers the complete CRUD lifecycle — create, read, update, and delete tasks — with real-time filtering, live search, drag-to-reorder, and automatic persistence via `localStorage`. No backend, no database, no API key required. Everything runs entirely in the browser.

The project is structured as a learning reference for core Angular patterns: Reactive Forms with validation, Signal-based state management, custom pipes for data transformation, custom structural directives, and Angular CDK drag-and-drop integration. Every feature maps directly to a specific Angular concept, making it easy to trace how the framework handles each responsibility.

---

## 🏷️ Topics

> Add these under **Repository → Settings → Topics** on GitHub so the project is discoverable:

```
angular angular17 typescript scss rxjs angular-cdk drag-and-drop
reactive-forms signals localstorage task-manager crud spa
frontend web-app standalone-components
```

---

## 📸 Preview

```
╔══════════════════════════════════════════════════════╗
║  ✅ TaskFlow              4 Total  1 Active  1 Done  ║
╠══════════════════════════════════════════════════════╣
║  🔍 Search…    [All] [Pending] [In Progress] [Done] ║
║                                        [+ New Task] ║
║  ⠿ ✓ Design component architecture   High | Done   ║
║  ⠿ ○ Integrate CDK DragDrop          High | Active  ║
║  ⠿ ○ Write unit tests                Med  | Pending ║
║  ⠿ ○ Deploy to Vercel                Low  | Pending ║
╚══════════════════════════════════════════════════════╝
```

---

## ✨ Features

| Feature | Details |
|---|---|
| **CRUD** | Add, Edit, Delete, Complete tasks |
| **Filter** | All / Pending / In Progress / Completed |
| **Search** | Live search across title, description, tags |
| **Drag-to-Reorder** | CDK DragDrop — order persisted to localStorage |
| **Priority** | Low / Medium / High with colour badges |
| **Due Dates** | Optional, with overdue highlight |
| **Tags** | Comma-separated, displayed inline |
| **LocalStorage** | Auto-save on every mutation; seed data on first load |
| **Animations** | `fadeInUp`, `scaleIn`, `checkPop` keyframes |
| **Accessible** | ARIA roles, keyboard navigation, focus ring |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 17 (Standalone Components) |
| Language | TypeScript 5.2 |
| Styling | SCSS with CSS custom properties |
| State | Angular Signals + `computed()` |
| Forms | Angular Reactive Forms |
| Drag & Drop | Angular CDK DragDrop |
| Persistence | Browser localStorage |
| Fonts | Space Grotesk (display) · Inter (body) |

---

## 🏗 File Structure

All source files live **flat** inside `src/app/` — no sub-folders.

```
taskflow/
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
└── src/
    ├── index.html
    ├── main.ts
    ├── styles.scss                  ← Design tokens, CDK overrides, keyframes
    └── app/
        ├── app.component.ts         ← Root shell (header + main layout)
        ├── app.config.ts            ← provideAnimations()
        ├── task.model.ts            ← Task, TaskStatus, FilterStatus interfaces
        ├── task.service.ts          ← Signal-based state + localStorage
        ├── filter-tasks.pipe.ts     ← Custom pipe: filter by status + search
        ├── tooltip.directive.ts     ← Custom directive: hover tooltip via Renderer2
        ├── auto-focus.directive.ts  ← Custom directive: focus input on init
        ├── header.component.ts      ← Stats bar (total / active / done)
        ├── filter-bar.component.ts  ← Search input + status tab strip
        ├── task-form.component.ts   ← Add/Edit modal with Reactive Forms
        ├── task-item.component.ts   ← Individual task card (CDK drag item)
        └── task-list.component.ts   ← CDK drop list + delete confirm dialog
```

---

## 🧠 Angular Concepts Used

### Standalone Components
Every file uses `standalone: true` — no NgModules anywhere.

### Reactive Forms
```typescript
form = this.fb.group({
  title:    ['', [Validators.required, Validators.minLength(3)]],
  priority: ['medium' as TaskPriority],
  status:   ['pending' as TaskStatus],
  dueDate:  [null as string | null],
  tags:     [''],
});
```

### Custom Pipe
```typescript
@Pipe({ name: 'filterTasks', standalone: true, pure: false })
export class FilterTasksPipe implements PipeTransform {
  transform(tasks: Task[], status: FilterStatus, search: string): Task[]
}
```

### Custom Directives
- **`[appTooltip]`** — `Renderer2`-based tooltip rendered onto `document.body`
- **`appAutoFocus`** — uses Input `transform` to accept a bare attribute safely

```typescript
@Input({ alias: 'appAutoFocus', transform: (v: unknown) => v !== false && v !== 'false' })
enabled = true;
```

### Signal-based State
```typescript
private tasksSignal = signal<Task[]>(this.loadFromStorage());
readonly stats = computed(() => ({
  total:     all.length,
  completed: all.filter(t => t.status === 'completed').length,
}));
```

### CDK DragDrop
```html
<div cdkDropList (cdkDropListDropped)="drop($event)">
  <div cdkDrag *ngFor="let task of tasks">...</div>
</div>
```

### localStorage Persistence
```typescript
private persist(tasks: Task[]): void {
  localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
}
```

---

## 🚀 Setup

```bash
# 1. Unzip and enter the project
unzip taskflow.zip
cd taskflow-flat

# 2. Install dependencies
npm install

# 3. Start the dev server
npm start
# → http://localhost:4200

# 4. Build for production
npm run build
```

---

## 🎨 Design Tokens

| Variable | Value | Usage |
|---|---|---|
| `--bg-base` | `#0f1117` | Page background |
| `--bg-surface` | `#181c27` | Cards, header |
| `--accent-lime` | `#b8f94a` | CTAs, completed state |
| `--accent-blue` | `#5b8dee` | In-progress state |
| `--accent-red` | `#ff5c5c` | Danger, high priority |
| `--font-display` | Space Grotesk | Headings |
| `--font-body` | Inter | Body text |
