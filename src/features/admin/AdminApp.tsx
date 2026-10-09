import React, { useEffect, useState } from 'react';
import { AdminLayout, type AdminSection } from './components/AdminLayout';
import { OverviewPage } from './pages/OverviewPage';
import { MenuManagerPage } from './pages/MenuManagerPage';
import { TablesPage } from './pages/TablesPage';
import { GuestServicesPage } from './pages/GuestServicesPage';
import { GuestInboxPage } from './pages/GuestInboxPage';
import { RestaurantSettingsPage } from './pages/RestaurantSettingsPage';
import { DEMO_FEEDBACK_STORAGE_KEY, DEMO_REQUESTS_STORAGE_KEY, getFeedback, getPublishedAt, getRequests, loadAdminDraft, publishAdminSetup, publishServiceSettings, saveAdminDraft, updateFeedbackStatus, updateRequestStatus, type DemoSetup, type GuestFeedback, type GuestRequest } from '../../data/demoStore';

const sections: AdminSection[] = ['overview', 'menu', 'tables', 'services', 'inbox', 'settings'];
const initialSection = (): AdminSection => {
  const query = new URLSearchParams(window.location.search).get('section');
  return sections.includes(query as AdminSection) ? query as AdminSection : 'overview';
};

export const AdminApp: React.FC = () => {
  const [section, setSection] = useState<AdminSection>(initialSection);
  const [setup, setSetup] = useState<DemoSetup>(loadAdminDraft);
  const [requests, setRequests] = useState<GuestRequest[]>(getRequests);
  const [feedback, setFeedback] = useState<GuestFeedback[]>(getFeedback);
  const [notice, setNotice] = useState('');
  const [publishedAt, setPublishedAt] = useState<string | null>(getPublishedAt);

  useEffect(() => {
    const syncGuestActivity = (event: StorageEvent) => {
      if (event.key === null || event.key === DEMO_REQUESTS_STORAGE_KEY) setRequests(getRequests());
      if (event.key === null || event.key === DEMO_FEEDBACK_STORAGE_KEY) setFeedback(getFeedback());
    };
    window.addEventListener('storage', syncGuestActivity);
    return () => window.removeEventListener('storage', syncGuestActivity);
  }, []);

  const saveDraft = () => {
    saveAdminDraft(setup);
    setNotice('Draft saved in this browser. It is not visible to guests until published.');
    window.setTimeout(() => setNotice(''), 4000);
  };

  const publish = () => {
    publishAdminSetup(setup);
    const now = new Date().toISOString();
    setPublishedAt(now);
    setNotice('Published to the customer preview. Open the preview link to see the changes.');
    window.setTimeout(() => setNotice(''), 5000);
  };

  const updateServices = (nextSetup: DemoSetup) => {
    setSetup(nextSetup);
    saveAdminDraft(nextSetup);
    const published = publishServiceSettings(nextSetup.services);
    setPublishedAt(published);
    setNotice('Guest section visibility updated in the customer preview.');
    window.setTimeout(() => setNotice(''), 4000);
  };

  const updateRequest = (id: string, status: GuestRequest['status']) => setRequests(updateRequestStatus(id, status));
  const updateFeedback = (id: string, status: GuestFeedback['status']) => setFeedback(updateFeedbackStatus(id, status));

  const content = () => {
    switch (section) {
      case 'menu': return <MenuManagerPage setup={setup} onChange={setSetup} />;
      case 'tables': return <TablesPage setup={setup} onChange={setSetup} />;
      case 'services': return <GuestServicesPage setup={setup} onChange={updateServices} onNavigate={setSection} />;
      case 'inbox': return <GuestInboxPage requests={requests} feedback={feedback} onRequestStatus={updateRequest} onFeedbackStatus={updateFeedback} />;
      case 'settings': return <RestaurantSettingsPage setup={setup} onChange={setSetup} />;
      default: return <OverviewPage setup={setup} requests={requests} feedback={feedback} onNavigate={setSection} />;
    }
  };

  return <AdminLayout section={section} onSectionChange={(next) => { setSection(next); setNotice(''); window.history.replaceState(null, '', `/admin?section=${next}`); }} onSaveDraft={saveDraft} onPublish={publish} notice={notice} publishedAt={publishedAt} restaurantName={setup.restaurant.name}>{content()}</AdminLayout>;
};
