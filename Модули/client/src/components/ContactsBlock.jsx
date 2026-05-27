export default function ContactsBlock({ compact = false }) {
  if (compact) {
    return (
      <div className="p-4 bg-banquet-red text-white rounded-xl m-3 shadow-sm">
        <p className="text-xs text-rose-100/90">Контакты</p>
        <p className="text-sm mt-2 opacity-95">Москва, ул. Большая Ордынка, 15</p>
        <a href="tel:+74951234567" className="inline-block mt-2 text-banquet-gold font-semibold text-lg hover:underline">
          +7 (495) 123-45-67
        </a>
      </div>
    )
  }

  return (
    <section className="card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="section-title !border-0 !pb-0 !mb-1">Контакты</h2>
        <p className="text-sm text-banquet-muted">г. Москва, ул. Большая Ордынка, д. 15</p>
      </div>
      <a href="tel:+74951234567" className="btn-primary shrink-0">
        Позвонить
      </a>
    </section>
  )
}
