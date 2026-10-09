import React from 'react';
import { ArrowUpRight, Bell, BookOpen, ChevronDown, CircleHelp, ClipboardList, LayoutDashboard, Settings2, Store, Utensils, Wifi } from 'lucide-react';

export type AdminSection = 'overview' | 'menu' | 'tables' | 'services' | 'inbox' | 'settings';

const navigation: { id: AdminSection; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'menu', label: 'Menu management', icon: Utensils },
  { id: 'tables', label: 'Tables & NFC', icon: Wifi },
  { id: 'services', label: 'Guest services', icon: ClipboardList },
  { id: 'inbox', label: 'Guest inbox', icon: Bell },
  { id: 'settings', label: 'Restaurant setup', icon: Settings2 },
];

interface AdminLayoutProps {
  section: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  notice: string;
  publishedAt: string | null;
  restaurantName: string;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ section, onSectionChange, onSaveDraft, onPublish, notice, publishedAt, restaurantName, children }) => {
  const title = navigation.find((item) => item.id === section)?.label ?? 'Overview';

  return (
    <div className="min-h-screen bg-[#F6F5F2] text-[#211D19] lg:flex">
      <aside className="hidden w-[248px] shrink-0 flex-col bg-[#171411] px-4 py-5 text-[#F5EBDD] lg:flex">
        <a href="/" className="mb-8 flex items-center gap-3 rounded-xl px-2 py-1.5" aria-label="Open customer preview">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#C6A477] to-[#8C5138] text-[#171411]"><Store size={20} /></span>
          <span className="min-w-0"><span className="block truncate font-display text-sm font-bold tracking-wide">{restaurantName}</span><span className="block text-[11px] text-[#C6A477]">Restaurant workspace</span></span>
        </a>

        <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9F9588]">Workspace</div>
        <nav aria-label="Admin navigation" className="space-y-1">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" onClick={() => onSectionChange(id)} aria-current={section === id ? 'page' : undefined}
              className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B77F] ${section === id ? 'bg-[#3A2B21] text-[#FFE9C3]' : 'text-[#D2C8BB] hover:bg-white/5 hover:text-white'}`}>
              <Icon size={17} aria-hidden="true" /><span>{label}</span>
              {id === 'inbox' && <span className="ml-auto rounded-full bg-[#8C5138] px-2 py-0.5 text-[10px] font-bold text-white">New</span>}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold"><span className="h-2 w-2 rounded-full bg-emerald-400" />Demo workspace</div>
            <p className="text-[11px] leading-relaxed text-[#BDB3A7]">Changes are saved in this browser for the customer preview.</p>
          </div>
          <a href="/" className="flex min-h-11 items-center justify-between rounded-xl px-3 text-sm text-[#D2C8BB] hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B77F]">
            <span className="flex items-center gap-3"><ArrowUpRight size={17} />View customer page</span><BookOpen size={15} className="text-[#9F9588]" />
          </a>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-[#E8E2D9] bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8C5138]"><Store size={14} /> {restaurantName} <ChevronDown size={13} /></div>
              <h1 className="mt-1 truncate text-xl font-bold tracking-tight sm:text-2xl">{title}</h1>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <span className="hidden items-center gap-1.5 rounded-full bg-[#F5F0E8] px-3 py-1.5 text-xs font-semibold text-[#725C42] md:inline-flex"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />Demo mode</span>
              <a href="/?preview=1" target="_blank" rel="noreferrer" className="hidden min-h-10 items-center gap-2 rounded-xl border border-[#DCD3C8] px-3 text-sm font-semibold text-[#42382E] hover:bg-[#F8F6F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C5138] sm:inline-flex"><ArrowUpRight size={15} />Customer preview</a>
              <button type="button" onClick={onSaveDraft} className="min-h-10 rounded-xl border border-[#DCD3C8] px-3 text-xs font-semibold text-[#42382E] hover:bg-[#F8F6F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C5138] sm:text-sm">Save draft</button>
              <button type="button" onClick={onPublish} className="min-h-10 rounded-xl bg-[#8C5138] px-3 text-xs font-bold text-white shadow-sm hover:bg-[#70402D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C5138] focus-visible:ring-offset-2 sm:px-4 sm:text-sm">Publish</button>
            </div>
          </div>
          <nav aria-label="Admin navigation" className="flex gap-1 overflow-x-auto px-3 pb-2 lg:hidden">
            {navigation.map(({ id, label }) => <button key={id} type="button" onClick={() => onSectionChange(id)} aria-current={section === id ? 'page' : undefined} className={`min-h-9 shrink-0 rounded-lg px-3 text-xs font-semibold ${section === id ? 'bg-[#3A2B21] text-white' : 'bg-[#F3F0EA] text-[#62584C]'}`}>{label}</button>)}
          </nav>
        </header>

        <main className="mx-auto max-w-[1440px] p-4 pb-16 sm:p-6 lg:p-8">
          {notice && <div role="status" aria-live="polite" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{notice}</div>}
          {publishedAt && <p className="mb-4 text-xs text-[#756C62]">Last published {new Date(publishedAt).toLocaleString()}</p>}
          {children}
        </main>
        <footer className="mx-auto flex max-w-[1440px] items-center gap-2 px-4 pb-8 text-xs text-[#82796F] sm:px-6 lg:px-8"><CircleHelp size={14} />Demo dashboard · Data stays in this browser</footer>
      </div>
    </div>
  );
};
