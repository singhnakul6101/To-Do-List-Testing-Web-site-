import React, { useState } from 'react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
}) => {
  const [showActions, setShowActions] = useState(false);

  // Time / date icon determination
  const getTimeIcon = (time?: string) => {
    if (!time) return 'schedule';
    if (time.includes('AM') || time.includes('PM') || time.includes(':')) {
      return 'schedule';
    }
    if (time.toLowerCase() === 'today') {
      return 'today';
    }
    if (time.toLowerCase() === 'tomorrow') {
      return 'event_upcoming';
    }
    return 'calendar_today';
  };

  // Priority Pill styling
  const renderPriorityPill = () => {
    switch (task.priority) {
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-error text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-error" />
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-fixed text-tertiary text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
            Medium
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-outline" />
            Low
          </span>
        );
    }
  };

  // Category Chip styling
  const renderCategoryChip = () => {
    const isWork = task.category.toLowerCase() === 'work';
    const isPersonal = task.category.toLowerCase() === 'personal';
    const isUrgent = task.category.toLowerCase() === 'urgent';
    const isHealth = task.category.toLowerCase() === 'health';

    let icon = 'folder';
    let iconClass = 'text-primary';

    if (isWork) {
      icon = 'business_center';
      iconClass = 'text-primary';
    } else if (isPersonal) {
      icon = 'person';
      iconClass = 'text-secondary';
    } else if (isUrgent) {
      icon = 'priority_high';
      iconClass = 'text-error';
    } else if (isHealth) {
      icon = 'favorite';
      iconClass = 'text-rose-600';
    }

    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-semibold">
        <span className={`material-symbols-outlined text-[13px] ${iconClass}`}>
          {icon}
        </span>
        {task.category}
      </span>
    );
  };

  if (task.completed) {
    return (
      <article
        id={`completed-task-${task.id}`}
        className="group bg-surface-container-low rounded-xl p-4 opacity-75 hover:opacity-100 flex items-start gap-3 transition-all duration-150 border border-transparent hover:border-surface-container-high"
      >
        {/* Toggle Button */}
        <button
          onClick={() => onToggleComplete(task.id)}
          aria-label="Mark task incomplete"
          className="w-[22px] h-[22px] rounded-[6px] bg-secondary flex items-center justify-center shrink-0 mt-0.5 text-on-secondary cursor-pointer hover:bg-secondary/90 transition-colors shadow-xs"
        >
          <span className="material-symbols-outlined text-[16px] font-bold">check</span>
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-normal line-through text-on-surface-variant select-none">
            {task.title}
          </p>
          <div className="flex items-center flex-wrap gap-2 mt-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-on-surface-variant">
              <span className="material-symbols-outlined text-[13px] text-secondary">
                check_circle
              </span>
              {task.completedAt || 'Completed'}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-[11px] font-medium text-on-surface-variant">
              {task.category}
            </span>
          </div>
        </div>

        {/* Quick Delete */}
        {onDeleteTask && (
          <button
            onClick={() => onDeleteTask(task.id)}
            aria-label="Delete task"
            className="opacity-0 group-hover:opacity-100 text-on-surface-variant hover:text-error transition-opacity p-1 cursor-pointer"
            title="Delete task"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        )}
      </article>
    );
  }

  return (
    <article
      id={`active-task-${task.id}`}
      className="group bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container-high/40 flex items-start gap-3 transition-all active:scale-[0.99] hover:shadow-md"
    >
      {/* Checkbox button */}
      <button
        onClick={() => onToggleComplete(task.id)}
        aria-label="Mark task completed"
        className="w-[22px] h-[22px] rounded-[6px] bg-surface-container-high shrink-0 mt-0.5 flex items-center justify-center transition-all cursor-pointer hover:bg-secondary hover:text-on-secondary group-hover:border-secondary"
      >
        <span className="material-symbols-outlined text-transparent hover:text-on-secondary text-[16px] font-bold transition-colors">
          check
        </span>
      </button>

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            onClick={() => onEditTask && onEditTask(task)}
            className="text-[15px] font-semibold text-on-surface leading-snug cursor-pointer hover:text-primary transition-colors"
          >
            {task.title}
          </p>

          {/* Quick options */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowActions(!showActions)}
              className="opacity-0 group-hover:opacity-100 text-on-surface-variant hover:text-on-surface p-1 rounded transition-opacity"
              aria-label="More options"
            >
              <span className="material-symbols-outlined text-[18px]">more_vert</span>
            </button>

            {showActions && (
              <div className="absolute right-0 top-6 w-32 bg-surface-container-lowest rounded-xl shadow-lg border border-surface-container-high p-1 z-20">
                {onEditTask && (
                  <button
                    onClick={() => {
                      setShowActions(false);
                      onEditTask(task);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[12px] font-medium text-on-surface hover:bg-surface-container rounded-lg flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[14px]">edit</span>
                    Edit
                  </button>
                )}
                {onDeleteTask && (
                  <button
                    onClick={() => {
                      setShowActions(false);
                      onDeleteTask(task.id);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[12px] font-medium text-error hover:bg-error/10 rounded-lg flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[14px]">delete</span>
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tags Row */}
        <div className="flex items-center flex-wrap gap-2 mt-2">
          {renderPriorityPill()}
          {renderCategoryChip()}

          {/* Due Time / Date */}
          {task.dueTime && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-on-surface-variant ml-auto">
              <span className="material-symbols-outlined text-[14px]">
                {getTimeIcon(task.dueTime)}
              </span>
              {task.dueTime}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
