import React, { useState } from 'react';
import { Category, Priority } from '../types';
import { CATEGORIES_LIST } from '../data/initialData';

interface QuickAddBarProps {
  onAddTask: (task: {
    title: string;
    category: Category;
    priority: Priority;
    dueTime?: string;
    dueDate?: string;
  }) => void;
}

export const QuickAddBar: React.FC<QuickAddBarProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Work');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [dueTime, setDueTime] = useState<string>('Today');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showScheduleMenu, setShowScheduleMenu] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      category,
      priority: category === 'Urgent' ? 'High' : priority,
      dueTime,
      dueDate: dueTime.includes('Tomorrow') ? 'Tomorrow' : 'Today',
    });

    setTitle('');
    setShowCategoryMenu(false);
    setShowScheduleMenu(false);
  };

  const scheduleOptions = [
    { label: 'Today', value: 'Today', icon: 'today' },
    { label: '2:00 PM', value: '2:00 PM', icon: 'schedule' },
    { label: '5:30 PM', value: '5:30 PM', icon: 'schedule' },
    { label: 'Tomorrow', value: 'Tomorrow', icon: 'event_upcoming' },
  ];

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="bg-surface-container-lowest rounded-xl p-2 pl-3 shadow-sm border border-surface-container-high/40 flex items-center gap-2 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
      >
        {/* Category Picker Button */}
        <div className="relative">
          <button
            type="button"
            id="quick-add-category-btn"
            aria-label="Select Category"
            onClick={() => {
              setShowCategoryMenu(!showCategoryMenu);
              setShowScheduleMenu(false);
            }}
            className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors shrink-0 cursor-pointer"
            title={`Category: ${category}`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {category === 'Work'
                ? 'business_center'
                : category === 'Personal'
                ? 'person'
                : category === 'Urgent'
                ? 'priority_high'
                : category === 'Health'
                ? 'favorite'
                : 'folder'}
            </span>
          </button>

          {/* Category Picker Popover */}
          {showCategoryMenu && (
            <div className="absolute left-0 bottom-11 w-48 bg-surface-container-lowest rounded-xl p-2 shadow-xl border border-surface-container-high z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <p className="text-[11px] font-bold text-on-surface-variant px-2 py-1 uppercase tracking-wider">
                Category
              </p>
              <div className="space-y-1 mt-1">
                {CATEGORIES_LIST.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCategory(cat.name);
                      if (cat.name === 'Urgent') setPriority('High');
                      setShowCategoryMenu(false);
                    }}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer text-left ${
                      category === cat.name
                        ? 'bg-primary text-on-primary font-semibold'
                        : 'text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {cat.icon}
                    </span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Text Input */}
        <input
          id="quick-add-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 bg-transparent text-on-surface placeholder:text-on-surface-variant text-[15px] focus:outline-none min-w-0"
        />

        {/* Schedule / Due Date Picker Button */}
        <div className="relative">
          <button
            type="button"
            id="quick-add-schedule-btn"
            aria-label="Task Due Date"
            onClick={() => {
              setShowScheduleMenu(!showScheduleMenu);
              setShowCategoryMenu(false);
            }}
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
              dueTime !== 'Today'
                ? 'bg-surface-container text-primary font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            title={`Due: ${dueTime}`}
          >
            <span className="material-symbols-outlined text-[20px]">
              calendar_add_on
            </span>
          </button>

          {/* Schedule Picker Popover */}
          {showScheduleMenu && (
            <div className="absolute right-0 bottom-11 w-44 bg-surface-container-lowest rounded-xl p-2 shadow-xl border border-surface-container-high z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <p className="text-[11px] font-bold text-on-surface-variant px-2 py-1 uppercase tracking-wider">
                Schedule
              </p>
              <div className="space-y-1 mt-1">
                {scheduleOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setDueTime(opt.value);
                      setShowScheduleMenu(false);
                    }}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer text-left ${
                      dueTime === opt.value
                        ? 'bg-primary text-on-primary font-semibold'
                        : 'text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {opt.icon}
                    </span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Add Task Button */}
        <button
          type="submit"
          id="quick-add-submit-btn"
          aria-label="Add Task"
          className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm shrink-0 transition-transform active:scale-90 hover:brightness-105 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">add</span>
        </button>
      </form>
    </div>
  );
};
