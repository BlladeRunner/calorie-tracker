import fs from "fs";
import path from "path";
import { FOODS, type Food } from "@/db/foods";

export interface LogEntry {
  id: number;
  foodId: number;
  servings: number;
  meal: string; // breakfast | lunch | dinner | snack
  loggedAt: string; // YYYY-MM-DD
  createdAt: string; // ISO timestamp
}

interface StoreData {
  log: LogEntry[];
  nextId: number;
  customFoods: Food[];
  nextCustomFoodId: number;
}

const DATA_PATH = path.join(process.cwd(), "data", "food-log.json");

function ensureDataDir() {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readStore(): StoreData {
  ensureDataDir();
  if (!fs.existsSync(DATA_PATH)) {
    return { log: [], nextId: 1, customFoods: [], nextCustomFoodId: 10001 };
  }
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  const data = JSON.parse(raw);
  // Backward compat: default new fields if missing
  if (!data.customFoods) data.customFoods = [];
  if (!data.nextCustomFoodId) data.nextCustomFoodId = 10001;
  return data;
}

function writeStore(data: StoreData) {
  ensureDataDir();
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

export function getLogByDate(date: string): LogEntry[] {
  const store = readStore();
  return store.log.filter((entry) => entry.loggedAt === date);
}

export function addLogEntry(foodId: number, servings: number, date: string, meal: string = "snack"): LogEntry {
  const store = readStore();
  const entry: LogEntry = {
    id: store.nextId,
    foodId,
    servings,
    meal,
    loggedAt: date,
    createdAt: new Date().toISOString(),
  };
  store.log.push(entry);
  store.nextId++;
  writeStore(store);
  return entry;
}

export function deleteLogEntry(id: number): boolean {
  const store = readStore();
  const idx = store.log.findIndex((entry) => entry.id === id);
  if (idx === -1) return false;
  store.log.splice(idx, 1);
  writeStore(store);
  return true;
}

export function addCustomFood(food: Omit<Food, "id">): Food {
  const store = readStore();
  const newFood: Food = { ...food, id: store.nextCustomFoodId };
  store.customFoods.push(newFood);
  store.nextCustomFoodId++;
  writeStore(store);
  return newFood;
}

export function findFoodById(id: number): Food | undefined {
  const hardcoded = FOODS.find((f) => f.id === id);
  if (hardcoded) return hardcoded;
  const store = readStore();
  return store.customFoods.find((f) => f.id === id);
}
