
export interface InfoItem {
  label: string
  value: string
}

export default function InfoBlocks({ items }: { items: InfoItem[] }) {
  return (
    <section aria-label="Snapshot" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5">
      {items.map((it) => (
        <article
          key={it.label}
          className="rounded-xl border border-white/5 bg-gradient-jet p-4 sm:p-5 transition-all duration-200 hover:border-orange-yellow/30 hover:-translate-y-0.5"
        >
          <h3 className="card-title">{it.label}</h3>
          <p className="body-small text-white-1/90 break-words hyphens-auto">
            {it.value}
          </p>
        </article>
      ))}
    </section>
  )
}

