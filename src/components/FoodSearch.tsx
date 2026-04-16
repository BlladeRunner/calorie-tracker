"use client";

import { useState, useEffect, useRef } from "react";
import type { Food } from "@/db/foods";
import type { Meal } from "@/lib/types";

interface Props {
  onAdd: (foodId: number) => void;
  meal: Meal;
}

export default function FoodSearch({ onAdd, meal }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Food[]>([]);
  const [allFoods, setAllFoods] = useState<Food[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [addedId, setAddedId] = useState<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/foods")
      .then((res) => res.json())
      .then(setAllFoods);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      fetch(`/api/foods?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data);
          setShowResults(true);
        });
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleAdd(foodId: number) {
    onAdd(foodId);
    setAddedId(foodId);
    setTimeout(() => setAddedId(null), 800);
    setQuery("");
    setShowResults(false);
  }

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div ref={wrapperRef} className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowResults(true)}
          placeholder="Search foods..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-shadow"
        />
        {showResults && results.length > 0 && (
          <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-slate-200 max-h-60 overflow-y-auto">
            {results.map((food) => (
              <button
                key={food.id}
                onClick={() => handleAdd(food.id)}
                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors flex justify-between items-center border-b border-slate-50 last:border-0"
              >
                <div>
                  <span className="text-sm font-medium text-slate-700">{food.name}</span>
                  <span className="text-xs text-slate-400 ml-2">{food.servingSize}</span>
                </div>
                <span className="text-xs font-semibold text-slate-500 tabular-nums">{food.calories} kcal</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick-add grid */}
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Quick Add</p>
        <div className="flex flex-wrap gap-1.5">
          {allFoods.map((food) => (
            <button
              key={food.id}
              onClick={() => handleAdd(food.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                addedId === food.id
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700 scale-95"
                  : "bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              {food.name}
              <span className="text-slate-400 ml-1 tabular-nums">{food.calories}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
