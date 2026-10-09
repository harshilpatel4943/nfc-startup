import React, { useMemo, useState } from 'react';
import { Check, ChevronDown, CirclePlus, Pencil, Search, X } from 'lucide-react';
import { menuCategories, type MenuItem } from '../../../data/menuData';
import type { DemoSetup, ManagedMenuItem } from '../../../data/demoStore';

interface MenuManagerPageProps { setup: DemoSetup; onChange: (setup: DemoSetup) => void }
type MenuFormValue = Pick<ManagedMenuItem, 'id' | 'name' | 'description' | 'price' | 'category' | 'isAvailable' | 'isVegetarian' | 'isMaharajaSpecial'>;
const blankItem = (): MenuFormValue => ({ id: `dish-${Date.now()}`, name: '', description: '', price: 0, category: 'STARTER', isAvailable: true, isVegetarian: true, isMaharajaSpecial: false });

export const MenuManagerPage: React.FC<MenuManagerPageProps> = ({ setup, onChange }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('ALL');
  const [editing, setEditing] = useState<MenuFormValue | null>(null);
  const [formError, setFormError] = useState('');
  const filtered = useMemo(() => setup.menuItems.filter((item) => {
    const matchesCategory = category === 'ALL' || item.category === category;
    const matchesQuery = `${item.name} ${item.description}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesCategory && matchesQuery;
  }), [setup.menuItems, category, query]);

  const saveItem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing?.name.trim()) { setFormError('Enter a dish name.'); return; }
    if (editing.price < 0) { setFormError('Price must be zero or more.'); return; }
    const item: ManagedMenuItem = { ...editing, name: editing.name.trim(), description: editing.description.trim() } as ManagedMenuItem;
    const exists = setup.menuItems.some((entry) => entry.id === item.id);
    onChange({ ...setup, menuItems: exists ? setup.menuItems.map((entry) => entry.id === item.id ? item : entry) : [item, ...setup.menuItems] });
    setEditing(null);
    setFormError('');
  };

  const toggleAvailability = (item: ManagedMenuItem) => onChange({ ...setup, menuItems: setup.menuItems.map((entry) => entry.id === item.id ? { ...entry, isAvailable: !entry.isAvailable } : entry) });
  const startEdit = (item: ManagedMenuItem) => setEditing({ id: item.id, name: item.name, description: item.description, price: item.price, category: item.category, isAvailable: item.isAvailable, isVegetarian: item.isVegetarian ?? false, isMaharajaSpecial: item.isMaharajaSpecial ?? false });

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h2 className="text-xl font-bold">Menu management</h2><p className="mt-1 text-sm text-[#756C62]">Edit dishes here, then publish to update the customer menu.</p></div><button type="button" onClick={() => { setEditing(blankItem()); setFormError(''); }} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#8C5138] px-4 text-sm font-bold text-white hover:bg-[#70402D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C5138] focus-visible:ring-offset-2"><CirclePlus size={17} />Add dish</button></div>

      {editing && <form onSubmit={saveItem} className="rounded-2xl border border-[#DCCFC0] bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between"><h3 className="font-bold">{setup.menuItems.some((item) => item.id === editing.id) ? 'Edit dish' : 'Add a dish'}</h3><button type="button" onClick={() => setEditing(null)} aria-label="Close dish form" className="rounded-lg p-2 text-[#756C62] hover:bg-[#F4F1EB]"><X size={18} /></button></div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold">Dish name<input required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="mt-1.5 min-h-11 w-full rounded-xl border border-[#DCD3C8] px-3 font-normal outline-none focus:border-[#8C5138] focus:ring-2 focus:ring-[#8C5138]/15" /></label>
          <label className="text-sm font-semibold">Price (₹)<input required type="number" min="0" step="1" value={editing.price || ''} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} className="mt-1.5 min-h-11 w-full rounded-xl border border-[#DCD3C8] px-3 font-normal outline-none focus:border-[#8C5138] focus:ring-2 focus:ring-[#8C5138]/15" /></label>
          <label className="text-sm font-semibold">Category<select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as MenuItem['category'] })} className="mt-1.5 min-h-11 w-full rounded-xl border border-[#DCD3C8] bg-white px-3 font-normal outline-none focus:border-[#8C5138] focus:ring-2 focus:ring-[#8C5138]/15">{menuCategories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <label className="text-sm font-semibold md:col-span-2">Description<textarea rows={2} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="mt-1.5 w-full rounded-xl border border-[#DCD3C8] px-3 py-2 font-normal outline-none focus:border-[#8C5138] focus:ring-2 focus:ring-[#8C5138]/15" /></label>
          <div className="flex flex-wrap gap-x-6 gap-y-3 md:col-span-2"><label className="inline-flex min-h-10 items-center gap-2 text-sm"><input type="checkbox" checked={editing.isVegetarian} onChange={(e) => setEditing({ ...editing, isVegetarian: e.target.checked })} className="h-4 w-4 accent-[#8C5138]" />Vegetarian</label><label className="inline-flex min-h-10 items-center gap-2 text-sm"><input type="checkbox" checked={editing.isMaharajaSpecial} onChange={(e) => setEditing({ ...editing, isMaharajaSpecial: e.target.checked })} className="h-4 w-4 accent-[#8C5138]" />Maharaja special</label><label className="inline-flex min-h-10 items-center gap-2 text-sm"><input type="checkbox" checked={editing.isAvailable} onChange={(e) => setEditing({ ...editing, isAvailable: e.target.checked })} className="h-4 w-4 accent-[#8C5138]" />Available to guests</label></div>
        </div>
        {formError && <p role="alert" className="mt-3 text-sm text-red-700">{formError}</p>}
        <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setEditing(null)} className="min-h-10 rounded-xl px-4 text-sm font-semibold text-[#645A50] hover:bg-[#F5F2ED]">Cancel</button><button type="submit" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#211A15] px-4 text-sm font-bold text-white hover:bg-black"><Check size={16} />Save dish</button></div>
      </form>}

      <section className="overflow-hidden rounded-2xl border border-[#E8E2D9] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#EEE9E2] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#82796F]" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search dishes" aria-label="Search menu dishes" className="min-h-10 w-full rounded-xl border border-[#E3DDD4] pl-9 pr-3 text-sm outline-none focus:border-[#8C5138] focus:ring-2 focus:ring-[#8C5138]/15" /></div>
          <label className="relative flex items-center"><span className="sr-only">Filter menu category</span><select value={category} onChange={(e) => setCategory(e.target.value)} className="min-h-10 appearance-none rounded-xl border border-[#E3DDD4] bg-white pl-3 pr-9 text-sm font-medium outline-none focus:border-[#8C5138]"><option value="ALL">All categories</option>{menuCategories.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select><ChevronDown size={14} className="pointer-events-none absolute right-3 text-[#756C62]" /></label>
        </div>
        <div className="overflow-x-auto"><table className="w-full min-w-[690px] text-left"><thead className="bg-[#FAF8F5] text-[11px] uppercase tracking-wider text-[#756C62]"><tr><th className="px-4 py-3 font-bold">Dish</th><th className="px-4 py-3 font-bold">Category</th><th className="px-4 py-3 font-bold">Price</th><th className="px-4 py-3 font-bold">Availability</th><th className="px-4 py-3 text-right font-bold">Action</th></tr></thead><tbody className="divide-y divide-[#F0ECE6]">{filtered.map((item) => <tr key={item.id} className="hover:bg-[#FDFCFB]"><td className="max-w-[340px] px-4 py-3.5"><div className="font-semibold">{item.name}</div><div className="mt-0.5 truncate text-xs text-[#837A70]">{item.description || 'No description added'}</div></td><td className="px-4 py-3.5 text-sm text-[#645A50]">{item.category}</td><td className="px-4 py-3.5 text-sm font-semibold">₹{item.price}</td><td className="px-4 py-3.5"><button type="button" onClick={() => toggleAvailability(item)} aria-pressed={item.isAvailable} className={`min-h-9 rounded-full px-3 text-xs font-bold ${item.isAvailable ? 'bg-emerald-50 text-emerald-800' : 'bg-[#F2EFEB] text-[#756C62]'}`}>{item.isAvailable ? 'Available' : 'Paused'}</button></td><td className="px-4 py-3.5 text-right"><button type="button" onClick={() => startEdit(item)} aria-label={`Edit ${item.name}`} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-bold text-[#8C5138] hover:bg-[#F8F1EA]"><Pencil size={14} />Edit</button></td></tr>)}{!filtered.length && <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-[#756C62]">No dishes match this search.</td></tr>}</tbody></table></div>
        <div className="border-t border-[#EEE9E2] px-4 py-3 text-xs text-[#756C62]">Showing {filtered.length} of {setup.menuItems.length} dishes · Changes stay in draft until published.</div>
      </section>
    </div>
  );
};
