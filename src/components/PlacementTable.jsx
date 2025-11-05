import React from 'react';
import { Check, Trash2, Link as LinkIcon, ExternalLink, Edit, XCircle, CheckCircle2 } from 'lucide-react';

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return iso;
  }
}

export default function PlacementTable({ title, items, onToggleCross, onComplete, onDelete, onEdit, completed = false }) {
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white/70 backdrop-blur">
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-white/80 to-white">
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <div className="text-xs text-slate-500">{items.length} item{items.length !== 1 ? 's' : ''}</div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left px-4 py-2">Company</th>
              <th className="text-left px-4 py-2">Role</th>
              <th className="text-left px-4 py-2">CTC</th>
              <th className="text-left px-4 py-2">Round</th>
              <th className="text-left px-4 py-2">Date</th>
              <th className="text-left px-4 py-2">Link</th>
              <th className="text-right px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-slate-500 py-8">No items to display</td>
              </tr>
            )}
            {items.map((it) => (
              <tr key={it.id} className="border-t border-slate-100">
                <td className="px-4 py-2">
                  <span className={it.crossed ? 'line-through text-slate-400' : ''}>{it.company}</span>
                </td>
                <td className="px-4 py-2">
                  <span className={it.crossed ? 'line-through text-slate-400' : ''}>{it.role}</span>
                </td>
                <td className="px-4 py-2">{it.ctc}</td>
                <td className="px-4 py-2">{it.round}</td>
                <td className="px-4 py-2">{formatDate(it.date)}</td>
                <td className="px-4 py-2">
                  {it.link ? (
                    <a href={it.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-indigo-600 hover:underline">
                      <LinkIcon size={16} /> <span className="hidden sm:inline">Open</span> <ExternalLink size={14} />
                    </a>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <div className="flex justify-end items-center gap-2">
                    {!completed && (
                      <button
                        onClick={() => onToggleCross(it.id)}
                        className={['px-2 py-1 rounded-md border text-xs inline-flex items-center gap-1', it.crossed ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 'border-slate-200 text-slate-700 hover:bg-slate-50'].join(' ')}
                        title={it.crossed ? 'Uncross' : 'Cross out'}
                      >
                        {it.crossed ? <CheckCircle2 size={14} /> : <XCircle size={14} />} {it.crossed ? 'Done' : 'Cross'}
                      </button>
                    )}
                    {!completed && (
                      <button onClick={() => onEdit(it.id)} className="px-2 py-1 rounded-md border border-slate-200 text-slate-700 text-xs inline-flex items-center gap-1 hover:bg-slate-50" title="Edit">
                        <Edit size={14} /> Edit
                      </button>
                    )}
                    {!completed ? (
                      <button onClick={() => onComplete(it.id)} className="px-2 py-1 rounded-md bg-indigo-600 text-white text-xs inline-flex items-center gap-1 hover:bg-indigo-700" title="Mark completed">
                        <Check size={14} /> Complete
                      </button>
                    ) : null}
                    <button onClick={() => onDelete(it.id)} className="px-2 py-1 rounded-md border border-rose-200 text-rose-700 text-xs inline-flex items-center gap-1 hover:bg-rose-50" title="Delete">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
