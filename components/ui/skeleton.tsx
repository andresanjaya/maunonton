export function JournalCardSkeleton() {
  return <div className="card p-4" aria-label="Memuat jurnal" aria-busy="true"><div className="flex items-center gap-3"><div className="skeleton size-10 rounded-full"/><div className="flex-1 space-y-2"><div className="skeleton h-3 w-28 rounded"/><div className="skeleton h-2.5 w-20 rounded"/></div></div><div className="skeleton mt-4 aspect-[4/3] rounded-2xl"/><div className="mt-4 space-y-2"><div className="skeleton h-4 w-2/3 rounded"/><div className="skeleton h-3 w-full rounded"/><div className="skeleton h-3 w-4/5 rounded"/></div></div>;
}
