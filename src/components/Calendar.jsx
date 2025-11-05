import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function getMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay(); // 0 Sun - 6 Sat
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const matrix = [];
  let day = 1 - startDay;
  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(year, month, day);
      week.push(date);
      day++;
    }
    matrix.push(week);
  }
  return matrix;
}

export default function Calendar({ current, onPrev, onNext, selectedDate, onSelectDate, dotsByDate }) {
  const year = current.getFullYear();
  const month = current.getMonth();
  const monthMatrix = useMemo(() => getMonthMatrix(year, month), [year, month]);
  const monthName = current.toLocaleString('default', { month: 'long' });

  const isSameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  return (
    <div className="rounded-xl border border-slate-200 bg-white/70 backdrop-blur p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold text-slate-800">{monthName} {year}</div>
        <div className="flex items-center gap-2">
          <button onClick={onPrev} className="p-2 rounded-md hover:bg-slate-100">
            <ChevronLeft size={18} />
          </button>
          <button onClick={onNext} className="p-2 rounded-md hover:bg-slate-100">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-xs text-slate-500 mb-1">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
          <div key={d} className="py-1 text-center">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {monthMatrix.flat().map((date, idx) => {
          const inMonth = date.getMonth() === month;
          const key = date.toISOString().slice(0,10);
          const hasItems = dotsByDate[key] && dotsByDate[key] > 0;
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          return (
            <button
              key={idx}
              onClick={() => onSelectDate(date)}
              className={[
                'relative h-10 rounded-md text-sm flex items-center justify-center transition',
                inMonth ? 'text-slate-800' : 'text-slate-300',
                isSelected ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100'
              ].join(' ')}
            >
              {date.getDate()}
              {hasItems && (
                <span className={[
                  'absolute bottom-1 h-1.5 w-1.5 rounded-full',
                  isSelected ? 'bg-white' : 'bg-indigo-500'
                ].join(' ')} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
