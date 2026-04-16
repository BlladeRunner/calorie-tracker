"use client";

import { useState, useRef } from "react";
import type { AIFood } from "@/lib/gemini";
import type { Meal } from "@/lib/types";

interface Props {
  onFoodLogged: () => void;
  meal: Meal;
}

export default function AIFoodLookup({ onFoodLogged, meal }: Props) {
  const [mode, setMode] = useState<"text" | "image">("text");
  const [textInput, setTextInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [results, setResults] = useState<AIFood[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingIndex, setAddingIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError(null);
    setResults([]);
  }

  function clearImage() {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function switchMode(newMode: "text" | "image") {
    setMode(newMode);
    setResults([]);
    setError(null);
  }

  async function analyzeText() {
    if (!textInput.trim()) return;
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const res = await fetch("/api/ai/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: textInput.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to analyze food");
      }
      const data = await res.json();
      setResults(data.foods);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function analyzeImage() {
    if (!imageFile) return;
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      const res = await fetch("/api/ai/image", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to analyze image");
      }
      const data = await res.json();
      setResults(data.foods);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function addFood(food: AIFood, index: number) {
    setAddingIndex(index);
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await fetch("/api/ai/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ food, servings: 1, date: today, meal }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add food");
      }
      onFoodLogged();
      setTimeout(() => {
        setResults((prev) => prev.filter((_, i) => i !== index));
        setAddingIndex(null);
      }, 600);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add food");
      setAddingIndex(null);
    }
  }

  function addAll() {
    results.forEach((food, i) => addFood(food, i));
  }

  function handleTextKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      analyzeText();
    }
  }

  return (
    <div className="space-y-3">
      {/* Mode tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
        <button
          onClick={() => switchMode("text")}
          className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${
            mode === "text"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <span className="flex items-center justify-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Describe Food
          </span>
        </button>
        <button
          onClick={() => switchMode("image")}
          className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${
            mode === "image"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <span className="flex items-center justify-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Upload Photo
          </span>
        </button>
      </div>

      {/* Text input */}
      {mode === "text" && (
        <div className="flex gap-2">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={handleTextKeyDown}
            placeholder="What did you eat? e.g. grilled chicken with rice and salad"
            rows={1}
            maxLength={500}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none text-sm transition-shadow"
          />
          <button
            onClick={analyzeText}
            disabled={loading || !textInput.trim()}
            className="px-4 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            {loading && mode === "text" ? <Spinner /> : "Go"}
          </button>
        </div>
      )}

      {/* Image upload */}
      {mode === "image" && (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic"
            onChange={handleImageSelect}
            className="hidden"
          />

          {!imageFile ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-6 rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-400 bg-slate-50/50 hover:bg-emerald-50/50 transition-all flex flex-col items-center gap-1.5 text-slate-400 hover:text-emerald-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs font-medium">Take or upload a photo</span>
              <span className="text-[10px] text-slate-400">JPEG, PNG, WebP, or HEIC up to 5MB</span>
            </button>
          ) : (
            <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Meal preview"
                  className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-700 truncate">{imageFile.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {(imageFile.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
              <button
                onClick={clearImage}
                className="text-slate-300 hover:text-red-500 transition-colors p-1 flex-shrink-0"
                title="Remove image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}

          {imageFile && (
            <button
              onClick={analyzeImage}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner />
                  Analyzing...
                </span>
              ) : (
                "Analyze Photo"
              )}
            </button>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2 px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading && results.length === 0 && (
        <div className="flex items-center justify-center gap-2 py-6 text-slate-400">
          <Spinner />
          <span className="text-xs">Analyzing your food with AI...</span>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-medium text-slate-500">
              Found {results.length} {results.length === 1 ? "item" : "items"}
            </p>
            {results.length > 1 && (
              <button
                onClick={addAll}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Add all
              </button>
            )}
          </div>
          <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden divide-y divide-slate-100">
            {results.map((food, i) => (
              <div
                key={`${food.name}-${i}`}
                className={`flex items-center justify-between px-4 py-2.5 transition-all ${
                  addingIndex === i ? "bg-emerald-50" : "hover:bg-slate-50/50"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-slate-800 truncate">{food.name}</span>
                    <span className="text-[10px] text-slate-400">{food.servingSize}</span>
                  </div>
                  <div className="flex gap-3 text-[10px] text-slate-400 mt-0.5">
                    <span className="text-blue-400">{food.protein}g P</span>
                    <span className="text-amber-400">{food.carbs}g C</span>
                    <span className="text-rose-400">{food.fat}g F</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <span className="text-xs font-semibold text-slate-600 tabular-nums whitespace-nowrap">
                    {food.calories} kcal
                  </span>
                  <button
                    onClick={() => addFood(food, i)}
                    disabled={addingIndex === i}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium transition-all flex-shrink-0 ${
                      addingIndex === i
                        ? "bg-emerald-500 text-white"
                        : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                    }`}
                  >
                    {addingIndex === i ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
