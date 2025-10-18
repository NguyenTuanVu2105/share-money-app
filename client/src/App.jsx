import RoommateForm from "./components/RoommateForm.jsx";
import ExpenseForm from "./components/ExpenseForm.jsx";
import Summary from "./components/Summary.jsx";
import ExpenseTable from "./components/ExpenseTable.jsx";
import MonthlySummary from "./components/MonthlySummary.jsx";
import { useExpenses } from "./hooks/useExpenses.js";

export default function App() {
  const {
    roommates,
    expenses,
    monthlySummary,
    totals,
    loading,
    error,
    savingRoommates,
    savingExpense,
    settlementLoading,
    updateRoommates,
    addExpense,
    deleteExpense,
    clearExpenses,
    setSettlement,
  } = useExpenses();

  const handleDeleteExpense = async (id) => {
    const confirmed = window.confirm("Ban co chac muon xoa khoan chi tieu nay?");
    if (!confirmed) return;
    await deleteExpense(id);
  };

  const handleToggleSettlement = async (month, nextState) => {
    await setSettlement(month, nextState);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-sky-400 pb-24 pt-20 text-white shadow-lg">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-3 px-4 text-center">
          <h1 className="text-3xl font-semibold sm:text-4xl">Chia tien phong tro</h1>
          <p className="max-w-2xl text-base text-blue-50 sm:text-lg">Ghi lai chi tieu va xem ngay ai dang no ai.</p>
        </div>
      </header>

      {error && (
        <div className="mx-auto mt-6 w-full max-w-3xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="mt-10 text-center text-base font-semibold text-slate-500">Dang tai du lieu...</p>
      ) : (
        <main className="z-10 mx-auto -mt-16 w-full max-w-5xl px-4 pb-16">
          <div className="flex flex-col gap-6">
            <RoommateForm roommates={roommates} onSave={updateRoommates} loading={savingRoommates} />
            <ExpenseForm roommates={roommates} onAdd={addExpense} loading={savingExpense} />
            <Summary roommates={roommates} totals={totals} />
            <MonthlySummary
              roommates={roommates}
              data={monthlySummary}
              onToggleSettlement={handleToggleSettlement}
              loading={settlementLoading}
            />
            <ExpenseTable
              expenses={expenses}
              roommates={roommates}
              onDelete={handleDeleteExpense}
              onClear={clearExpenses}
            />
          </div>
        </main>
      )}

      <footer className="mt-auto bg-transparent py-6 text-center text-sm text-slate-500">
        <small>Du lieu duoc luu tren may chu Node.js cua ban.</small>
      </footer>
    </div>
  );
}
