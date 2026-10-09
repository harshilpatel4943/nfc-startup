import React from 'react';
import { ArrowRight, Bell, BookOpen, CheckCircle2, Clock3, MessageSquareText, Utensils, Wifi } from 'lucide-react';
import type { DemoSetup, GuestFeedback, GuestRequest } from '../../../data/demoStore';
import type { AdminSection } from '../components/AdminLayout';

interface OverviewPageProps {
  setup: DemoSetup;
  requests: GuestRequest[];
  feedback: GuestFeedback[];
  onNavigate: (section: AdminSection) => void;
}

const MiniStat: React.FC<{ label: string; value: string | number; detail: string; icon: React.ElementType; tone: string }> = ({ label, value, detail, icon: Icon, tone }) => (
  <article className="rounded-2xl border border-[#E8E2D9] bg-white p-4 shadow-[0_1px_2px_rgba(30,25,20,0.03)] sm:p-5">
    <div className="flex items-start justify-between"><span className="text-sm font-medium text-[#70665B]">{label}</span><span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone}`}><Icon size={17} /></span></div>
    <div className="mt-4 text-3xl font-bold tracking-tight">{value}</div><p className="mt-1 text-xs text-[#837A70]">{detail}</p>
  </article>
);

export const OverviewPage: React.FC<OverviewPageProps> = ({ setup, requests, feedback, onNavigate }) => {
  const openRequests = requests.filter((request) => request.status !== 'Done').length;
  const newFeedback = feedback.filter((entry) => entry.status === 'New').length;

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-2xl bg-[#211A15] p-5 text-white sm:flex-row sm:items-center sm:p-7">
        <div><div className="text-xs font-bold uppercase tracking-[0.16em] text-[#D9B77F]">Welcome back</div><h2 className="mt-2 text-2xl font-bold">{setup.restaurant.name} is ready for service</h2><p className="mt-1 max-w-xl text-sm text-[#D4C7B9]">Manage your menu, table links, and guest experience from one place.</p></div>
        <a href="/?preview=1" target="_blank" rel="noreferrer" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#C6A477] px-4 text-sm font-bold text-[#211A15] hover:bg-[#D8BA8F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><BookOpen size={16} />Open guest preview</a>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Restaurant overview">
        <MiniStat label="Menu items" value={setup.menuItems.length} detail={`${setup.menuItems.filter((item) => item.isAvailable).length} currently available`} icon={Utensils} tone="bg-orange-50 text-orange-700" />
        <MiniStat label="Active table links" value={setup.tables.filter((table) => table.isActive).length} detail="Ready for NFC or QR tags" icon={Wifi} tone="bg-blue-50 text-blue-700" />
        <MiniStat label="Open service requests" value={openRequests} detail="Sample and browser demo activity" icon={Bell} tone="bg-amber-50 text-amber-700" />
        <MiniStat label="Feedback to review" value={newFeedback} detail={`${feedback.length} feedback entries in this demo`} icon={MessageSquareText} tone="bg-violet-50 text-violet-700" />
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-[#E8E2D9] bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3"><div><h3 className="text-base font-bold">Guest experience services</h3><p className="mt-1 text-sm text-[#756C62]">What diners can access from your NFC page.</p></div><button type="button" onClick={() => onNavigate('services')} className="inline-flex min-h-9 items-center gap-1 rounded-lg px-2 text-xs font-bold text-[#8C5138] hover:bg-[#FBF6F1]">Manage <ArrowRight size={14} /></button></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {setup.services.map((service) => <div key={service.id} className="flex gap-3 rounded-xl bg-[#FAF8F5] p-3.5"><span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${service.isEnabled ? 'bg-emerald-500' : 'bg-[#B4AAA0]'}`} /><div><div className="text-sm font-semibold">{service.name}</div><p className="mt-1 text-xs leading-relaxed text-[#756C62]">{service.description}</p></div></div>)}
          </div>
        </section>

        <section className="rounded-2xl border border-[#E8E2D9] bg-white p-5 sm:p-6">
          <div><h3 className="text-base font-bold">Recent guest activity</h3><p className="mt-1 text-sm text-[#756C62]">Sample entries make the customer walkthrough easy.</p></div>
          <div className="mt-5 space-y-3">
            {requests.slice(0, 3).map((request) => <div key={request.id} className="flex items-center gap-3 rounded-xl border border-[#EEE9E2] p-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5EEE7] text-[#8C5138]"><Bell size={16} /></span><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{request.type} <span className="font-normal text-[#756C62]">· Table {request.tableNumber}</span></div><div className="mt-0.5 text-xs text-[#837A70]">{request.createdAt}</div></div><span className="rounded-full bg-[#F6F0E7] px-2.5 py-1 text-[10px] font-bold text-[#725C42]">{request.status}</span></div>)}
            {!requests.length && <p className="rounded-xl bg-[#FAF8F5] p-4 text-sm text-[#756C62]">Guest requests will appear here.</p>}
          </div>
          <button type="button" onClick={() => onNavigate('inbox')} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-bold text-[#8C5138] hover:underline">Open guest inbox <ArrowRight size={15} /></button>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#F7F5F1] px-3.5 py-3 text-xs text-[#756C62]"><Clock3 size={15} />Activity data is stored in this browser for the demo.</div>
        </section>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <button type="button" onClick={() => onNavigate('menu')} className="flex min-h-24 items-center justify-between rounded-2xl border border-[#E8E2D9] bg-white p-5 text-left hover:border-[#C6A477] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C5138]"><span className="flex items-center gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-700"><Utensils size={20} /></span><span><span className="block font-bold">Update the menu</span><span className="mt-1 block text-sm text-[#756C62]">Edit prices, descriptions, and availability</span></span></span><ArrowRight size={18} className="text-[#8C5138]" /></button>
        <button type="button" onClick={() => onNavigate('tables')} className="flex min-h-24 items-center justify-between rounded-2xl border border-[#E8E2D9] bg-white p-5 text-left hover:border-[#C6A477] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C5138]"><span className="flex items-center gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><CheckCircle2 size={20} /></span><span><span className="block font-bold">Set up table links</span><span className="mt-1 block text-sm text-[#756C62]">Create one guest link for each table</span></span></span><ArrowRight size={18} className="text-[#8C5138]" /></button>
      </div>
    </div>
  );
};
