import { useEffect, useState } from "react";

export default function RoommateForm({ roommates, onSave, loading }) {
  const [personA, setPersonA] = useState(roommates.personA);
  const [personB, setPersonB] = useState(roommates.personB);

  useEffect(() => {
    setPersonA(roommates.personA);
    setPersonB(roommates.personB);
  }, [roommates.personA, roommates.personB]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSave({ personA, personB });
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
      <h2 className="text-xl font-semibold text-slate-900">Thong tin thanh vien</h2>
      <form className="mt-4 grid gap-4 md:grid-cols-[repeat(3,minmax(0,1fr))]" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600 md:col-span-1">
          Ten ban
          <input
            className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            value={personA}
            onChange={(event) => setPersonA(event.target.value)}
            maxLength={40}
            required
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600 md:col-span-1">
          Ten ban cung phong
          <input
            className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            value={personB}
            onChange={(event) => setPersonB(event.target.value)}
            maxLength={40}
            required
          />
        </label>
        <div className="md:col-span-1 md:flex md:items-end">
          <button
            className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
            type="submit"
            disabled={loading}
          >
            {loading ? "Dang luu..." : "Luu"}
          </button>
        </div>
      </form>
    </section>
  );
}
