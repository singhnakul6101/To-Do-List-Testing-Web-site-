/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Task, FilterType, TabType, SortOption, Category, Priority } from './types';
import { INITIAL_TASKS } from './data/initialData';
import { Header } from './components/Header';
import { MomentumWidget } from './components/MomentumWidget';
import { FilterPills } from './components/FilterPills';
import { QuickAddBar } from './components/QuickAddBar';
import { TaskCard } from './components/TaskCard';
import { TaskModal } from './components/TaskModal';
import { BottomNav } from './components/BottomNav';
import { CalendarView } from './components/CalendarView';
import { CategoriesView } from './components/CategoriesView';
import { SettingsView } from './components/SettingsView';

const STORAGE_KEY_TASKS = 'taskflow_tasks_v1';
const STORAGE_KEY_STREAK = 'taskflow_streak_v1';

export default function App() {
  // Tasks state with localStorage recovery
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_TASKS;
  });

  // Streak state
  const [streakDays, setStreakDays] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STREAK);
      if (saved) return Number(saved);
    } catch {
      // Fallback
    }
    return 5;
  });

  // UI state
  const [currentTab, setCurrentTab] = useState<TabType>('today');
  const [currentFilter, setCurrentFilter] = useState<FilterType>('All');
  const [isCompletedOpen, setIsCompletedOpen] = useState(true);
  const [sortOption, setSortOption] = useState<SortOption>('Priority');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Synchronize with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed saving tasks', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STREAK, streakDays.toString());
    } catch (e) {
      console.error('Failed saving streak', e);
    }
  }, [streakDays]);

  // Counts for filters and momentum
  const counts = useMemo(() => {
    const all = tasks.length;
    const work = tasks.filter((t) => t.category.toLowerCase() === 'work').length;
    const personal = tasks.filter((t) => t.category.toLowerCase() === 'personal').length;
    const urgent = tasks.filter(
      (t) => t.priority === 'High' || t.category.toLowerCase() === 'urgent'
    ).length;
    const completed = tasks.filter((t) => t.completed).length;

    return { all, work, personal, urgent, completed };
  }, [tasks]);

  // Handle task toggling
  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nowCompleted = !t.completed;
          const timeString = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });
          return {
            ...t,
            completed: nowCompleted,
            completedAt: nowCompleted ? `Done at ${timeString}` : undefined,
          };
        }
        return t;
      })
    );
  };

  // Add a new task
  const handleAddTask = (taskData: {
    title: string;
    category: Category;
    priority: Priority;
    dueTime?: string;
    dueDate?: string;
    notes?: string;
  }) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskData.title,
      category: taskData.category,
      priority: taskData.priority,
      dueTime: taskData.dueTime,
      dueDate: taskData.dueDate,
      notes: taskData.notes,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  // Save edited or newly created modal task
  const handleSaveModalTask = (taskData: {
    id?: string;
    title: string;
    category: Category;
    priority: Priority;
    dueTime?: string;
    dueDate?: string;
    notes?: string;
  }) => {
    if (taskData.id) {
      // Edit existing
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskData.id
            ? {
                ...t,
                title: taskData.title,
                category: taskData.category,
                priority: taskData.priority,
                dueTime: taskData.dueTime,
                dueDate: taskData.dueDate,
                notes: taskData.notes,
              }
            : t
        )
      );
    } else {
      // Create new
      handleAddTask(taskData);
    }
  };

  // Delete task
  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Clear completed tasks
  const handleClearCompleted = () => {
    if (confirm('Clear all completed tasks?')) {
      setTasks((prev) => prev.filter((t) => !t.completed));
    }
  };

  // Reset to initial screenshot demo data
  const handleResetToDemo = () => {
    if (confirm('Reset tasks back to original demo values?')) {
      setTasks(INITIAL_TASKS);
      setStreakDays(5);
    }
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (currentFilter === 'All') return true;
      if (currentFilter === 'Work') return t.category.toLowerCase() === 'work';
      if (currentFilter === 'Personal') return t.category.toLowerCase() === 'personal';
      if (currentFilter === 'Urgent')
        return t.priority === 'High' || t.category.toLowerCase() === 'urgent';
      if (currentFilter === 'Completed') return t.completed;
      return true;
    });
  }, [tasks, currentFilter]);

  // Split into active and completed
  const activeTasks = useMemo(() => {
    const list = filteredTasks.filter((t) => !t.completed);

    if (sortOption === 'Priority') {
      const weight = { High: 3, Medium: 2, Low: 1 };
      return [...list].sort((a, b) => weight[b.priority] - weight[a.priority]);
    } else if (sortOption === 'Time') {
      return [...list].sort((a, b) => (a.dueTime || '').localeCompare(b.dueTime || ''));
    } else if (sortOption === 'Alphabetical') {
      return [...list].sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [filteredTasks, sortOption]);

  const completedTasks = useMemo(() => {
    return filteredTasks.filter((t) => t.completed);
  }, [filteredTasks]);

  // Cycle sort options
  const toggleSort = () => {
    if (sortOption === 'Priority') setSortOption('Time');
    else if (sortOption === 'Time') setSortOption('Alphabetical');
    else setSortOption('Priority');
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-['Inter',sans-serif]">
      {/* Top App Header */}
      <Header currentTab={currentTab} streakDays={streakDays} />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-xl mx-auto pt-20 pb-28 px-5">
        {currentTab === 'today' && (
          <div className="flex flex-col w-full gap-y-5 animate-in fade-in duration-200">
            {/* Progress Summary Widget */}
            <MomentumWidget
              completedCount={counts.completed}
              totalCount={counts.all}
              streakDays={streakDays}
            />

            {/* Filter Pills Carousel */}
            <FilterPills
              currentFilter={currentFilter}
              onSelectFilter={setCurrentFilter}
              counts={counts}
            />

            {/* Quick Add Task Input Bar */}
            <QuickAddBar onAddTask={handleAddTask} />

            {/* Active Tasks Section */}
            {currentFilter !== 'Completed' && (
              <section className="flex flex-col gap-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[13px] font-bold uppercase tracking-wider text-on-surface">
                      Active Tasks
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold">
                      {activeTasks.length}
                    </span>
                  </div>

                  <button
                    onClick={toggleSort}
                    id="task-sort-btn"
                    className="text-on-surface-variant hover:text-primary flex items-center gap-0.5 text-[11px] font-semibold transition-colors cursor-pointer"
                    title="Change Sort Order"
                  >
                    <span className="material-symbols-outlined text-[16px]">swap_vert</span>
                    <span>{sortOption}</span>
                  </button>
                </div>

                {activeTasks.length === 0 ? (
                  <div className="bg-surface-container-lowest rounded-xl p-6 text-center border border-dashed border-surface-container-high">
                    <span className="material-symbols-outlined text-secondary text-[36px]">
                      task_alt
                    </span>
                    <p className="text-[14px] font-semibold text-on-surface mt-1">
                      No active tasks in this view
                    </p>
                    <p className="text-[12px] text-on-surface-variant mt-0.5">
                      All caught up or try switching filters above.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {activeTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggleComplete={handleToggleComplete}
                        onEditTask={(t) => {
                          setEditingTask(t);
                          setIsTaskModalOpen(true);
                        }}
                        onDeleteTask={handleDeleteTask}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Completed Tasks Section (Collapsible) */}
            {completedTasks.length > 0 && (
              <section className="flex flex-col gap-y-2 mt-1">
                <div className="flex items-center justify-between py-2 px-1">
                  <button
                    id="completed-toggle-btn"
                    onClick={() => setIsCompletedOpen(!isCompletedOpen)}
                    className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                  >
                    <span
                      className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${
                        isCompletedOpen ? 'rotate-0' : '-rotate-90'
                      }`}
                    >
                      expand_more
                    </span>
                    <h3 className="text-[13px] font-bold uppercase tracking-wider">
                      Completed
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container text-[11px] font-semibold text-on-surface-variant">
                      {completedTasks.length}
                    </span>
                  </button>

                  <button
                    onClick={handleClearCompleted}
                    className="text-[11px] font-semibold text-secondary hover:underline cursor-pointer"
                  >
                    Clear all
                  </button>
                </div>

                {isCompletedOpen && (
                  <div className="flex flex-col gap-y-2 animate-in fade-in duration-150">
                    {completedTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggleComplete={handleToggleComplete}
                        onDeleteTask={handleDeleteTask}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        )}

        {/* Calendar Screen */}
        {currentTab === 'calendar' && (
          <CalendarView
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onEditTask={(t) => {
              setEditingTask(t);
              setIsTaskModalOpen(true);
            }}
            onDeleteTask={handleDeleteTask}
            onOpenNewTask={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
          />
        )}

        {/* Categories Screen */}
        {currentTab === 'categories' && (
          <CategoriesView
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onEditTask={(t) => {
              setEditingTask(t);
              setIsTaskModalOpen(true);
            }}
            onDeleteTask={handleDeleteTask}
            onOpenNewTaskWithCategory={(catName) => {
              setEditingTask({
                id: '',
                title: '',
                category: catName,
                priority: catName === 'Urgent' ? 'High' : 'Medium',
                dueTime: 'Today',
                completed: false,
                createdAt: new Date().toISOString(),
              });
              setIsTaskModalOpen(true);
            }}
          />
        )}

        {/* Settings Screen */}
        {currentTab === 'settings' && (
          <SettingsView
            streakDays={streakDays}
            onUpdateStreak={setStreakDays}
            onResetToDemo={handleResetToDemo}
            taskCount={tasks.length}
            completedCount={counts.completed}
          />
        )}
      </main>

      {/* Floating Quick-Action Button */}
      {currentTab === 'today' && (
        <div className="fixed right-5 bottom-20 z-40 max-w-xl mx-auto">
          <button
            id="floating-add-task-btn"
            aria-label="Create Quick Task"
            onClick={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
            className="w-14 h-14 rounded-full bg-primary text-on-primary shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-90 cursor-pointer hover:brightness-110"
          >
            <span className="material-symbols-outlined text-[30px]">edit_note</span>
          </button>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav currentTab={currentTab} onChangeTab={setCurrentTab} />

      {/* Task Creation & Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveModalTask}
        taskToEdit={editingTask && editingTask.id ? editingTask : null}
      />
    </div>
  );
}
