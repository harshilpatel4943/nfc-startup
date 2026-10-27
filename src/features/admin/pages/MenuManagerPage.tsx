import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Check, ChevronDown, CirclePlus, Pencil, Search, Trash2, X } from 'lucide-react';
import type { MenuCategory, MenuItem } from '../../../data/menuData';
import type { DemoSetup, ManagedMenuItem } from '../../../data/demoStore';
import { createClientId, uploadRestaurantImage } from '../../../lib/restaurantCloud';

interface MenuManagerPageProps { setup: DemoSetup; onChange: (setup: DemoSetup) => void }
type MenuFormValue = Omit<ManagedMenuItem, 'imageUrl'> & {
  imageUrl: string;
  imageFile?: File;
  imagePreviewUrl?: string;
  tagsText: string;
};
type CategoryFormValue = MenuCategory & { imageFile?: File; imagePreviewUrl?: string };

const blankItem = (category: string): MenuFormValue => ({
  id: `dish-${createClientId()}`, name: '', description: '', price: 0,
  category, isAvailable: true, isVegetarian: false, isMaharajaSpecial: false,
  isPopular: false, isTodaysSpecial: false, imageUrl: '', tags: [], tagsText: '',
});

const fieldClass = 'mt-1.5 min-h-11 w-full rounded-xl border border-[#DCD3C8] bg-white px-3 font-normal text-[#211D19] outline-none focus:border-[#8C5138] focus:ring-2 focus:ring-[#8C5138]/15';
const buttonClass = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#DCD3C8] px-3 text-sm font-semibold text-[#51483F] hover:bg-[#F8F6F2] disabled:cursor-not-allowed disabled:opacity-45';

function revokePreview(url?: string) {
  if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
}

const slugForCategory = (name: string) => name.trim().toLocaleLowerCase()
  .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'category';

export const MenuManagerPage: React.FC<MenuManagerPageProps> = ({ setup, onChange }) => {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [editing, setEditing] = useState<MenuFormValue | null>(null);
  const [categoryEditing, setCategoryEditing] = useState<CategoryFormValue | null>(null);
  const [formError, setFormError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  const filtered = useMemo(() => setup.menuItems.filter((item) => {
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesQuery = `${item.name} ${item.description} ${item.tags?.join(' ') ?? ''}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesCategory && matchesQuery;
  }), [setup.menuItems, categoryFilter, query]);

  const closeDishForm = () => {
    revokePreview(editing?.imagePreviewUrl);
    setEditing(null);
    setFormError('');
  };
  const saveItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing?.name.trim()) { setFormError('Enter a dish name.'); return; }
    if (!setup.menuCategories.some((item) => item.id === editing.category)) { setFormError('Choose an existing category.'); return; }
    if (editing.price < 0) { setFormError('Price must be zero or more.'); return; }
    setIsSaving(true);
    setFormError('');
    try {
      const imageUrl = editing.imageFile ? await uploadRestaurantImage(editing.imageFile) : editing.imageUrl;
      const item: ManagedMenuItem = {
        ...editing,
        imageUrl,
        tags: editing.tagsText.split(',').map((tag) => tag.trim()).filter(Boolean),
        isMaharajaSpecial: false,
        isTodaysSpecial: !!editing.isTodaysSpecial,
        name: editing.name.trim(),
        description: editing.description.trim(),
        portionLabel: editing.portionLabel?.trim() || undefined,
        tasteNote: editing.tasteNote?.trim() || undefined,
      };
      const exists = setup.menuItems.some((entry) => entry.id === item.id);
      onChange({ ...setup, menuItems: exists ? setup.menuItems.map((entry) => entry.id === item.id ? item : entry) : [item, ...setup.menuItems] });
      closeDishForm();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Could not save this dish.');
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (item: ManagedMenuItem) => setEditing({
    ...item, isMaharajaSpecial: false, imageUrl: item.imageUrl ?? '',
    isPopular: item.isPopular ?? false, isTodaysSpecial: item.isTodaysSpecial ?? item.isMaharajaSpecial ?? false,
    portionLabel: item.portionLabel ?? '', tasteNote: item.tasteNote ?? '',
    tagsText: item.tags?.join(', ') ?? '',
  });
  const toggleAvailability = (item: ManagedMenuItem) => onChange({ ...setup, menuItems: setup.menuItems.map((entry) => entry.id === item.id ? { ...entry, isAvailable: !entry.isAvailable } : entry) });
  const toggleTodaysSpecial = (item: ManagedMenuItem) => onChange({ ...setup, menuItems: setup.menuItems.map((entry) => entry.id === item.id ? { ...entry, isTodaysSpecial: !(entry.isTodaysSpecial ?? entry.isMaharajaSpecial), isMaharajaSpecial: false } : entry) });
  const deleteItem = (item: ManagedMenuItem) => { if (window.confirm(`Delete ${item.name}?`)) onChange({ ...setup, menuItems: setup.menuItems.filter((entry) => entry.id !== item.id) }); };

  const openNewCategory = () => {
    setCategoryError('');
    setCategoryEditing({ id: '', name: '', subtitle: '', imageUrl: '' });
  };
  const saveCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!categoryEditing?.name.trim()) { setCategoryError('Enter a category name.'); return; }
    const existing = setup.menuCategories.find((item) => item.id === categoryEditing.id);
    let id = categoryEditing.id || slugForCategory(categoryEditing.name);
    if (!existing) {
      let suffix = 2;
      const baseId = id;
      while (setup.menuCategories.some((item) => item.id === id)) id = `${baseId}-${suffix++}`;
    }
    setIsSavingCategory(true);
    setCategoryError('');
    try {
      const imageUrl = categoryEditing.imageFile ? await uploadRestaurantImage(categoryEditing.imageFile) : categoryEditing.imageUrl;
      const nextCategory: MenuCategory = { id, name: categoryEditing.name.trim(), subtitle: categoryEditing.subtitle.trim(), imageUrl };
      onChange({ ...setup, menuCategories: existing
        ? setup.menuCategories.map((item) => item.id === existing.id ? nextCategory : item)
        : [...setup.menuCategories, nextCategory] });
      revokePreview(categoryEditing.imagePreviewUrl);
      setCategoryEditing(null);
    } catch (error) {
      setCategoryError(error instanceof Error ? error.message : 'Could not save this category.');
    } finally {
      setIsSavingCategory(false);
    }
  };
  const removeCategory = (category: MenuCategory) => {
    const usedBy = setup.menuItems.filter((item) => item.category === category.id).length;
    if (usedBy) { setCategoryError(`Move the ${usedBy} dish${usedBy === 1 ? '' : 'es'} out of ${category.name} before removing it.`); return; }
    if (setup.menuCategories.length < 2) { setCategoryError('Keep at least one menu category.'); return; }
    if (window.confirm(`Remove the “${category.name}” category?`)) {
      onChange({ ...setup, menuCategories: setup.menuCategories.filter((item) => item.id !== category.id) });
      if (categoryFilter === category.id) setCategoryFilter('ALL');
    }
  };
  const moveCategory = (index: number, offset: -1 | 1) => {
    const next = [...setup.menuCategories];
    const target = index + offset;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange({ ...setup, menuCategories: next });
  };

  return <div className="space-y-5">
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div><h2 className="text-xl font-bold">Menu management</h2><p className="mt-1 text-sm text-[#756C62]">Edit restaurant menu content, photos, and categories, then publish.</p></div>
      <button type="button" disabled={!setup.menuCategories.length} onClick={() => { setEditing(blankItem(setup.menuCategories[0]?.id ?? '')); setFormError(''); }} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#8C5138] px-4 text-sm font-bold text-white hover:bg-[#70402D] disabled:opacity-50"><CirclePlus size={17} />Add dish</button>
    </div>

    <details className="group rounded-2xl border border-[#E8E2D9] bg-white">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-5 font-semibold [&::-webkit-details-marker]:hidden">
        <span>Categories <span className="ml-1 text-xs font-normal text-[#837A70]">{setup.menuCategories.length}</span></span>
        <ChevronDown size={16} className="transition group-open:rotate-180" />
      </summary>
      <div className="border-t border-[#EEE9E2] p-4">
        <div className="mb-3 flex justify-end"><button type="button" onClick={openNewCategory} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-bold text-[#8C5138] hover:bg-[#F8F1EA]"><CirclePlus size={15} />Add category</button></div>
        <div className="space-y-2">
          {setup.menuCategories.map((item, index) => <div key={item.id} className="flex flex-wrap items-center gap-2 rounded-xl bg-[#FAF8F5] p-3 sm:gap-3">
            {item.imageUrl ? <img src={item.imageUrl} alt="" className="h-11 w-11 rounded-lg object-cover" /> : <div aria-hidden="true" className="h-11 w-11 rounded-lg bg-[#EDE6DC]" />}
            <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{item.name}</div><div className="truncate text-xs text-[#837A70]">{item.subtitle || 'No subtitle'}</div></div>
            <button type="button" aria-label={`Move ${item.name} up`} disabled={index === 0} onClick={() => moveCategory(index, -1)} className={buttonClass}><ArrowUp size={15} /></button>
            <button type="button" aria-label={`Move ${item.name} down`} disabled={index === setup.menuCategories.length - 1} onClick={() => moveCategory(index, 1)} className={buttonClass}><ArrowDown size={15} /></button>
            <button type="button" onClick={() => { setCategoryEditing({ ...item }); setCategoryError(''); }} aria-label={`Edit ${item.name}`} className={buttonClass}><Pencil size={15} />Edit</button>
            <button type="button" onClick={() => removeCategory(item)} aria-label={`Remove ${item.name}`} className="inline-flex min-h-10 items-center justify-center rounded-xl px-3 text-red-700 hover:bg-red-50"><Trash2 size={16} /></button>
          </div>)}
        </div>
        {categoryEditing && <form onSubmit={(event) => void saveCategory(event)} className="mt-4 grid gap-3 rounded-xl border border-[#E8E2D9] p-4 sm:grid-cols-2">
          <h3 className="font-semibold sm:col-span-2">{categoryEditing.id ? 'Edit category' : 'Add category'}</h3>
          <label className="text-sm font-semibold">Category name<input required value={categoryEditing.name} onChange={(event) => setCategoryEditing({ ...categoryEditing, name: event.target.value })} className={fieldClass} /></label>
          <label className="text-sm font-semibold">Subtitle<input value={categoryEditing.subtitle} onChange={(event) => setCategoryEditing({ ...categoryEditing, subtitle: event.target.value })} className={fieldClass} /></label>
          <label className="text-sm font-semibold sm:col-span-2">Category photo
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; revokePreview(categoryEditing.imagePreviewUrl); setCategoryEditing({ ...categoryEditing, imageFile: file, imagePreviewUrl: URL.createObjectURL(file) }); }} className="mt-2 block w-full text-sm font-normal" />
            <input value={categoryEditing.imageUrl} onChange={(event) => setCategoryEditing({ ...categoryEditing, imageUrl: event.target.value, imageFile: undefined, imagePreviewUrl: undefined })} placeholder="Or paste a public image URL" className={fieldClass} />
            {(categoryEditing.imagePreviewUrl || categoryEditing.imageUrl) && <img src={categoryEditing.imagePreviewUrl || categoryEditing.imageUrl} alt="" className="mt-2 h-16 w-24 rounded-lg object-cover" />}
          </label>
          {categoryError && <p role="alert" className="text-sm text-red-700 sm:col-span-2">{categoryError}</p>}
          <div className="flex justify-end gap-2 sm:col-span-2"><button type="button" onClick={() => { revokePreview(categoryEditing.imagePreviewUrl); setCategoryEditing(null); setCategoryError(''); }} className={buttonClass}>Cancel</button><button type="submit" disabled={isSavingCategory} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#211A15] px-4 text-sm font-bold text-white disabled:opacity-50"><Check size={15} />{isSavingCategory ? 'Saving…' : 'Save category'}</button></div>
        </form>}
      </div>
    </details>

    {editing && <form onSubmit={(event) => void saveItem(event)} className="rounded-2xl border border-[#DCCFC0] bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center justify-between"><h3 className="font-bold">{setup.menuItems.some((item) => item.id === editing.id) ? 'Edit dish' : 'Add a dish'}</h3><button type="button" onClick={closeDishForm} aria-label="Close dish form" className="rounded-lg p-2 text-[#756C62] hover:bg-[#F4F1EB]"><X size={18} /></button></div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold">Dish name<input required value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} className={fieldClass} /></label>
        <label className="text-sm font-semibold">Price (₹)<input required type="number" min="0" step="0.01" value={editing.price || ''} onChange={(event) => setEditing({ ...editing, price: Number(event.target.value) })} className={fieldClass} /></label>
        <label className="text-sm font-semibold">Category<select value={editing.category} onChange={(event) => setEditing({ ...editing, category: event.target.value })} className={fieldClass}>{setup.menuCategories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label className="text-sm font-semibold">Portion / serving size<input value={editing.portionLabel ?? ''} onChange={(event) => setEditing({ ...editing, portionLabel: event.target.value })} placeholder="For example, 250 g or 300 ml" className={fieldClass} /></label>
        <label className="text-sm font-semibold md:col-span-2">Short taste note<input value={editing.tasteNote ?? ''} onChange={(event) => setEditing({ ...editing, tasteNote: event.target.value })} placeholder="A short line shown beside the dish name" className={fieldClass} /></label>
        <label className="text-sm font-semibold md:col-span-2">Description<textarea rows={2} value={editing.description} onChange={(event) => setEditing({ ...editing, description: event.target.value })} className={fieldClass} /></label>
        <label className="text-sm font-semibold">Spice level<select value={editing.spicinessLevel ?? ''} onChange={(event) => setEditing({ ...editing, spicinessLevel: event.target.value ? Number(event.target.value) as MenuItem['spicinessLevel'] : undefined })} className={fieldClass}><option value="">No spice label</option><option value="1">Mild</option><option value="2">Medium</option><option value="3">Hot</option></select></label>
        <label className="text-sm font-semibold">Dish tags<input value={editing.tagsText} onChange={(event) => setEditing({ ...editing, tagsText: event.target.value })} placeholder="Separate tags with commas" className={fieldClass} /></label>
        <label className="text-sm font-semibold md:col-span-2">Dish photo
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; revokePreview(editing.imagePreviewUrl); setEditing({ ...editing, imageFile: file, imagePreviewUrl: URL.createObjectURL(file) }); }} className="mt-2 block w-full font-normal" />
          <input value={editing.imageUrl.startsWith('data:') ? '' : editing.imageUrl} onChange={(event) => { revokePreview(editing.imagePreviewUrl); setEditing({ ...editing, imageUrl: event.target.value, imageFile: undefined, imagePreviewUrl: undefined }); }} placeholder="Or paste a public image URL" className={fieldClass} />
          {(editing.imagePreviewUrl || editing.imageUrl) && <span className="mt-2 flex items-center gap-3"><img src={editing.imagePreviewUrl || editing.imageUrl} alt="" className="h-16 w-20 rounded-lg object-cover" /><button type="button" onClick={() => { revokePreview(editing.imagePreviewUrl); setEditing({ ...editing, imageUrl: '', imageFile: undefined, imagePreviewUrl: undefined }); }} className="text-sm text-red-700">Remove image</button></span>}
          <span className="mt-1 block text-xs font-normal text-[#837A70]">Photo uploads to this restaurant’s image library when you save the dish (max 5 MB).</span>
        </label>
        <div className="flex flex-wrap gap-x-6 gap-y-3 md:col-span-2">
          <label className="inline-flex min-h-10 items-center gap-2 text-sm"><input type="checkbox" checked={!!editing.isVegetarian} onChange={(event) => setEditing({ ...editing, isVegetarian: event.target.checked })} className="h-4 w-4 accent-[#8C5138]" />Vegetarian</label>
          <label className="inline-flex min-h-10 items-center gap-2 text-sm"><input type="checkbox" checked={editing.isAvailable} onChange={(event) => setEditing({ ...editing, isAvailable: event.target.checked })} className="h-4 w-4 accent-[#8C5138]" />Available to guests</label>
          <label className="inline-flex min-h-10 items-center gap-2 text-sm"><input type="checkbox" checked={!!editing.isPopular} onChange={(event) => setEditing({ ...editing, isPopular: event.target.checked })} className="h-4 w-4 accent-[#8C5138]" />Feature on customer page</label>
          <label className="inline-flex min-h-10 items-center gap-2 text-sm"><input type="checkbox" checked={!!editing.isTodaysSpecial} onChange={(event) => setEditing({ ...editing, isTodaysSpecial: event.target.checked })} className="h-4 w-4 accent-[#8C5138]" />Today’s special</label>
        </div>
      </div>
      {formError && <p role="alert" className="mt-3 text-sm text-red-700">{formError}</p>}
      <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={closeDishForm} className={buttonClass}>Cancel</button><button type="submit" disabled={isSaving} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#211A15] px-4 text-sm font-bold text-white disabled:opacity-50"><Check size={16} />{isSaving ? 'Saving…' : 'Save dish'}</button></div>
    </form>}

    <section className="overflow-hidden rounded-2xl border border-[#E8E2D9] bg-white">
      <div className="flex flex-col gap-3 border-b border-[#EEE9E2] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#82796F]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search dishes" aria-label="Search menu dishes" className="min-h-10 w-full rounded-xl border border-[#E3DDD4] pl-9 pr-3 text-sm outline-none focus:border-[#8C5138] focus:ring-2 focus:ring-[#8C5138]/15" /></div>
        <label className="relative flex items-center"><span className="sr-only">Filter menu category</span><select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="min-h-10 appearance-none rounded-xl border border-[#E3DDD4] bg-white pl-3 pr-9 text-sm font-medium outline-none focus:border-[#8C5138]"><option value="ALL">All categories</option>{setup.menuCategories.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select><ChevronDown size={14} className="pointer-events-none absolute right-3 text-[#756C62]" /></label>
      </div>
      <div className="overflow-x-auto"><table className="w-full min-w-[690px] text-left"><thead className="bg-[#3A2B21] text-[11px] uppercase tracking-wider text-[#FFF1D1]"><tr><th className="px-4 py-3 font-bold">Dish</th><th className="px-4 py-3 font-bold">Category</th><th className="px-4 py-3 font-bold">Price</th><th className="px-4 py-3 font-bold">Availability</th><th className="px-4 py-3 text-right font-bold">Action</th></tr></thead><tbody className="divide-y divide-[#F0ECE6]">
        {filtered.map((item) => { const special = item.isTodaysSpecial ?? item.isMaharajaSpecial ?? false; const categoryName = setup.menuCategories.find((entry) => entry.id === item.category)?.name ?? item.category; return <tr key={item.id} className="menu-item-row hover:bg-[#FDFCFB]">
          <td className="max-w-[340px] px-4 py-3.5"><div className="font-semibold">{item.name} {item.isPopular && <span className="text-xs text-[#8C5138]">· Featured</span>}</div><div className="mt-0.5 truncate text-xs text-[#837A70]">{item.description || 'No description added'}</div></td><td className="px-4 py-3.5 text-sm text-[#645A50]">{categoryName}</td><td className="px-4 py-3.5 text-sm font-semibold">₹{item.price}</td>
          <td className="px-4 py-3.5"><button type="button" onClick={() => toggleAvailability(item)} aria-pressed={item.isAvailable} className={`min-h-9 rounded-full px-3 text-xs font-bold ${item.isAvailable ? 'bg-emerald-50 text-emerald-800' : 'bg-[#F2EFEB] text-[#756C62]'}`}>{item.isAvailable ? 'Available' : 'Paused'}</button></td>
          <td className="px-4 py-3.5 text-right"><div className="inline-flex items-center gap-1"><button type="button" role="switch" aria-checked={special} aria-label={`${special ? 'Remove' : 'Mark'} ${item.name} ${special ? 'from' : 'as'} today’s special`} title="Today’s special" onClick={() => toggleTodaysSpecial(item)} className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C5138] focus-visible:ring-offset-2 ${special ? 'bg-[#8C5138]' : 'bg-[#D8D2CA]'}`}><span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${special ? 'translate-x-5' : 'translate-x-1'}`} /></button><button type="button" onClick={() => startEdit(item)} aria-label={`Edit ${item.name}`} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-bold text-[#8C5138] hover:bg-[#F8F1EA]"><Pencil size={14} />Edit</button><button type="button" onClick={() => deleteItem(item)} aria-label={`Delete ${item.name}`} className="ml-1 min-h-9 rounded-lg px-2 text-xs font-bold text-red-700 hover:bg-red-50">Delete</button></div></td>
        </tr>; })}
        {!filtered.length && <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-[#756C62]">No dishes match this search.</td></tr>}
      </tbody></table></div>
      <div className="border-t border-[#EEE9E2] px-4 py-3 text-xs text-[#756C62]">Showing {filtered.length} of {setup.menuItems.length} dishes · Changes stay in draft until published.</div>
    </section>
  </div>;
};
