import React from 'react';
import { ArrowRight, Bell, BookOpen, Flame, Gamepad2, Heart, Link2, MapPin, MessageSquareText, Star, Utensils, Wifi } from 'lucide-react';
import type { DemoSetup, GuestService } from '../../../data/demoStore';
import type { AdminSection } from '../components/AdminLayout';

const serviceMeta: Record<string, { icon: React.ElementType; group: string }> = {
  menu: { icon: BookOpen, group: 'Menu' },
  staff: { icon: Bell, group: 'Table service' },
  feedback: { icon: MessageSquareText, group: 'Guest engagement' },
  loyalty: { icon: Heart, group: 'Guest engagement' },
  wifi: { icon: Wifi, group: 'Guest utility' },
  reviews: { icon: Star, group: 'Guest engagement' },
  instagram: { icon: Link2, group: 'Social' },
  game: { icon: Gamepad2, group: 'Guest engagement' },
  popular: { icon: Flame, group: 'Menu' },
  contact: { icon: MapPin, group: 'Restaurant details' },
};

interface GuestServicesPageProps {
  setup: DemoSetup;
  onChange: (setup: DemoSetup) => void;
  onNavigate: (section: AdminSection) => void;
}

export const GuestServicesPage: React.FC<GuestServicesPageProps> = ({ setup, onChange, onNavigate }) => {
  const toggleService = (service: GuestService) => {
    const nextEnabled = !service.isEnabled;
    const services = setup.services.map((item) => {
      if (item.id === service.id) return { ...item, isEnabled: nextEnabled };
      if (service.id === 'menu' && !nextEnabled && item.id === 'popular') return { ...item, isEnabled: false };
      return item;
    });
    onChange({ ...setup, services });
  };
  const menuEnabled = setup.services.find((service) => service.id === 'menu')?.isEnabled ?? true;
  const visibleCount = setup.services.filter((service) => service.isEnabled && !(service.id === 'popular' && !menuEnabled)).length;

  return <div className="space-y-5">
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div><h2 className="text-xl font-bold">Guest services</h2><p className="mt-1 max-w-2xl text-sm text-[#756C62]">Choose which cards and sections guests see. Switches apply immediately to the customer preview.</p></div>
      <button type="button" onClick={() => onNavigate('settings')} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#DED7CE] bg-white px-3 text-sm font-semibold hover:bg-[#F8F6F2]">Edit restaurant details <ArrowRight size={15} /></button>
    </div>
    <div className="flex items-center justify-between rounded-xl border border-[#E8E2D9] bg-white px-4 py-3 text-sm"><span className="font-semibold">Sections visible to guests</span><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">{visibleCount} of {setup.services.length} enabled</span></div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {setup.services.map((service) => {
        const meta = serviceMeta[service.id] ?? { icon: Utensils, group: 'Guest experience' };
        const Icon = meta.icon;
        const requiresMenu = service.id === 'popular' && !menuEnabled;
        const isVisible = service.isEnabled && !requiresMenu;
        return <article key={service.id} className={'rounded-2xl border bg-white p-5 transition-colors ' + (service.isEnabled ? 'border-[#E8E2D9]' : 'border-[#E8E2D9] opacity-75')}>
          <div className="flex items-start justify-between gap-4"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F6F0E8] text-[#8C5138]"><Icon size={18} /></span><span className="rounded-full bg-[#F7F4EF] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#725C42]">{meta.group}</span></div>
          <h3 className="mt-4 font-bold">{service.name}</h3><p className="mt-1.5 min-h-10 text-sm leading-relaxed text-[#756C62]">{service.description}</p>
          <div className="mt-4 flex items-center justify-between border-t border-[#F0ECE6] pt-3"><span className={'text-xs font-semibold ' + (isVisible ? 'text-emerald-700' : 'text-[#756C62]')}>{requiresMenu ? 'Requires digital menu' : isVisible ? 'Visible to guests' : 'Hidden from guests'}</span>
            <button type="button" role="switch" aria-checked={isVisible} aria-label={(isVisible ? 'Hide ' : 'Show ') + service.name} disabled={requiresMenu} onClick={() => toggleService(service)} className={'relative inline-flex h-7 w-12 items-center rounded-full p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C5138] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ' + (isVisible ? 'bg-[#8C5138]' : 'bg-[#C8C0B7]')}><span className={'h-5 w-5 rounded-full bg-white shadow transition-transform ' + (isVisible ? 'translate-x-5' : 'translate-x-0')} /></button>
          </div>
        </article>;
      })}
    </div>
    <section className="rounded-2xl border border-[#EADCC9] bg-[#FBF6EF] p-5"><h3 className="font-bold text-[#44372A]">How this works</h3><p className="mt-2 max-w-4xl text-sm leading-relaxed text-[#725C42]">Turn off loyalty rewards or another card to hide it immediately from the customer preview; turn it back on to restore it. Online ordering, payments, POS synchronization, and real staff notifications are not connected in this sample.</p></section>
  </div>;
};
