import React from 'react';
import { FilterType } from '../types';

interface FilterPillsProps {
  currentFilter: FilterType;
  onSelectFilter: (filter: FilterType) => void;
  counts: {
    all: number;
    work: number;
    personal: number;
    urgent: number;
    completed: number;
  };
}

export const FilterPills: React.FC<FilterPillsProps> = ({
  currentFilter,
  onSelectFilter,
  counts,
}) => {
  const filters: Array<{
    id: FilterType;
    label: string;
    icon: string;
    iconColor: string;
    count: number;
    isUrgentStyle?: boolean;
  }> = [
    {
      id: 'All',
      label: 'All',
      icon: 'apps',
      iconColor: '',
      count: counts.all,
    },
    {
      id: 'Work',
      label: 'Work',
      icon: 'business_center',
      iconColor: 'text-primary',
      count: counts.work,
    },
    {
      id: 'Personal',
      label: 'Personal',
      icon: 'person',
      iconColor: 'text-secondary',
      count: counts.personal,
    },
    {
      id: 'Urgent',
      label: 'Urgent',
      icon: 'priority_high',
      iconColor: 'text-error',
      count: counts.urgent,
      isUrgentStyle: true,
    },
    {
      id: 'Completed',
      label: 'Completed',
      icon: 'task_alt',
      iconColor: 'text-secondary',
      count: counts.completed,
    },
  ];

  return (
    <section className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-5 px-5">
      {filters.map((filter) => {
        const isActive = currentFilter === filter.id;

        return (
          <button
            key={filter.id}
            id={`filter-pill-${filter.id.toLowerCase()}`}
            onClick={() => onSelectFilter(filter.id)}
            className={`shrink-0 px-4 py-2 rounded-full font-semibold text-[13px] shadow-sm transition-all duration-150 active:scale-95 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              isActive
                ? 'bg-primary text-on-primary ring-2 ring-primary/30'
                : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-surface-container-high/50'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[16px] ${
                isActive ? 'text-on-primary' : filter.iconColor || 'text-on-surface-variant'
              }`}
            >
              {filter.icon}
            </span>
            <span>{filter.label}</span>
            <span
              className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold flex items-center justify-center ${
                isActive
                  ? 'bg-on-primary/20 text-on-primary'
                  : filter.isUrgentStyle
                  ? 'text-error bg-error/10'
                  : 'text-on-surface-variant bg-surface-container-high'
              }`}
            >
              {filter.count}
            </span>
          </button>
        );
      })}
    </section>
  );
};
