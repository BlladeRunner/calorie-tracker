"use client";

import type { LogEntryWithFood } from "@/lib/types";
import { MEALS } from "@/lib/types";

interface Props {
  entries: LogEntryWithFood[];
  onDelete: (id: number) => void;
}

export default function FoodLog({ entries, onDelete }: Props) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <p className="text-slate-500 font-medium">No foods logged yet</p>
        <p className="text-sm text-slate-400 mt-1">
          Use the search, quick-add, or AI lookup above to get started
        </p>
      </div>
    );
  }

  // Group entries by meal
  const grouped = MEALS.map((meal) => ({
    ...meal,
    entries: entries.filter((e) => (e.meal || "snack") === meal.value),
  })).filter((group) => group.entries.length > 0);

  return (
    <div className="space-y-4">
      {grouped.map((group) => {
        const groupCals = group.entries.reduce(
          (sum, e) => sum + Math.round(e.food.calories * e.servings), 0
        );
        return (
          <div key={group.value}>
            {/* Meal header */}
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-2">
                <span className="text-sm">{group.icon}</span>
                <span className="text-sm font-semibold text-slate-700">{group.label}</span>
                <span className="text-xs text-slate-400">
                  {group.entries.length} {group.entries.length === 1 ? "item" : "items"}
                </span>
              </div>
              <span className="text-xs font-medium text-slate-500">{groupCals} kcal</span>
            </div>

            {/* Entries */}
            <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden divide-y divide-slate-100">
              {group.entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-slate-50/50 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-slate-800 truncate">
                        {entry.food.name}
                      </span>
                      {entry.servings !== 1 && (
                        <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                          x{entry.servings}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3 text-xs text-slate-400 mt-0.5">
                      <span>{entry.food.servingSize}</span>
                      <span className="text-blue-400">{Math.round(entry.food.protein * entry.servings)}g P</span>
                      <span className="text-amber-400">{Math.round(entry.food.carbs * entry.servings)}g C</span>
                      <span className="text-rose-400">{Math.round(entry.food.fat * entry.servings)}g F</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <span className="text-sm font-semibold text-slate-700 whitespace-nowrap tabular-nums">
                      {Math.round(entry.food.calories * entry.servings)}
                      <span className="text-xs font-normal text-slate-400 ml-0.5">kcal</span>
                    </span>
                    <button
                      onClick={() => onDelete(entry.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100 sm:opacity-100"
                      title="Remove"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
