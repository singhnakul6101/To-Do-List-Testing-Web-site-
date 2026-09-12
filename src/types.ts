export type Priority = 'High' | 'Medium' | 'Low';

export type Category = 'Work' | 'Personal' | 'Urgent' | 'Health' | 'Study' | string;

export interface Task {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  dueTime?: string;
  dueDate?: string; // YYYY-MM-DD or 'Today' | 'Tomorrow'
  completed: boolean;
  completedAt?: string;
  notes?: string;
  createdAt: string;
}

export type FilterType = 'All' | 'Work' | 'Personal' | 'Urgent' | 'Completed';

export type TabType = 'today' | 'calendar' | 'categories' | 'settings';

export type SortOption = 'Priority' | 'Time' | 'Alphabetical';

export interface CategoryInfo {
  id: string;
  name: string;
  icon: string;
  color: string; // CSS color or tailwind class
  iconColor: string;
  description?: string;
}
