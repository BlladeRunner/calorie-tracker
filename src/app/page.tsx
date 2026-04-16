"use client";

import { useState, useEffect, useCallback } from "react";
import DailySummary from "@/components/DailySummary";
import FoodSearch from "@/components/FoodSearch";
import AIFoodLookup from "@/components/AIFoodLookup";
import FoodLog from "@/components/FoodLog";
import type { LogEntryWithFood, Meal } from "@/lib/types";
import { MEALS } from "@/lib/types";

const CALORIE_GOAL = 2000;

function getTodayDate(): string {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

export default function Home() {
  const [entries, setEntries] = useState<LogEntryWithFood[]>([]);
  const [loading, setLoading] = useState(true);
  const [meal, setMeal] = useState<Meal>("breakfast");
  const today = getTodayDate();

  const fetchLog = useCallback(async () => {
    const res = await fetch(`/api/log?date=${today}`);
    const data = await res.json();
    setEntries(data);
    setLoading(false);
  }, [today]);

  useEffect(() => {
    fetchLog();
  }, [fetchLog]);

  // Auto-select meal based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 11) setMeal("breakfast");
    else if (hour < 15) setMeal("lunch");
    else if (hour < 20) setMeal("dinner");
    else setMeal("snack");
  }, []);

  async function handleAdd(foodId: number) {
    await fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ foodId, servings: 1, date: today, meal }),
    });
    fetchLog();
  }

  async function handleDelete(id: number) {
    await fetch(`/api/log?id=${id}`, { method: "DELETE" });
    fetchLog();
  }

  const formattedDate = new Date(today + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200/60">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">NutriTrack</h1>
            <p className="text-xs text-slate-400">{formattedDate}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-5 pb-20 space-y-5">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Daily Summary */}
            <DailySummary entries={entries} calorieGoal={CALORIE_GOAL} />

            {/* Add Food Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-800">Add Food</h2>
                <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                  AI powered
                </span>
              </div>

              {/* Meal selector */}
              <div className="flex gap-1 overflow-x-auto scrollbar-hide -mx-1 px-1">
                {MEALS.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setMeal(m.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      meal === m.value
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    <span>{m.icon}</span>
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Food Search */}
              <FoodSearch onAdd={handleAdd} meal={meal} />

              {/* AI Lookup */}
              <div className="pt-2 border-t border-slate-100">
                <AIFoodLookup onFoodLogged={fetchLog} meal={meal} />
              </div>
            </section>

            {/* Food Log */}
            <section>
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-sm font-semibold text-slate-800">Today&apos;s Log</h2>
                {entries.length > 0 && (
                  <span className="text-xs text-slate-400">
                    {entries.length} {entries.length === 1 ? "item" : "items"}
                  </span>
                )}
              </div>
              <FoodLog entries={entries} onDelete={handleDelete} />
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Summary skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-6">
        <div className="h-4 w-24 bg-slate-200 rounded mb-3" />
        <div className="h-8 w-32 bg-slate-200 rounded mb-4" />
        <div className="h-3 w-full bg-slate-100 rounded-full mb-6" />
        <div className="grid grid-cols-3 gap-4">
          <div><div className="h-2 w-12 bg-slate-200 rounded mb-2" /><div className="h-1.5 w-full bg-slate-100 rounded-full" /></div>
          <div><div className="h-2 w-12 bg-slate-200 rounded mb-2" /><div className="h-1.5 w-full bg-slate-100 rounded-full" /></div>
          <div><div className="h-2 w-12 bg-slate-200 rounded mb-2" /><div className="h-1.5 w-full bg-slate-100 rounded-full" /></div>
        </div>
      </div>
      {/* Add food skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-5">
        <div className="h-4 w-20 bg-slate-200 rounded mb-4" />
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-8 w-20 bg-slate-100 rounded-lg" />)}
        </div>
        <div className="h-10 w-full bg-slate-100 rounded-xl" />
      </div>
      {/* Log skeleton */}
      <div>
        <div className="h-4 w-24 bg-slate-200 rounded mb-3" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-white rounded-xl border border-slate-200/60" />)}
        </div>
      </div>
    </div>
  );
}
