import React, { useState, useEffect } from 'react';
import { Task, Category, Priority } from '../types';
import { CATEGORIES_LIST } from '../data/initialData';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: {
    id?: string;
    title: string;
    category: Category;
    priority: Priority;
    dueTime?: string;
    dueDate?: string;
    notes?: string;
  }) => void;
  taskToEdit?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  taskToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Work');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [dueTime, setDueTime] = useState('2:00 PM');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setCategory(taskToEdit.category);
      setPriority(taskToEdit.priority);
      setDueTime(taskToEdit.dueTime || 'Today');
      setNotes(taskToEdit.notes || '');
    } else {
      setTitle('');
      setCategory('Work');
      setPriority('Medium');
      setDueTime('Today');
      setNotes('');
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: taskToEdit?.id,
      title: title.trim(),
      category,
      priority,
      dueTime: dueTime.trim() || 'Today',
      dueDate: dueTime.includes('Tomorrow') ? 'Tomorrow' : 'Today',
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-5 shadow-2xl border border-surface-container-high animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">
              {taskToEdit ? 'edit_note' : 'add_task'}
            </span>
            <h3 className="text-[17px] font-bold text-on-surface">
              {taskToEdit ? 'Edit Task' : 'New Task'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-[12px] font-semibold text-on-surface-variant mb-1">
              TASK TITLE
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Finalize quarterly presentation"
              className="w-full bg-surface-container-low border border-surface-container-high rounded-xl px-3.5 py-2.5 text-[14px] text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-[12px] font-semibold text-on-surface-variant mb-1.5">
              CATEGORY
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES_LIST.map((cat) => {
                const isSelected = category.toLowerCase() === cat.name.toLowerCase();
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCategory(cat.name);
                      if (cat.name === 'Urgent') setPriority('High');
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-[12px] font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-on-primary border-primary shadow-xs'
                        : 'bg-surface-container-low text-on-surface border-surface-container-high hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {cat.icon}
                    </span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-[12px] font-semibold text-on-surface-variant mb-1.5">
              PRIORITY LEVEL
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['High', 'Medium', 'Low'] as Priority[]).map((lvl) => {
                const isSelected = priority === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setPriority(lvl)}
                    className={`py-2 rounded-xl text-[12px] font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      isSelected
                        ? lvl === 'High'
                          ? 'bg-error-container text-error border-error'
                          : lvl === 'Medium'
                          ? 'bg-tertiary-fixed text-tertiary border-tertiary'
                          : 'bg-surface-container-highest text-on-surface-variant border-outline'
                        : 'bg-surface-container-low text-on-surface-variant border-surface-container-high hover:bg-surface-container'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        lvl === 'High'
                          ? 'bg-error'
                          : lvl === 'Medium'
                          ? 'bg-tertiary'
                          : 'bg-outline'
                      }`}
                    />
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Due Time / Schedule */}
          <div>
            <label className="block text-[12px] font-semibold text-on-surface-variant mb-1">
              DUE TIME OR SCHEDULE
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                placeholder="e.g. 2:00 PM, Today, Tomorrow"
                className="flex-1 bg-surface-container-low border border-surface-container-high rounded-xl px-3 py-2 text-[13px] text-on-surface focus:outline-none focus:border-primary"
              />
              {['Today', '2:00 PM', 'Tomorrow'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setDueTime(preset)}
                  className="px-2.5 py-1.5 bg-surface-container hover:bg-surface-container-high rounded-xl text-[11px] font-semibold text-on-surface-variant cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[12px] font-semibold text-on-surface-variant mb-1">
              NOTES (OPTIONAL)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add key bullet points, links, or context..."
              className="w-full bg-surface-container-low border border-surface-container-high rounded-xl p-3 text-[13px] text-on-surface focus:outline-none focus:border-primary resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[13px] font-semibold text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-[13px] font-semibold bg-primary text-on-primary hover:brightness-105 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              {taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
