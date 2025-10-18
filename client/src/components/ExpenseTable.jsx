import { useMemo, useState } from "react";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export default function ExpenseTable({ expenses, roommates, onDelete, onClear }) {
  const [clearing, setClearing] = useState(false);

  const sortedExpenses = useMemo(() => {
    return expenses.slice().sort((a, b) => {
      const dateDiff = (b.date || "").localeCompare(a.date || "");
      if (dateDiff !== 0) return dateDiff;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
  }, [expenses]);

  const handleClearClick = async () => {
    if (!expenses.length) return;
    const confirmed = window.confirm("Ban co chac muon xoa toan bo chi tieu?");
    if (!confirmed) return;
    try {
      setClearing(true);
      await onClear();
    } finally {
      setClearing(false);
    }
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">Danh sach chi tieu</h2>
        <button
          className="inline-flex items-center justify-center rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          disabled={!expenses.length || clearing}
          onClick={handleClearClick}
        >
          {clearing ? "Dang xoa..." : "Xoa tat ca"}
        </button>
      </div>

      {!sortedExpenses.length ? (
        <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-600">
          Chua co chi tieu nao. Hay them chi tieu dau tien!
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Ngay</th>
                <th className="px-4 py-3">Mo ta</th>
                <th className="px-4 py-3">Nguoi tra</th>
                <th className="px-4 py-3 text-right">So tien</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {sortedExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-600">{expense.date || "-"}</td>
                  <td className="px-4 py-3 text-slate-700">{expense.description}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {expense.payer === "personA" ? roommates.personA : roommates.personB}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-800">
                    {currencyFormatter.format(expense.amount)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      className="text-sm font-semibold text-rose-500 transition hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-200"
                      type="button"
                      onClick={() => onDelete(expense.id)}
                    >
                      Xoa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
