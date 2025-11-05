import React from 'react';
import { Calendar as CalendarIcon, CheckCircle2, ClipboardList } from 'lucide-react';

export default function HeaderBar({ totals }) {
  return (
    <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-slate-200"> 
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white grid place-items-center shadow">
            <CalendarIcon size={22} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Placement Tracker</h1>
            <p className="text-xs text-slate-500">Stay on top of registrations, rounds, and results</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-slate-700">
            <ClipboardList size={18} className="text-indigo-600" />
            <span className="font-medium">Active: {totals.active}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <span className="font-medium">Completed: {totals.completed}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
