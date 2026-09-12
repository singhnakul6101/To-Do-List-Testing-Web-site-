import React, { useState } from 'react';
import { TASKFLOW_LOGO_URL } from '../data/initialData';
import { TabType } from '../types';

interface HeaderProps {
  currentTab: TabType;
  streakDays: number;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, streakDays }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const getTabTitle = () => {
    switch (currentTab) {
      case 'today':
        return 'Today Tasks';
      case 'calendar':
        return 'Calendar & Schedule';
      case 'categories':
        return 'Categories & Projects';
      case 'settings':
        return 'Settings & Preferences';
      default:
        return 'Today Tasks';
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="max-w-xl mx-auto h-16 px-5 flex items-center justify-between">
        {/* Brand & Page Title */}
        <div className="flex items-center gap-2.5">
          <img
            alt="TaskFlow Icon"
            className="h-8 w-auto object-contain rounded-md"
            src={TASKFLOW_LOGO_URL}
          />
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-on-surface-variant leading-none tracking-tight">
              TaskFlow
            </span>
            <h1 className="text-[20px] font-bold text-on-surface leading-tight tracking-tight">
              {getTabTitle()}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {/* Notifications Button */}
          <div className="relative">
            <button
              id="notifications-btn"
              aria-label="Notifications"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
                if (unreadCount > 0) setUnreadCount(0);
              }}
              className="relative w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-primary-container ring-2 ring-surface animate-pulse" />
              )}
            </button>

            {/* Notification Popover Drawer */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded-2xl p-4 shadow-xl border border-surface-container-high z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-surface-container-high">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">notifications_active</span>
                    <span className="text-[13px] font-bold text-on-surface">Notifications</span>
                  </div>
                  <span className="text-[11px] text-secondary font-medium">All caught up</span>
                </div>

                <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto no-scrollbar">
                  <div className="p-2.5 rounded-xl bg-surface-container-low text-[12px] flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-tertiary text-[18px] mt-0.5 material-symbols-fill">
                      local_fire_department
                    </span>
                    <div>
                      <p className="font-semibold text-on-surface">Streak Milestone!</p>
                      <p className="text-on-surface-variant text-[11px]">
                        You're on a {streakDays}-day consistency streak. Complete today's tasks to reach Stage 4!
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-surface-container-low text-[12px] flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">
                      schedule
                    </span>
                    <div>
                      <p className="font-semibold text-on-surface">Upcoming Task</p>
                      <p className="text-on-surface-variant text-[11px]">
                        "Finalize quarterly product roadmap" is scheduled for 2:00 PM today.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowNotifications(false)}
                  className="mt-3 w-full py-1.5 text-center text-[12px] text-primary font-medium hover:bg-surface-container rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="relative">
            <button
              id="user-profile-btn"
              aria-label="User Profile"
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 ml-1 shadow-sm hover:brightness-110 transition-all cursor-pointer ring-2 ring-primary/20"
            >
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </button>

            {/* Profile Popover */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-72 bg-surface-container-lowest rounded-2xl p-4 shadow-xl border border-surface-container-high z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center gap-3 pb-3 border-b border-surface-container-high">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-[16px]">
                    N
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p className="font-semibold text-on-surface text-[14px] truncate">Nakul Singh</p>
                    <p className="text-[11px] text-on-surface-variant truncate">singhnakul6101@gmail.com</p>
                  </div>
                </div>

                <div className="py-2.5 space-y-1.5 text-[12px]">
                  <div className="flex items-center justify-between px-1 text-on-surface-variant">
                    <span>Productivity Level</span>
                    <span className="font-semibold text-primary">Stage 3 Pro</span>
                  </div>
                  <div className="flex items-center justify-between px-1 text-on-surface-variant">
                    <span>Consistency Streak</span>
                    <span className="font-semibold text-tertiary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] material-symbols-fill">local_fire_department</span>
                      {streakDays} Days
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowProfile(false)}
                  className="w-full mt-2 py-1.5 bg-surface-container-high hover:bg-surface-container text-on-surface rounded-lg text-[12px] font-medium transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
