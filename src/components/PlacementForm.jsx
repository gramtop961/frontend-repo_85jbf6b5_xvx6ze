import React, { useEffect, useState } from 'react';
import { Plus, Link as LinkIcon, Calendar as CalendarIcon } from 'lucide-react';

const initial = {
  company: '',
  role: '',
  ctc: '',
  round: '',
  date: '', // yyyy-mm-dd
  link: '',
};

export default function PlacementForm({ onSubmit, editing }) {
  const [form, setForm] = useState(initial);

  useEffect(() => {
    if (editing) {
      setForm({
        company: editing.company || '',
        role: editing.role || '',
        ctc: editing.ctc || '',
        round: editing.round || '',
        date: editing.date ? editing.date.slice(0, 10) : '',
        link: editing.link || '',
      });
    } else {
      setForm(initial);
    }
  }, [editing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.company || !form.role || !form.date) return;
    onSubmit({ ...form });
    if (!editing) setForm(initial);
  };

  return (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-6 grid-cols-1 gap-3">
      <input
        name="company"
        value={form.company}
        onChange={handleChange}
        placeholder="Company"
        className="px-3 py-2 rounded-md border border-slate-200 bg-white/90 focus:bg-white outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        name="role"
        value={form.role}
        onChange={handleChange}
        placeholder="Role"
        className="px-3 py-2 rounded-md border border-slate-200 bg-white/90 focus:bg-white outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        name="ctc"
        value={form.ctc}
        onChange={handleChange}
        placeholder="CTC (LPA)"
        className="px-3 py-2 rounded-md border border-slate-200 bg-white/90 focus:bg-white outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        name="round"
        value={form.round}
        onChange={handleChange}
        placeholder="Round"
        className="px-3 py-2 rounded-md border border-slate-200 bg-white/90 focus:bg-white outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <div className="relative">
        <CalendarIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="pl-9 w-full px-3 py-2 rounded-md border border-slate-200 bg-white/90 focus:bg-white outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="relative">
        <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          name="link"
          value={form.link}
          onChange={handleChange}
          placeholder="Link (registration / JD)"
          className="pl-9 w-full px-3 py-2 rounded-md border border-slate-200 bg-white/90 focus:bg-white outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="md:col-span-6 flex items-center gap-3">
        <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition">
          <Plus size={18} /> {editing ? 'Update Entry' : 'Add Entry'}
        </button>
        <span className="text-xs text-slate-500">Required: Company, Role, Date</span>
      </div>
    </form>
  );
}
