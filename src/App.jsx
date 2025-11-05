import React, { useEffect, useMemo, useState } from 'react';
import HeaderBar from './components/HeaderBar';
import PlacementForm from './components/PlacementForm';
import Calendar from './components/Calendar';
import PlacementTable from './components/PlacementTable';
import { Search } from 'lucide-react';

const STORAGE_KEY = 'placement-tracker-items-v1';

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function App() {
  const [items, setItems] = useState(() => loadItems());
  const [editingId, setEditingId] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [query, setQuery] = useState('');
  const [showOnlyDay, setShowOnlyDay] = useState(false);

  useEffect(() => {
    saveItems(items);
  }, [items]);

  const activeItems = useMemo(() => items.filter((i) => i.status !== 'completed'), [items]);
  const completedItems = useMemo(() => items.filter((i) => i.status === 'completed'), [items]);

  const editingItem = items.find((i) => i.id === editingId) || null;

  const dotsByDate = useMemo(() => {
    const map = {};
    for (const i of activeItems) {
      const key = i.date?.slice(0, 10);
      if (!key) continue;
      map[key] = (map[key] || 0) + 1;
    }
    return map;
  }, [activeItems]);

  const filteredActive = useMemo(() => {
    let list = activeItems;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((i) => [i.company, i.role, i.round, i.ctc].some((f) => String(f || '').toLowerCase().includes(q)));
    }
    if (showOnlyDay && selectedDate) {
      const key = selectedDate.toISOString().slice(0, 10);
      list = list.filter((i) => i.date?.slice(0, 10) === key);
    }
    return list.sort((a,b) => (a.date || '').localeCompare(b.date || ''));
  }, [activeItems, query, selectedDate, showOnlyDay]);

  const filteredCompleted = useMemo(() => {
    let list = completedItems;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((i) => [i.company, i.role, i.round, i.ctc].some((f) => String(f || '').toLowerCase().includes(q)));
    }
    return list.sort((a,b) => (b.updatedAt || b.date || '').localeCompare(a.updatedAt || a.date || ''));
  }, [completedItems, query]);

  const totals = { active: activeItems.length, completed: completedItems.length };

  const handleSubmit = (data) => {
    if (editingItem) {
      setItems((prev) => prev.map((it) => (it.id === editingItem.id ? { ...it, ...data, date: data.date, updatedAt: new Date().toISOString() } : it)));
      setEditingId(null);
    } else {
      const entry = {
        id: uid(),
        ...data,
        crossed: false,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      setItems((prev) => [entry, ...prev]);
    }
  };

  const toggleCross = (id) => setItems((prev) => prev.map((it) => (it.id === id ? { ...it, crossed: !it.crossed } : it)));
  const markComplete = (id) => setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status: 'completed', crossed: true, updatedAt: new Date().toISOString() } : it)));
  const removeItem = (id) => setItems((prev) => prev.filter((it) => it.id !== id));
  const editItem = (id) => setEditingId(id);

  const goPrev = () => {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() - 1);
    setCurrentMonth(d);
  };
  const goNext = () => {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() + 1);
    setCurrentMonth(d);
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setShowOnlyDay(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 text-slate-800">
      <HeaderBar totals={totals} />

      <main className="max-w-6xl mx-auto px-4 py-6 grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-slate-200 p-4 bg-white/70 backdrop-blur">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800">Add / Edit Placement</h2>
              {editingItem && (
                <button onClick={() => setEditingId(null)} className="text-xs text-indigo-600 hover:underline">Cancel edit</button>
              )}
            </div>
            <PlacementForm onSubmit={handleSubmit} editing={editingItem} />
          </div>

          <div className="rounded-xl border border-slate-200 p-3 bg-white/70 backdrop-blur flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by company, role, round, or CTC" className="pl-9 w-full px-3 py-2 rounded-md border border-slate-200 bg-white/90 focus:bg-white outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <label className="text-sm text-slate-600 inline-flex items-center gap-2">
              <input type="checkbox" checked={showOnlyDay} onChange={(e) => setShowOnlyDay(e.target.checked)} />
              Only selected day
            </label>
            {selectedDate && (
              <button className="text-sm text-indigo-600 hover:underline" onClick={() => { setSelectedDate(null); setShowOnlyDay(false); }}>Clear date</button>
            )}
          </div>

          <PlacementTable
            title="Active"
            items={filteredActive}
            onToggleCross={toggleCross}
            onComplete={markComplete}
            onDelete={removeItem}
            onEdit={editItem}
          />

          <PlacementTable
            title="Completed"
            items={filteredCompleted}
            onToggleCross={() => {}}
            onComplete={() => {}}
            onDelete={removeItem}
            onEdit={() => {}}
            completed
          />
        </section>

        <aside className="lg:col-span-1 space-y-4">
          <Calendar
            current={currentMonth}
            onPrev={goPrev}
            onNext={goNext}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            dotsByDate={dotsByDate}
          />

          <div className="rounded-xl border border-slate-200 p-4 bg-white/70 backdrop-blur">
            <h3 className="font-semibold mb-2">Tips</h3>
            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
              <li>Click a date on the calendar to filter entries for that day.</li>
              <li>Use "Cross" to temporarily strike items you’ve handled.</li>
              <li>"Complete" moves an item to the completed list.</li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}
