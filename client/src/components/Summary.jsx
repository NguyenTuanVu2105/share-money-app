const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

function formatCurrency(value) {
  return currencyFormatter.format(Math.round(value || 0));
}

export default function Summary({ roommates, totals }) {
  const { totalA, totalB, total, share, balanceA, balanceB } = totals;

  let settlementMessage = "Chua co khoan chi tieu nao.";
  let settlementClass = "rounded-xl border px-4 py-4 text-sm font-semibold";

  if (total > 0) {
    if (Math.abs(balanceA) < 1000 && Math.abs(balanceB) < 1000) {
      settlementMessage = "Hai ban da can bang chi tieu. Khong ai no ai!";
      settlementClass += " border-emerald-200 bg-emerald-50 text-emerald-700";
    } else if (balanceA > 0) {
      settlementMessage = `${roommates.personB} can chuyen ${formatCurrency(Math.abs(balanceA))} cho ${roommates.personA}.`;
      settlementClass += " border-rose-200 bg-rose-50 text-rose-600";
    } else if (balanceB > 0) {
      settlementMessage = `${roommates.personA} can chuyen ${formatCurrency(Math.abs(balanceB))} cho ${roommates.personB}.`;
      settlementClass += " border-emerald-200 bg-emerald-50 text-emerald-700";
    }
  } else {
    settlementClass += " border-slate-200 bg-slate-50 text-slate-600";
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
      <h2 className="text-xl font-semibold text-slate-900">Tong quan</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-slate-700">
          <span>Tong {roommates.personA} da tra</span>
          <span className="text-base font-bold text-indigo-700">{formatCurrency(totalA)}</span>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-slate-700">
          <span>Tong {roommates.personB} da tra</span>
          <span className="text-base font-bold text-indigo-700">{formatCurrency(totalB)}</span>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-slate-700">
          <span>Tong chi tieu</span>
          <span className="text-base font-bold text-indigo-700">{formatCurrency(total)}</span>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-slate-700">
          <span>Moi nguoi can gop</span>
          <span className="text-base font-bold text-indigo-700">{formatCurrency(share)}</span>
        </div>
      </div>
      <div className={`mt-4 ${settlementClass}`}>{settlementMessage}</div>
    </section>
  );
}
