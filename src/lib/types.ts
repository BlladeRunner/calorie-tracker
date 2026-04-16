import type { Food } from "@/db/foods";
import type { LogEntry } from "@/db/store";

export type Meal = "breakfast" | "lunch" | "dinner" | "snack";

export const MEALS: { value: Meal; label: string; icon: string }[] = [
  { value: "breakfast", label: "Breakfast", icon: "\u2615" },
  { value: "lunch", label: "Lunch", icon: "\ud83c\udf5c" },
  { value: "dinner", label: "Dinner", icon: "\ud83c\udf7d\ufe0f" },
  { value: "snack", label: "Snack", icon: "\ud83c\udf4e" },
];

export interface LogEntryWithFood extends LogEntry {
  food: Food;
}
