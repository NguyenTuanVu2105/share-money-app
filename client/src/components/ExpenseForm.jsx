import { useEffect, useMemo, useState } from "react";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const INITIAL_STATE = {
  description: "",
  amount: "",
  date: todayISO(),
  payer: "personA",
};

export default function ExpenseForm({ roommates, onAdd, loading }) {
  const [form, setForm] = useState(INITIAL_STATE);
  const [error, setError] = useState(null);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      payer: prev.payer === "personA" || prev.payer === "personB" ? prev.payer : "personA",
    }));
  }, [roommates.personA, roommates.personB]);

  const previewAmount = useMemo(() => {
    if (!form.amount) return null;
    const value = Number(form.amount);
    if (!Number.isFinite(value)) return null;
    return currencyFormatter.format(value);
  }, [form.amount]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      ...INITIAL_STATE,
      date: form.date || todayISO(),
    });
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      await onAdd({
        description: form.description,
        amount: Number(form.amount),
        date: form.date,
        payer: form.payer,
      });
      resetForm();
    } catch (err) {
      setError(err.message || "Khong the them chi tieu.");
    }
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
      <h2 className="text-xl font-semibold text-slate-900">Them chi tieu</h2>
      <form className="mt-4 space-y-6" onSubmit={handleSubmit} id="expense-form">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600">
            Mo ta
            <input
              className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Vi du: Tien dien thang 3"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600">
            So tien (VND)
            <div className="space-y-1">
              <input
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                name="amount"
                type="number"
                min="0"
                step="1000"
                placeholder="0"
                value={form.amount}
                onChange={handleChange}
                required
              />
              {previewAmount && <small className="block text-xs font-medium text-slate-500">{previewAmount}</small>}
            </div>
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600">
            Ngay
            <input
              className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
            />
          </label>
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-slate-700">Ai da tra?</legend>
          <div className="flex flex-wrap gap-3">
            <label
              className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                form.payer === "personA"
                  ? "border-blue-500 bg-blue-100 text-blue-700"
                  : "border-slate-300 bg-slate-100 text-slate-600 hover:border-blue-300"
              }`}
            >
              <input
                className="hidden"
                type="radio"
                name="payer"
                value="personA"
                checked={form.payer === "personA"}
                onChange={handleChange}
              />
              <span>{roommates.personA}</span>
            </label>
            <label
              className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                form.payer === "personB"
                  ? "border-blue-500 bg-blue-100 text-blue-700"
                  : "border-slate-300 bg-slate-100 text-slate-600 hover:border-blue-300"
              }`}
            >
              <input
                className="hidden"
                type="radio"
                name="payer"
                value="personB"
                checked={form.payer === "personB"}
                onChange={handleChange}
              />
              <span>{roommates.personB}</span>
            </label>
          </div>
        </fieldset>

        {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">{error}</p>}

        <button
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          {loading ? "Dang luu..." : "Them chi tieu"}
        </button>
      </form>
    </section>
  );
}
