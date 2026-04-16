import { createClient } from "@libsql/client";
import { FOODS, type Food } from "@/db/foods";

export interface LogEntry {
  id: number;
  foodId: number;
  servings: number;
  meal: string;
  loggedAt: string;
  createdAt: string;
}

// NO top-level code — everything inside functions only
function getDB() {
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    throw new Error("Missing Turso environment variables");
  }
  return createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
}

async function initDB() {
  const db = getDB();
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS log_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      foodId INTEGER NOT NULL,
      servings REAL NOT NULL,
      meal TEXT NOT NULL DEFAULT 'snack',
      loggedAt TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS custom_foods (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      calories REAL NOT NULL,
      protein REAL NOT NULL,
      carbs REAL NOT NULL,
      fat REAL NOT NULL,
      servingSize TEXT NOT NULL
    );
  `);
  return db;
}

export async function getLogByDate(date: string): Promise<LogEntry[]> {
  const db = await initDB();
  const result = await db.execute({
    sql: "SELECT * FROM log_entries WHERE loggedAt = ?",
    args: [date],
  });
  return result.rows.map((r) => ({
    id: r.id as number,
    foodId: r.foodId as number,
    servings: r.servings as number,
    meal: r.meal as string,
    loggedAt: r.loggedAt as string,
    createdAt: r.createdAt as string,
  }));
}

export async function addLogEntry(
  foodId: number,
  servings: number,
  date: string,
  meal: string = "snack"
): Promise<LogEntry> {
  const db = await initDB();
  const createdAt = new Date().toISOString();
  const result = await db.execute({
    sql: "INSERT INTO log_entries (foodId, servings, meal, loggedAt, createdAt) VALUES (?, ?, ?, ?, ?)",
    args: [foodId, servings, meal, date, createdAt],
  });
  return {
    id: Number(result.lastInsertRowid),
    foodId,
    servings,
    meal,
    loggedAt: date,
    createdAt,
  };
}

export async function deleteLogEntry(id: number): Promise<boolean> {
  const db = await initDB();
  const result = await db.execute({
    sql: "DELETE FROM log_entries WHERE id = ?",
    args: [id],
  });
  return (result.rowsAffected ?? 0) > 0;
}

export async function addCustomFood(food: Omit<Food, "id">): Promise<Food> {
  const db = await initDB();
  const result = await db.execute({
    sql: "INSERT INTO custom_foods (name, calories, protein, carbs, fat, servingSize) VALUES (?, ?, ?, ?, ?, ?)",
    args: [food.name, food.calories, food.protein, food.carbs, food.fat, food.servingSize],
  });
  return { ...food, id: Number(result.lastInsertRowid) };
}

export async function findFoodById(id: number): Promise<Food | undefined> {
  const hardcoded = FOODS.find((f) => f.id === id);
  if (hardcoded) return hardcoded;
  const db = await initDB();
  const result = await db.execute({
    sql: "SELECT * FROM custom_foods WHERE id = ?",
    args: [id],
  });
  if (result.rows.length === 0) return undefined;
  const r = result.rows[0];
  return {
    id: r.id as number,
    name: r.name as string,
    calories: r.calories as number,
    protein: r.protein as number,
    carbs: r.carbs as number,
    fat: r.fat as number,
    servingSize: r.servingSize as string,
  };
}