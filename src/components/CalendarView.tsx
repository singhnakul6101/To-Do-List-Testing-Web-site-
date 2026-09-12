import React, { useState } from 'react';
import { Task } from '../types';
import { TaskCard } from './TaskCard';

interface CalendarViewProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onOpenNewTask: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onOpenNewTask,
}) => {
  // Days of the week strip
  const days = [
    { day: 'Mon', date: 8, label: 'Past' },
    { day: 'Tue', date: 9, label: 'Past' },
    { day: 'Wed', date: 10, label: 'Past' },
    { day: 'Thu', date: 11, label: 'Past' },
    { day: 'Fri', date: 12, label: 'Today', isToday: true },
    { day: 'Sat', date: 13, label: 'Tomorrow' },
    { day: 'Sun', date: 14, label: 'Upcoming' },
  ];

  const [selectedDate, setSelectedDate] = useState(12);

  // Filter tasks based on selected day
  const displayedTasks = tasks.filter((t) => {
    if (selectedDate === 12) {
      // Friday - Today
      return (
        !t.dueDate ||
        t.dueDate.toLowerCase() === 'today' ||
        (t.dueTime && !t.dueTime.toLowerCase().includes('tomorrow'))
      );
    }
    if (selectedDate === 13) {
      // Saturday - Tomorrow
      return (
        t.dueDate?.toLowerCase() === 'tomorrow' ||
        t.dueTime?.toLowerCase().includes('tomorrow')
      );
    }
    // Other days
    return false;
  });

  const morningTasks = displayedTasks.filter((t) => {
    const time = (t.dueTime || '').toUpperCase();
    return time.includes('AM') || time.includes('8:') || time.includes('9:') || time.includes('10:') || time.includes('11:');
  });

  const afternoonTasks = displayedTasks.filter((t) => {
    const time = (t.dueTime || '').toUpperCase();
    return time.includes('PM') || time.includes('12:') || time.includes('1:') || time.includes('2:') || time.includes('3:') || time.includes('4:') || time.includes('5:');
  });

  const otherTasks = displayedTasks.filter(
    (t) => !morningTasks.includes(t) && !afternoonTasks.includes(t)
  );

  return (
    <div className="flex flex-col w-full gap-y-5">
      {/* Calendar Week Ribbon */}
      <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/40">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              calendar_month
            </span>
            <h3 className="text-[15px] font-bold text-on-surface">September 2026</h3>
          </div>
          <span className="text-[12px] font-medium text-secondary bg-secondary-fixed/40 px-2.5 py-0.5 rounded-full">
            Week 37
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-center">
          {days.map((item) => {
            const isSelected = selectedDate === item.date;
            return (
              <button
                key={item.date}
                onClick={() => setSelectedDate(item.date)}
                className={`flex flex-col items-center py-2.5 rounded-xl transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-on-primary shadow-sm ring-2 ring-primary/30'
                    : item.isToday
                    ? 'bg-primary-fixed text-on-primary-fixed font-semibold'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="text-[11px] uppercase font-medium opacity-80">
                  {item.day}
                </span>
                <span className="text-[16px] font-bold mt-0.5">{item.date}</span>
                {item.isToday && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-1 ${
                      isSelected ? 'bg-white' : 'bg-primary'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Schedule Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-[17px] font-bold text-on-surface">
            {selectedDate === 12
              ? "Today's Agenda"
              : selectedDate === 13
              ? "Tomorrow's Schedule"
              : `Agenda for Sept ${selectedDate}`}
          </h2>
          <p className="text-[12px] text-on-surface-variant">
            {displayedTasks.length} task{displayedTasks.length === 1 ? '' : 's'} scheduled
          </p>
        </div>

        <button
          onClick={onOpenNewTask}
          className="flex items-center gap-1 px-3 py-1.5 bg-primary text-on-primary rounded-xl text-[12px] font-semibold hover:brightness-105 shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Schedule
        </button>
      </div>

      {displayedTasks.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl p-8 text-center border border-dashed border-surface-container-high">
          <span className="material-symbols-outlined text-outline text-[42px]">
            event_available
          </span>
          <p className="text-[15px] font-semibold text-on-surface mt-2">
            No tasks scheduled for this day
          </p>
          <p className="text-[13px] text-on-surface-variant mt-1">
            Enjoy your free time or queue up high-impact items.
          </p>
          <button
            onClick={onOpenNewTask}
            className="mt-4 px-4 py-2 bg-primary-container text-on-primary-container rounded-xl text-[13px] font-semibold shadow-xs hover:brightness-105 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Task
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {morningTasks.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 px-1">
                <span className="material-symbols-outlined text-[16px] text-tertiary">
                  wb_sunny
                </span>
                <span className="text-[12px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Morning Focus
                </span>
              </div>
              <div className="space-y-2.5">
                {morningTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                  />
                ))}
              </div>
            </div>
          )}

          {afternoonTasks.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 px-1">
                <span className="material-symbols-outlined text-[16px] text-primary">
                  light_mode
                </span>
                <span className="text-[12px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Afternoon & Evening
                </span>
              </div>
              <div className="space-y-2.5">
                {afternoonTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                  />
                ))}
              </div>
            </div>
          )}

          {otherTasks.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 px-1">
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  check_box
                </span>
                <span className="text-[12px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Anytime
                </span>
              </div>
              <div className="space-y-2.5">
                {otherTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
