'use client';

import React, { useRef, useState } from 'react';
import './SettingsPage.css';
import { useLocale } from '../contexts/LocaleContext';
import { ChangePasswordForm } from './settings/ChangePasswordForm';
import { BusinessModelSettings } from './settings/BusinessModelSettings';

type SettingsTab = 'profile' | 'security';

const TAB_ORDER: SettingsTab[] = ['profile', 'security'];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const { t } = useLocale();
  const tabRefs = useRef<Record<SettingsTab, HTMLButtonElement | null>>({
    profile: null,
    security: null,
  });

  const selectTab = (tab: SettingsTab) => {
    setActiveTab(tab);
    tabRefs.current[tab]?.focus();
  };

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const currentIndex = TAB_ORDER.indexOf(activeTab);
    let nextIndex: number | null = null;

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      nextIndex = (currentIndex + 1) % TAB_ORDER.length;
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      nextIndex = (currentIndex - 1 + TAB_ORDER.length) % TAB_ORDER.length;
    } else if (event.key === 'Home') {
      event.preventDefault();
      nextIndex = 0;
    } else if (event.key === 'End') {
      event.preventDefault();
      nextIndex = TAB_ORDER.length - 1;
    }

    if (nextIndex !== null) {
      selectTab(TAB_ORDER[nextIndex]);
    }
  };

  return (
    <div className='settings-page'>
      <header className='settings-header animate-fade-in'>
        <h1>{t.settings.accountTitle}</h1>
        <p className='lead'>{t.settings.accountSubtitle}</p>
      </header>

      <div
        className='tabs-nav'
        role='tablist'
        aria-label={t.settings.title}
        aria-orientation='horizontal'
      >
        <button
          ref={(el) => {
            tabRefs.current.profile = el;
          }}
          className='tab-button'
          role='tab'
          id='tab-profile'
          aria-selected={activeTab === 'profile'}
          aria-controls='panel-profile'
          tabIndex={activeTab === 'profile' ? 0 : -1}
          onClick={() => selectTab('profile')}
          onKeyDown={handleTabKeyDown}
        >
          <svg
            width='18'
            height='18'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            className='tab-icon'
          >
            <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'></path>
            <circle cx='12' cy='7' r='4'></circle>
          </svg>
          {t.settings.tabProfile}
        </button>
        <button
          ref={(el) => {
            tabRefs.current.security = el;
          }}
          className='tab-button'
          role='tab'
          id='tab-security'
          aria-selected={activeTab === 'security'}
          aria-controls='panel-security'
          tabIndex={activeTab === 'security' ? 0 : -1}
          onClick={() => selectTab('security')}
          onKeyDown={handleTabKeyDown}
        >
          <svg
            width='18'
            height='18'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            className='tab-icon'
          >
            <rect x='3' y='11' width='18' height='11' rx='2' ry='2'></rect>
            <path d='M7 11V7a5 5 0 0 1 10 0v4'></path>
          </svg>
          {t.settings.tabSecurity}
        </button>
      </div>

      <div className='tab-panels'>
        <div
          className='tab-panel'
          role='tabpanel'
          id='panel-profile'
          aria-labelledby='tab-profile'
          tabIndex={0}
          hidden={activeTab !== 'profile'}
        >
          <BusinessModelSettings />
        </div>
        <div
          className='tab-panel'
          role='tabpanel'
          id='panel-security'
          aria-labelledby='tab-security'
          tabIndex={0}
          hidden={activeTab !== 'security'}
        >
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
