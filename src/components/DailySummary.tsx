"use client";

import type { LogEntryWithFood } from "@/lib/types";

interface Props {
  entries: LogEntryWithFood[];
  calorieGoal: number;
}

export default function DailySummary({ entries, calorieGoal }: Props) {
  const totals = entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.food.calories * entry.servings,
      protein: acc.protein + entry.food.protein * entry.servings,
      carbs: acc.carbs + entry.food.carbs * entry.servings,
      fat: acc.fat + entry.food.fat * entry.servings,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const caloriePercent = Math.min((totals.calories / calorieGoal) * 100, 100);
  const remaining = Math.max(calorieGoal - Math.round(totals.calories), 0);
  const overGoal = totals.calories > calorieGoal;

  // Color based on progress
  let progressColor = "bg-emerald-500";
  let progressBg = "bg-emerald-100";
  let textColor = "text-emerald-600";
  if (caloriePercent >= 100) {
    progressColor = "bg-red-500";
    progressBg = "bg-red-100";
    textColor = "text-red-600";
  } else if (caloriePercent >= 75) {
    progressColor = "bg-amber-500";
    progressBg = "bg-amber-100";
    textColor = "text-amber-600";
  }

  const macros = [
    { label: "Protein", value: Math.round(totals.protein), unit: "g", color: "bg-blue-500", bgColor: "bg-blue-100", percent: Math.min((totals.protein / 150) * 100, 100) },
    { label: "Carbs", value: Math.round(totals.carbs), unit: "g", color: "bg-amber-500", bgColor: "bg-amber-100", percent: Math.min((totals.carbs / 250) * 100, 100) },
    { label: "Fat", value: Math.round(totals.fat), unit: "g", color: "bg-rose-500", bgColor: "bg-rose-100", percent: Math.min((totals.fat / 65) * 100, 100) },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 sm:p-6">
      {/* Calorie progress */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Daily Calories</p>
          <p className="text-3xl font-bold tracking-tight mt-0.5">
            {Math.round(totals.calories)}
            <span className="text-base font-normal text-slate-400 ml-1">
              / {calorieGoal}
            </span>
          </p>
        </div>
        <div className={`text-right ${textColor}`}>
          <p className="text-sm font-semibold">
            {overGoal
              ? `${Math.round(totals.calories - calorieGoal)} over`
              : `${remaining} left`}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">kcal</p>
        </div>
      </div>

      {/* Calorie bar */}
      <div className={`h-3 rounded-full ${progressBg} overflow-hidden mb-6`}>
        <div
          className={`h-full rounded-full ${progressColor} transition-all duration-500 ease-out`}
          style={{ width: `${caloriePercent}%` }}
        />
      </div>

      {/* Macro breakdown */}
      <div className="grid grid-cols-3 gap-4">
        {macros.map((macro) => (
          <div key={macro.label}>
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-500">{macro.label}</span>
              <span className="text-xs font-semibold text-slate-700">
                {macro.value}{macro.unit}
              </span>
            </div>
            <div className={`h-1.5 rounded-full ${macro.bgColor} overflow-hidden`}>
              <div
                className={`h-full rounded-full ${macro.color} transition-all duration-500 ease-out`}
                style={{ width: `${macro.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
