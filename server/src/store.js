import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, "../data");
const DATA_FILE = path.join(dataDir, "store.json");

const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

const DEFAULT_STATE = Object.freeze({
  roommates: {
    personA: "Tôi",
    personB: "Bạn tôi",
  },
  expenses: [],
  settlements: {},
});

let cache = null;
let initializing = null;

function clone(value) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

async function ensureDir() {
  await mkdir(dataDir, { recursive: true });
}

async function loadFromFile() {
  await ensureDir();
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return clone(DEFAULT_STATE);
    }
    return {
      roommates: {
        personA: parsed.roommates?.personA?.trim() || DEFAULT_STATE.roommates.personA,
        personB: parsed.roommates?.personB?.trim() || DEFAULT_STATE.roommates.personB,
      },
      expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [],
      settlements: parsed.settlements && typeof parsed.settlements === "object" ? parsed.settlements : {},
    };
  } catch (error) {
    return clone(DEFAULT_STATE);
  }
}

async function saveToFile(state) {
  await ensureDir();
  await writeFile(DATA_FILE, JSON.stringify(state, null, 2), "utf8");
}

async function ensureLoaded() {
  if (cache) return cache;
  if (!initializing) {
    initializing = (async () => {
      cache = await loadFromFile();
      return cache;
    })();
  }
  return initializing;
}

export async function getState() {
  const state = await ensureLoaded();
  return clone(state);
}

export async function getSettlements() {
  const state = await ensureLoaded();
  return clone(state.settlements || {});
}

function sanitizeName(value, fallback) {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  return trimmed.slice(0, 40);
}

function sanitizeExpensePayload(payload) {
  const errors = [];
  const result = {};

  if (typeof payload.description !== "string" || !payload.description.trim()) {
    errors.push("Mô tả chi tiêu không hợp lệ.");
  } else {
    result.description = payload.description.trim().slice(0, 100);
  }

  const amount = Number(payload.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    errors.push("Số tiền phải lớn hơn 0.");
  } else {
    result.amount = Math.round(amount);
  }

  if (payload.payer !== "personA" && payload.payer !== "personB") {
    errors.push("Người thanh toán không hợp lệ.");
  } else {
    result.payer = payload.payer;
  }

  if (payload.date) {
    const isoDate = new Date(payload.date).toISOString().slice(0, 10);
    result.date = isoDate;
  } else {
    result.date = new Date().toISOString().slice(0, 10);
  }

  return { errors, expense: result };
}

export async function updateRoommates(nextNames = {}) {
  const state = await ensureLoaded();
  state.roommates = {
    personA: sanitizeName(nextNames.personA, DEFAULT_STATE.roommates.personA),
    personB: sanitizeName(nextNames.personB, DEFAULT_STATE.roommates.personB),
  };
  await saveToFile(state);
  return clone(state.roommates);
}

export async function addExpense(expense, idGenerator) {
  const state = await ensureLoaded();
  const { errors, expense: sanitized } = sanitizeExpensePayload(expense);
  if (errors.length) {
    const error = new Error(errors.join(" "));
    error.status = 400;
    throw error;
  }
  const id = typeof idGenerator === "function" ? idGenerator() : String(Date.now());
  const newExpense = {
    id,
    ...sanitized,
    createdAt: Date.now(),
  };
  state.expenses.push(newExpense);
  await saveToFile(state);
  return clone(newExpense);
}

export async function deleteExpense(id) {
  const state = await ensureLoaded();
  const before = state.expenses.length;
  state.expenses = state.expenses.filter((expense) => expense.id !== id);
  if (state.expenses.length === before) {
    const error = new Error("Không tìm thấy khoản chi tiêu.");
    error.status = 404;
    throw error;
  }
  await saveToFile(state);
  return true;
}

export async function clearExpenses() {
  const state = await ensureLoaded();
  state.expenses = [];
  await saveToFile(state);
  return true;
}

export function validateMonthKey(month) {
  return MONTH_PATTERN.test(month);
}

export async function setSettlementStatus(month, settled) {
  if (!validateMonthKey(month)) {
    const error = new Error("Tháng không hợp lệ. Định dạng đúng: YYYY-MM.");
    error.status = 400;
    throw error;
  }

  const state = await ensureLoaded();
  if (!state.settlements || typeof state.settlements !== "object") {
    state.settlements = {};
  }

  let result;
  if (settled) {
    const record = {
      settled: true,
      settledAt: Date.now(),
    };
    state.settlements[month] = record;
    result = clone(record);
  } else {
    delete state.settlements[month];
    result = { settled: false };
  }

  await saveToFile(state);
  return result;
}
