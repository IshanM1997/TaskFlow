import { Pipe, PipeTransform } from '@angular/core';
import { Task, FilterStatus } from './task.model';

@Pipe({ name: 'filterTasks', standalone: true, pure: false })
export class FilterTasksPipe implements PipeTransform {
  transform(tasks: Task[], status: FilterStatus, search: string): Task[] {
    let result = [...tasks].sort((a, b) => a.order - b.order);

    if (status !== 'all') {
      result = result.filter(t => t.status === status);
    }

    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    return result;
  }
}
