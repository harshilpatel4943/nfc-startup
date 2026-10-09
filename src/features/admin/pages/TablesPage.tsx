import React, { useState } from 'react';
import { ArrowUpRight, Copy, Link2, Plus, QrCode, Wifi } from 'lucide-react';
import type { DemoSetup } from '../../../data/demoStore';

interface TablesPageProps { setup: DemoSetup; onChange: (setup: DemoSetup) => void }

export const TablesPage: React.FC<TablesPageProps> = ({ setup, onChange }) => {
  const [notice, setNotice] = useState('');
  const addTable = () => {
    const number = Math.max(0, ...setup.tables.map((table) => table.number)) + 1;
    onChange({ ...setup, tables: [...setup.tables, { id: `table-${number}-${Date.now()}`, number, isActive: true }] });
    setNotice(`Table ${number} added. Save and publish to use its link.`);
  };
  const toggleTable = (id: string) => onChange({ ...setup, tables: setup.tables.map((table) => table.id === id ? { ...table, isActive: !table.isActive } : table) });
  const tableUrl = (number: number) => `${window.location.origin}/?table=${number}`;
  const copyLink = async (number: number) => {
    try { await navigator.clipboard.writeText(tableUrl(number)); setNotice(`Table ${number} link copied.`); }
    catch { setNotice('Clipboard access is unavailable. Open the preview link and copy it from the address bar.'); }
  };

  return <div className="space-y-5">
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h2 className="text-xl font-bold">Tables & NFC links</h2><p className="mt-1 max-w-2xl text-sm text-[#756C62]">Each table opens the same guest experience with its table number attached. Copy a link to encode into an NFC tag or QR code.</p></div><button type="button" onClick={addTable} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#8C5138] px-4 text-sm font-bold text-white hover:bg-[#70402D]"><Plus size={17} />Add table</button></div>
    {notice && <p role="status" aria-live="polite" className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">{notice}</p>}
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{setup.tables.slice().sort((a, b) => a.number - b.number).map((table) => <article key={table.id} className="rounded-2xl border border-[#E8E2D9] bg-white p-5">
      <div className="flex items-start justify-between"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F2EEE8] text-[#8C5138]"><QrCode size={21} /></span><div><h3 className="font-bold">Table {table.number}</h3><span className={`mt-1 inline-flex items-center gap-1.5 text-xs font-semibold ${table.isActive ? 'text-emerald-700' : 'text-[#82796F]'}`}><span className={`h-1.5 w-1.5 rounded-full ${table.isActive ? 'bg-emerald-500' : 'bg-[#A9A198]'}`} />{table.isActive ? 'Link active' : 'Link paused'}</span></div></div><Wifi size={17} className="text-[#A89B8A]" /></div>
      <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#F8F6F2] px-3 py-2.5"><Link2 size={14} className="shrink-0 text-[#8C5138]" /><code className="min-w-0 flex-1 truncate text-xs text-[#645A50]">/?table={table.number}</code></div>
      <div className="mt-3 flex gap-2"><button type="button" disabled={!table.isActive} onClick={() => void copyLink(table.number)} className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-[#DED7CE] text-xs font-bold text-[#51483E] hover:bg-[#F8F6F2] disabled:cursor-not-allowed disabled:opacity-50"><Copy size={14} />Copy link</button><a aria-disabled={!table.isActive} href={tableUrl(table.number)} target="_blank" rel="noreferrer" className={`inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[#211A15] text-xs font-bold text-white hover:bg-black ${!table.isActive ? 'pointer-events-none opacity-50' : ''}`}><ArrowUpRight size={14} />Preview</a></div>
      <button type="button" onClick={() => toggleTable(table.id)} aria-pressed={table.isActive} className="mt-3 min-h-9 w-full rounded-lg text-xs font-semibold text-[#8C5138] hover:bg-[#FBF6F1]">{table.isActive ? 'Pause table link' : 'Activate table link'}</button>
    </article>)}
      {!setup.tables.length && <div className="rounded-2xl border border-dashed border-[#D7CEC3] bg-white p-8 text-center sm:col-span-2 xl:col-span-3"><h3 className="font-bold">No tables added</h3><p className="mt-1 text-sm text-[#756C62]">Add a table to create its customer link.</p></div>}
    </section>
    <div className="rounded-2xl border border-[#EADCC9] bg-[#FBF6EF] p-4 text-sm leading-relaxed text-[#725C42]"><strong>For the customer setup:</strong> copy each link into your NFC tag writer or QR code generator, then attach the tag to its table. This demo creates the link; it does not write physical NFC tags.</div>
  </div>;
};
