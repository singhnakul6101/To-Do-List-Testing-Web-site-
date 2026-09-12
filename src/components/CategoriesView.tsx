import React, { useState } from 'react';
import { Task, CategoryInfo } from '../types';
import { CATEGORIES_LIST } from '../data/initialData';
import { TaskCard } from './TaskCard';

interface CategoriesViewProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onOpenNewTaskWithCategory: (category: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  tasks,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onOpenNewTaskWithCategory,
}) => {
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);

  return (
    <div className="flex flex-col w-full gap-y-5">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/40">
          <div className="flex items-center gap-1.5 text-primary">
            <span className="material-symbols-outlined text-[18px]">category</span>
            <span className="text-[11px] font-bold uppercase tracking-wider">Categories</span>
          </div>
          <p className="text-[24px] font-bold text-on-surface mt-1">{CATEGORIES_LIST.length}</p>
          <p className="text-[12px] text-on-surface-variant">Active project spaces</p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/40">
          <div className="flex items-center gap-1.5 text-secondary">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span className="text-[11px] font-bold uppercase tracking-wider">Completion</span>
          </div>
          <p className="text-[24px] font-bold text-on-surface mt-1">
            {tasks.length > 0
              ? `${Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100)}%`
              : '0%'}
          </p>
          <p className="text-[12px] text-on-surface-variant">
            {tasks.filter((t) => t.completed).length} of {tasks.length} tasks done
          </p>
        </div>
      </div>

      {/* Category List */}
      <div className="space-y-3">
        <h3 className="text-[13px] font-bold uppercase tracking-wider text-on-surface px-1">
          Workspaces & Contexts
        </h3>

        {CATEGORIES_LIST.map((cat: CategoryInfo) => {
          const catTasks = tasks.filter(
            (t) => t.category.toLowerCase() === cat.name.toLowerCase()
          );
          const completedCount = catTasks.filter((t) => t.completed).length;
          const totalCount = catTasks.length;
          const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
          const isExpanded = selectedCatId === cat.id;

          return (
            <div
              key={cat.id}
              className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/40 transition-all"
            >
              {/* Category Header Row */}
              <div
                onClick={() => setSelectedCatId(isExpanded ? null : cat.id)}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.color}`}
                  >
                    <span className="material-symbols-outlined text-[22px]">
                      {cat.icon}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-[15px] font-bold text-on-surface">{cat.name}</h4>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface-container font-semibold text-on-surface-variant">
                        {totalCount} task{totalCount === 1 ? '' : 's'}
                      </span>
                    </div>
                    <p className="text-[12px] text-on-surface-variant line-clamp-1 mt-0.5">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-on-surface">
                    {percentage}%
                  </span>
                  <span
                    className={`material-symbols-outlined text-[20px] text-on-surface-variant transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 w-full bg-surface-container h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Expanded Tasks in this Category */}
              {isExpanded && (
                <div className="mt-4 pt-3 border-t border-surface-container-high/60 space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                      Tasks in {cat.name}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenNewTaskWithCategory(cat.name);
                      }}
                      className="text-[12px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">add</span>
                      Add to {cat.name}
                    </button>
                  </div>

                  {catTasks.length === 0 ? (
                    <p className="text-[13px] text-on-surface-variant py-2 italic">
                      No tasks in this category yet.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {catTasks.map((t) => (
                        <TaskCard
                          key={t.id}
                          task={t}
                          onToggleComplete={onToggleComplete}
                          onEditTask={onEditTask}
                          onDeleteTask={onDeleteTask}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
