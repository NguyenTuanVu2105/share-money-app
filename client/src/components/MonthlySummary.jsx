const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

function formatCurrency(value) {
  return currencyFormatter.format(Math.round(value || 0));
}

function formatMonthLabel(month) {
  if (typeof month !== "string" || month.length !== 7) return month;
  const [year, rawMonth] = month.split("-");
  return `${rawMonth}/${year}`;
}

function formatDateLabel(timestamp) {
  if (!timestamp) return "";
  const date = new Date(Number(timestamp));
  if (Number.isNaN(date.getTime())) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function MonthlySummary({ roommates, data, onToggleSettlement, loading }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Thong ke theo thang</h2>
      </div>

      {!data.length ? (
        <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-600">
          Chua co du lieu chi tieu nao theo thang.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Thang</th>
                <th className="px-4 py-3 text-right">Chi {roommates.personA}</th>
                <th className="px-4 py-3 text-right">Chi {roommates.personB}</th>
                <th className="px-4 py-3 text-right">Moi nguoi</th>
                <th className="px-4 py-3">Trang thai</th>
                <th className="px-4 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {data.map((item) => {
                const { month, totals, settlement } = item;
                const isSettled = settlement?.settled;
                const settledDate = formatDateLabel(settlement?.settledAt);
                return (
                  <tr key={month} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-700">{formatMonthLabel(month)}</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-600">
                      {formatCurrency(totals.personA)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-600">
                      {formatCurrency(totals.personB)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">
                      {formatCurrency(totals.share)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-600">
                      {isSettled ? `Da thanh toan${settledDate ? ` (${settledDate})` : ""}` : "Chua thanh toan"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        className="inline-flex items-center justify-center rounded-full border border-blue-500 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
                        type="button"
                        onClick={() => onToggleSettlement(month, !isSettled)}
                        disabled={loading}
                      >
                        {isSettled ? "Danh dau chua tra" : "Danh dau da tra"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
