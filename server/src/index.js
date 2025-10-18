import express from "express";
import cors from "cors";
import morgan from "morgan";
import { nanoid } from "nanoid";
import { getState, updateRoommates, addExpense, deleteExpense, clearExpenses, setSettlementStatus } from "./store.js";
import { buildMonthlySummary } from "./summary.js";

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_ORIGIN,
  }),
);
app.use(express.json({ limit: "100kb" }));
app.use(morgan("dev"));

function asyncRoute(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

app.get(
  "/api/status",
  asyncRoute(async (_req, res) => {
    res.json({ status: "ok", message: "ShareMoney API sẵn sàng." });
  }),
);

app.get(
  "/api/roommates",
  asyncRoute(async (_req, res) => {
    const state = await getState();
    res.json(state.roommates);
  }),
);

app.put(
  "/api/roommates",
  asyncRoute(async (req, res) => {
    const updated = await updateRoommates(req.body || {});
    res.json(updated);
  }),
);

app.get(
  "/api/expenses",
  asyncRoute(async (_req, res) => {
    const state = await getState();
    const sorted = state.expenses
      .slice()
      .sort((a, b) => {
        const dateDiff = (b.date || "").localeCompare(a.date || "");
        if (dateDiff !== 0) return dateDiff;
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
    res.json(sorted);
  }),
);

app.post(
  "/api/expenses",
  asyncRoute(async (req, res) => {
    const created = await addExpense(req.body || {}, () => nanoid(10));
    res.status(201).json(created);
  }),
);

app.get(
  "/api/summary/monthly",
  asyncRoute(async (_req, res) => {
    const state = await getState();
    const summary = buildMonthlySummary(state.expenses, state.roommates, state.settlements);
    res.json(summary);
  }),
);

app.put(
  "/api/settlements/:month",
  asyncRoute(async (req, res) => {
    const { month } = req.params;
    const { settled = true } = req.body || {};
    const record = await setSettlementStatus(month, Boolean(settled));
    res.json({
      month,
      settled: Boolean(record.settled),
      settledAt: record.settledAt || null,
    });
  }),
);

app.delete(
  "/api/expenses/:id",
  asyncRoute(async (req, res) => {
    await deleteExpense(req.params.id);
    res.status(204).send();
  }),
);

app.delete(
  "/api/expenses",
  asyncRoute(async (_req, res) => {
    await clearExpenses();
    res.status(204).send();
  }),
);

app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    res.status(404).json({ error: "Không tìm thấy API này." });
  } else {
    next();
  }
});

// eslint-disable-next-line no-unused-vars
app.use((error, _req, res, _next) => {
  console.error(error);
  const status = error.status || 500;
  res.status(status).json({
    error: error.message || "Đã có lỗi xảy ra.",
  });
});

app.listen(PORT, () => {
  console.log(`ShareMoney server đang chạy tại http://localhost:${PORT}`);
});
