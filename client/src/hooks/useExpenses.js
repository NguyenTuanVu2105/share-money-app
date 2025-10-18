import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchRoommates,
  saveRoommates,
  fetchExpenses,
  createExpense,
  removeExpense,
  removeAllExpenses,
  fetchMonthlySummary,
  updateSettlement,
} from "../services/api.js";

const DEFAULT_NAMES = {
  personA: "Toi",
  personB: "Ban toi",
};

export function useExpenses() {
  const [roommates, setRoommates] = useState(DEFAULT_NAMES);
  const [expenses, setExpenses] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingRoommates, setSavingRoommates] = useState(false);
  const [savingExpense, setSavingExpense] = useState(false);
  const [settlementLoading, setSettlementLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [names, items, monthly] = await Promise.all([
        fetchRoommates(),
        fetchExpenses(),
        fetchMonthlySummary(),
      ]);
      setRoommates(names);
      setExpenses(items);
      setMonthlySummary(monthly);
    } catch (err) {
      console.error(err);
      setError(err.message || "Khong the tai du lieu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const refreshMonthly = useCallback(async () => {
    try {
      const monthly = await fetchMonthlySummary();
      setMonthlySummary(monthly);
    } catch (err) {
      console.error(err);
      setError(err.message || "Khong the tai thong ke theo thang.");
      throw err;
    }
  }, []);

  const totals = useMemo(() => {
    const totalA = expenses.filter((item) => item.payer === "personA").reduce((sum, item) => sum + item.amount, 0);
    const totalB = expenses.filter((item) => item.payer === "personB").reduce((sum, item) => sum + item.amount, 0);
    const total = totalA + totalB;
    const share = total / 2;
    const balanceA = totalA - share;
    const balanceB = totalB - share;
    return {
      totalA,
      totalB,
      total,
      share,
      balanceA,
      balanceB,
    };
  }, [expenses]);

  const updateRoommates = useCallback(
    async (names) => {
      setSavingRoommates(true);
      setError(null);
      try {
        const updated = await saveRoommates(names);
        setRoommates(updated);
      } catch (err) {
        console.error(err);
        setError(err.message || "Khong the luu thong tin thanh vien.");
        throw err;
      } finally {
        setSavingRoommates(false);
      }
    },
    [],
  );

  const addExpense = useCallback(async (expense) => {
    setSavingExpense(true);
    setError(null);
    try {
      const created = await createExpense(expense);
      setExpenses((prev) => [created, ...prev]);
      await refreshMonthly();
      return created;
    } catch (err) {
      console.error(err);
      setError(err.message || "Khong the them chi tieu.");
      throw err;
    } finally {
      setSavingExpense(false);
    }
  }, [refreshMonthly]);

  const deleteExpense = useCallback(
    async (id) => {
      setError(null);
      try {
        await removeExpense(id);
        setExpenses((prev) => prev.filter((item) => item.id !== id));
        await refreshMonthly();
      } catch (err) {
        console.error(err);
        setError(err.message || "Khong the xoa chi tieu.");
        throw err;
      }
    },
    [refreshMonthly],
  );

  const clearExpenses = useCallback(async () => {
    setError(null);
    try {
      await removeAllExpenses();
      setExpenses([]);
      await refreshMonthly();
    } catch (err) {
      console.error(err);
      setError(err.message || "Khong the xoa toan bo chi tieu.");
      throw err;
    }
  }, [refreshMonthly]);

  const setSettlement = useCallback(async (month, settled) => {
    setSettlementLoading(true);
    setError(null);
    try {
      const record = await updateSettlement(month, settled);
      setMonthlySummary((prev) => {
        let updated = false;
        const next = prev.map((item) => {
          if (item.month !== month) {
            return item;
          }
          updated = true;
          return {
            ...item,
            settlement: {
              settled: record.settled,
              settledAt: record.settledAt,
            },
          };
        });
        return updated ? next : prev;
      });
      return record;
    } catch (err) {
      console.error(err);
      setError(err.message || "Khong the cap nhat trang thai thanh toan.");
      throw err;
    } finally {
      setSettlementLoading(false);
    }
  }, []);

  return {
    roommates,
    expenses,
    monthlySummary,
    totals,
    loading,
    error,
    savingRoommates,
    savingExpense,
    settlementLoading,
    refresh,
    updateRoommates,
    addExpense,
    deleteExpense,
    clearExpenses,
    setSettlement,
  };
}
