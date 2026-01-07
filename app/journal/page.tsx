'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import TopBar from '@/app/components/TopBar';
import IconRail from '@/app/components/IconRail';
import { JournalEntry, JournalCategory, getEntries, createEntry, updateEntry, deleteEntry } from '@/app/utils/journal';

const CATEGORIES: JournalCategory[] = ['Work', 'Personal', 'Events', 'Education', 'Social'];

type SortOrder = 'Newest First' | 'Oldest First';

function formatFullDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function formatWeekday(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

function formatDay(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return String(d.getDate());
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>(() => getEntries());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('Newest First');
  const [selectedCategory, setSelectedCategory] = useState<JournalCategory>('Personal');

  const titleRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPos, setToolbarPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [showSlash, setShowSlash] = useState(false);
  const [slashPos, setSlashPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  // Refresh entries when storage might change externally (none in v1)
  // Left intentionally minimal; entries are updated locally after create/update.

  // Active entry
  const activeEntry = useMemo(() => entries.find(e => e.id === activeId) || null, [entries, activeId]);

  // Sort behavior
  const sortedEntries = useMemo(() => {
    const arr = [...entries];
    arr.sort((a, b) => {
      const cmp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      return sortOrder === 'Newest First' ? -cmp : cmp;
    });
    return arr;
  }, [entries, sortOrder]);

  // Create new entry
  const handleNewEntry = () => {
    const created = createEntry(selectedCategory);
    if (created) {
      const next = getEntries();
      setEntries(next);
      selectEntry(created);
    }
  };

  const selectEntry = (entry: JournalEntry) => {
    setActiveId(entry.id);
    setPendingTitle(entry.title || '');
    setPendingBody(entry.bodyHtml || '');
    if (titleRef.current) titleRef.current.innerText = entry.title || '';
    if (bodyRef.current) bodyRef.current.innerHTML = entry.bodyHtml || '';
    setTimeout(() => {
      bodyRef.current?.focus();
    }, 0);
  };

  // Title/body updates with debounce autosave
  const [pendingTitle, setPendingTitle] = useState<string>('');
  const [pendingBody, setPendingBody] = useState<string>('');

  // Initialize pending state handled in selectEntry()

  useEffect(() => {
    const t = setTimeout(() => {
      if (!activeId) return;
      const updated = updateEntry(activeId, { title: pendingTitle, bodyHtml: pendingBody });
      if (updated) setEntries(getEntries());
    }, 600);
    return () => clearTimeout(t);
  }, [pendingTitle, pendingBody, activeId]);

  // Selection toolbar logic
  useEffect(() => {
    function onSelectionChange() {
      if (!editorContainerRef.current || !bodyRef.current) return;
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) {
        setShowToolbar(false);
        return;
      }
      const range = sel.getRangeAt(0);
      if (!bodyRef.current.contains(range.commonAncestorContainer)) {
        setShowToolbar(false);
        return;
      }
      const rect = range.getBoundingClientRect();
      const containerRect = editorContainerRef.current.getBoundingClientRect();
      const top = rect.top - containerRect.top - 40; // above selection
      const left = rect.left - containerRect.left;
      if (rect.width === 0 && rect.height === 0) {
        setShowToolbar(false);
        return;
      }
      setToolbarPos({ top: Math.max(0, top), left: Math.max(0, left) });
      setShowToolbar(true);
    }
    document.addEventListener('selectionchange', onSelectionChange);
    return () => document.removeEventListener('selectionchange', onSelectionChange);
  }, []);

  const exec = (cmd: string) => {
    document.execCommand(cmd, false);
    setShowToolbar(false);
  };

  const handleDeleteActive = () => {
    if (!activeId) return;
    const ok = deleteEntry(activeId);
    if (ok) {
      const next = getEntries();
      setEntries(next);
      setActiveId(null);
      setPendingTitle('');
      setPendingBody('');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      <TopBar minutesToday={0} />
      <IconRail currentPage="journal" />

      <main className="ml-16 mt-14 min-h-screen">
        <div className="mx-auto max-w-none px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Sidebar */}
        <aside className="lg:col-span-2 bg-neutral-900 rounded-lg ring-1 ring-neutral-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-neutral-300">Journals</h2>
          </div>
          <ul className="space-y-1">
            {CATEGORIES.map(cat => (
              <li key={cat}>
                <button
                  className={`w-full text-left px-2 py-1 rounded ${selectedCategory === cat ? 'bg-neutral-800 text-white' : 'text-neutral-300 hover:bg-neutral-850'}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <button onClick={handleNewEntry} className="w-full px-3 py-2 rounded-lg bg-neutral-200 text-neutral-900 text-sm font-medium hover:bg-white transition">+ New Entry</button>
          </div>
        </aside>

        {/* Middle Column: Entry List */}
        <section className="lg:col-span-3 bg-neutral-900 rounded-lg ring-1 ring-neutral-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-neutral-300">Entries</h3>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="text-xs bg-neutral-900 ring-1 ring-neutral-700 rounded px-2 py-1 text-neutral-300"
            >
              <option>Newest First</option>
              <option>Oldest First</option>
            </select>
          </div>
          <div className="space-y-2 overflow-y-auto max-h-[75vh] pr-1">
            {sortedEntries.filter(entry => entry.category === selectedCategory).map(entry => (
              <div
                key={entry.id}
                className={`w-full px-3 py-2 rounded-lg transition flex items-center gap-3 ${activeId === entry.id ? 'bg-white text-neutral-900 ring-2 ring-emerald-600' : 'hover:bg-neutral-850 bg-neutral-900'}`}
              >
                <button onClick={() => selectEntry(entry)} className="flex-1 text-left">
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`text-lg font-bold leading-none ${activeId === entry.id ? 'text-neutral-900' : 'text-neutral-200'}`}>{formatDay(entry.date)}</div>
                      <div className={`text-xs ${activeId === entry.id ? 'text-neutral-600' : 'text-neutral-500'}`}>{formatWeekday(entry.date)}</div>
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-bold ${activeId === entry.id ? 'text-neutral-900' : 'text-neutral-200'}`}>{entry.title || 'Untitled'}</div>
                      <div className={`text-xs overflow-hidden max-h-10 ${activeId === entry.id ? 'text-neutral-600' : 'text-neutral-500'}`}>{stripHtml(entry.bodyHtml).slice(0, 140)}{entry.bodyHtml.length > 140 ? '…' : ''}</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => { setActiveId(entry.id); handleDeleteActive(); }}
                  className="text-xs text-neutral-400 hover:text-red-400 px-2 py-1"
                  aria-label="Delete entry"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Editor */}
        <section ref={editorContainerRef} className="lg:col-span-7 bg-neutral-900 rounded-lg ring-1 ring-neutral-800 p-6 relative">
          {!activeEntry ? (
            <div className="text-neutral-500 text-sm">Start writing.</div>
          ) : (
            <div className="space-y-4">
              <div className="text-neutral-400 text-xs flex items-center justify-between">
                <span>{formatFullDate(activeEntry.date)}</span>
                <button onClick={handleDeleteActive} className="text-xs text-neutral-500 hover:text-red-400">Delete entry</button>
              </div>
              {/* Title */}
              <div
                ref={titleRef}
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => setPendingTitle((e.target as HTMLDivElement).innerText)}
                className="text-2xl font-semibold text-white outline-none"
              />
              {/* Body */}
              <div
                ref={bodyRef}
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => setPendingBody((e.target as HTMLDivElement).innerHTML)}
                onKeyDown={(e) => {
                  if (e.key === '/') {
                    e.preventDefault();
                    const sel = window.getSelection();
                    if (!sel || sel.rangeCount === 0) return;
                    const range = sel.getRangeAt(0);
                    const rect = range.getBoundingClientRect();
                    const containerRect = editorContainerRef.current?.getBoundingClientRect();
                    let top = (rect.top - (containerRect?.top || 0)) + 24;
                    let left = (rect.left - (containerRect?.left || 0));
                    top = Math.max(16, top);
                    left = Math.max(16, left);
                    setSlashPos({ top, left });
                    setShowSlash(true);
                  }
                }}
                className="min-h-[60vh] text-[0.95rem] leading-7 text-neutral-200 outline-none"
                style={{ caretColor: 'white' }}
              />

              {/* Inline toolbar */}
              {showToolbar && (
                <div
                  ref={toolbarRef}
                  style={{ top: toolbarPos.top, left: toolbarPos.left }}
                  className="absolute z-50 bg-neutral-800 text-neutral-100 text-xs rounded-lg shadow px-2 py-1 flex gap-2"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <button onClick={() => exec('bold')} className="hover:text-white">B</button>
                  <button onClick={() => exec('italic')} className="hover:text-white italic">I</button>
                  <button onClick={() => exec('underline')} className="hover:text-white underline">U</button>
                  <button onClick={() => { document.execCommand('formatBlock', false, 'blockquote'); setShowToolbar(false); }} className="hover:text-white">❝</button>
                  <button onClick={() => { document.execCommand('formatBlock', false, 'h1'); setShowToolbar(false); }} className="hover:text-white">H1</button>
                  <button onClick={() => { document.execCommand('insertUnorderedList', false); setShowToolbar(false); }} className="hover:text-white">• List</button>
                  <button onClick={() => { document.execCommand('hiliteColor', false, '#3b82f630'); setShowToolbar(false); }} className="hover:text-white">Highlight</button>
                </div>
              )}
              {showSlash && (
                <div
                  style={{ top: slashPos.top, left: slashPos.left }}
                  className="absolute z-50 bg-neutral-900 ring-1 ring-neutral-700 text-white text-xs rounded-lg shadow-lg px-2 py-2 flex flex-col gap-1"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <button onClick={() => { exec('bold'); setShowSlash(false); }} className="text-left px-2 py-1 hover:bg-neutral-800">Bold</button>
                  <button onClick={() => { exec('italic'); setShowSlash(false); }} className="text-left px-2 py-1 hover:bg-neutral-800">Italic</button>
                  <button onClick={() => { exec('underline'); setShowSlash(false); }} className="text-left px-2 py-1 hover:bg-neutral-800">Underline</button>
                  <button onClick={() => { document.execCommand('formatBlock', false, 'h1'); setShowSlash(false); }} className="text-left px-2 py-1 hover:bg-neutral-800">Headline</button>
                  <button onClick={() => { document.execCommand('formatBlock', false, 'blockquote'); setShowSlash(false); }} className="text-left px-2 py-1 hover:bg-neutral-800">Quote</button>
                  <button onClick={() => { document.execCommand('insertUnorderedList', false); setShowSlash(false); }} className="text-left px-2 py-1 hover:bg-neutral-800">Bullet List</button>
                  <button onClick={() => { document.execCommand('hiliteColor', false, '#3b82f630'); setShowSlash(false); }} className="text-left px-2 py-1 hover:bg-neutral-800">Highlight</button>
                  <button onClick={() => setShowSlash(false)} className="text-left px-2 py-1 text-neutral-400">Close</button>
                </div>
              )}
            </div>
          )}
        </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function stripHtml(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}
