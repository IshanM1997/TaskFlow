export type TaskStatus   = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';
export type FilterStatus = 'all' | TaskStatus;

export interface Task {
  id:          string;
  title:       string;
  description: string;
  status:      TaskStatus;
  priority:    TaskPriority;
  dueDate:     string | null;
  createdAt:   string;
  updatedAt:   string;
  tags:        string[];
  order:       number;
}
