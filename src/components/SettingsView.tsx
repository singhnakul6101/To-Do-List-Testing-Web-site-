import React from 'react';

interface SettingsViewProps {
  streakDays: number;
  onUpdateStreak: (days: number) => void;
  onResetToDemo: () => void;
  taskCount: number;
  completedCount: number;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  streakDays,
  onUpdateStreak,
  onResetToDemo,
  taskCount,
  completedCount,
}) => {
  return (
    <div className="flex flex-col w-full gap-y-5">
      {/* Profile Card */}
      <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/40 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-on-primary text-[24px] font-bold shadow-sm">
          N
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[17px] font-bold text-on-surface truncate">Nakul Singh</h3>
            <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold uppercase">
              PRO
            </span>
          </div>
          <p className="text-[13px] text-on-surface-variant truncate">
            singhnakul6101@gmail.com
          </p>
          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-on-surface-variant">
            <span className="font-semibold text-primary">Stage 3 Achiever</span>
            <span>•</span>
            <span className="font-semibold text-tertiary flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[13px] material-symbols-fill">
                local_fire_department
              </span>
              {streakDays} Days Streak
            </span>
          </div>
        </div>
      </section>

      {/* Streak Management */}
      <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/40 space-y-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary text-[20px] material-symbols-fill">
            local_fire_department
          </span>
          <h4 className="text-[14px] font-bold text-on-surface">Consistency Streak</h4>
        </div>
        <p className="text-[13px] text-on-surface-variant">
          Track consecutive days you complete at least 3 daily momentum goals.
        </p>

        <div className="flex items-center justify-between bg-surface-container-low p-3 rounded-xl">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Active Streak
            </span>
            <span className="text-[20px] font-bold text-on-surface">
              {streakDays} Days Consecutive
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateStreak(Math.max(1, streakDays - 1))}
              className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center font-bold text-on-surface cursor-pointer"
            >
              -
            </button>
            <span className="w-6 text-center font-bold text-[15px]">{streakDays}</span>
            <button
              onClick={() => onUpdateStreak(streakDays + 1)}
              className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center font-bold text-on-surface cursor-pointer"
            >
              +
            </button>
          </div>
        </div>
      </section>

      {/* App Preferences */}
      <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/40 space-y-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">
            tune
          </span>
          <h4 className="text-[14px] font-bold text-on-surface">Preferences & Notifications</h4>
        </div>

        <div className="divide-y divide-surface-container-high/50 text-[13px]">
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-on-surface">Daily Momentum Reminder</p>
              <p className="text-[11px] text-on-surface-variant">Morning briefing at 8:00 AM</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 accent-primary rounded cursor-pointer"
            />
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-on-surface">Haptic & Audio Feedback</p>
              <p className="text-[11px] text-on-surface-variant">Play subtle sound on completion</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 accent-primary rounded cursor-pointer"
            />
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-on-surface">Auto-archive Completed</p>
              <p className="text-[11px] text-on-surface-variant">Keep yesterday's tasks archived</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 accent-primary rounded cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* Data Management */}
      <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/40 space-y-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-outline text-[20px]">
            database
          </span>
          <h4 className="text-[14px] font-bold text-on-surface">Data & Storage</h4>
        </div>

        <div className="flex items-center justify-between text-[12px] bg-surface-container-low p-3 rounded-xl text-on-surface-variant">
          <span>Stored tasks: {taskCount} ({completedCount} completed)</span>
          <span className="text-secondary font-semibold">Local Storage active</span>
        </div>

        <button
          onClick={onResetToDemo}
          className="w-full py-2.5 px-4 rounded-xl border border-error/30 text-error hover:bg-error/10 text-[13px] font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">restart_alt</span>
          Reset to Default Sample Tasks
        </button>
      </section>
    </div>
  );
};
