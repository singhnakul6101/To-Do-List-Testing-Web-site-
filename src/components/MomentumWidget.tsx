import React from 'react';

interface MomentumWidgetProps {
  completedCount: number;
  totalCount: number;
  streakDays: number;
}

export const MomentumWidget: React.FC<MomentumWidgetProps> = ({
  completedCount,
  totalCount,
  streakDays,
}) => {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const remainingCount = Math.max(0, totalCount - completedCount);

  // SVG circular circumference: 2 * PI * 20 ≈ 125.66
  const circumference = 125.66;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Stage calculation
  const stageNumber = Math.min(4, Math.max(1, Math.floor(streakDays / 2) + 1));

  const getEncouragementText = () => {
    if (totalCount === 0) return 'Add your first task to build momentum!';
    if (percentage === 100) return 'Spectacular! All scheduled tasks completed today!';
    if (percentage >= 60) return `Crushing it! Just ${remainingCount} high-impact task${remainingCount === 1 ? '' : 's'} left.`;
    if (percentage >= 30) return `Great pace! ${remainingCount} tasks queued for completion.`;
    return `Let's get rolling! ${remainingCount} task${remainingCount === 1 ? '' : 's'} ready for focus.`;
  };

  return (
    <section className="relative overflow-hidden bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container-high/40 transition-all">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col min-w-0 flex-1">
          {/* Daily Momentum Tag */}
          <div className="flex items-center gap-1.5 mb-1">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-secondary-fixed text-on-secondary-fixed shadow-xs">
              <span className="material-symbols-outlined text-[14px] material-symbols-fill">
                bolt
              </span>
            </span>
            <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
              Daily Momentum
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-[20px] font-bold text-on-surface tracking-tight truncate">
            {completedCount} of {totalCount} Completed
          </h2>

          {/* Subtitle */}
          <p className="text-[13px] text-on-surface-variant mt-0.5 font-normal">
            {getEncouragementText()}
          </p>
        </div>

        {/* Circular Radial Progress */}
        <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 48 48">
            <circle
              className="text-surface-container"
              cx="24"
              cy="24"
              fill="none"
              r="20"
              stroke="currentColor"
              strokeWidth="4"
            />
            <circle
              className="text-primary-container transition-all duration-700 ease-out"
              cx="24"
              cy="24"
              fill="none"
              r="20"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-[13px] font-bold text-on-surface">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Micro Streak & Milestone Strip */}
      <div className="mt-4 pt-3 flex items-center justify-between bg-surface-container-low rounded-lg px-3 py-2 border border-surface-container-high/30">
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-[18px] text-tertiary material-symbols-fill"
          >
            local_fire_department
          </span>
          <span className="text-[12px] font-semibold text-on-surface">
            {streakDays}-day consistency streak
          </span>
        </div>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4].map((dot) => (
            <span
              key={dot}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                dot <= stageNumber ? 'bg-primary-container' : 'bg-surface-container-highest'
              }`}
            />
          ))}
          <span className="text-[11px] font-semibold text-on-surface-variant ml-1.5">
            Stage {stageNumber}
          </span>
        </div>
      </div>
    </section>
  );
};
