import { validateMonthKey } from "./store.js";

function formatMonth(dateString, createdAt) {
  if (typeof dateString === "string") {
    const month = dateString.slice(0, 7);
    if (validateMonthKey(month)) {
      return month;
    }
  }

  const created = Number(createdAt);
  if (Number.isFinite(created)) {
    const date = new Date(created);
    if (!Number.isNaN(date.getTime())) {
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (validateMonthKey(month)) {
        return month;
      }
    }
  }

  return null;
}

export function buildMonthlySummary(expenses = [], roommates, settlements = {}) {
  const months = new Map();

  expenses.forEach((expense) => {
    const month = formatMonth(expense.date, expense.createdAt);
    if (!month) return;
    if (!months.has(month)) {
      months.set(month, {
        month,
        totals: {
          personA: 0,
          personB: 0,
        },
        expenses: [],
      });
    }
    const bucket = months.get(month);
    const amount = Number(expense.amount) || 0;
    if (expense.payer === "personA") {
      bucket.totals.personA += amount;
    } else {
      bucket.totals.personB += amount;
    }
    bucket.expenses.push(expense);
  });

  const result = Array.from(months.values())
    .map((bucket) => {
      const totalA = bucket.totals.personA;
      const totalB = bucket.totals.personB;
      const total = totalA + totalB;
      const share = total / 2;
      const balanceA = totalA - share;
      const balanceB = totalB - share;
      const settlementInfo = settlements[bucket.month] || null;
      return {
        month: bucket.month,
        totals: {
          personA: totalA,
          personB: totalB,
          total,
          share,
          balanceA,
          balanceB,
        },
        settlement: settlementInfo
          ? {
              settled: Boolean(settlementInfo.settled),
              settledAt: settlementInfo.settledAt || null,
            }
          : {
              settled: false,
              settledAt: null,
            },
      };
    })
    .sort((a, b) => b.month.localeCompare(a.month));

  return result;
}
