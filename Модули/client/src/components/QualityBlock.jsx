import { quality } from '../config/images'

export default function QualityBlock() {
  return (
    <section className="panel">
      <div className="grid lg:grid-cols-[1fr_220px]">
        <div className="p-5 lg:p-6">
          <h2 className="section-title">Качество сервиса</h2>
          <p className="text-secondary mb-4">
            Каждый банкет — продуманное меню, аккуратная сервировка и команда, которая заботится о гостях.
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {quality.badges.map((item) => (
              <div key={item.title} className="quality-badge">
                <span className="quality-badge-icon">{item.icon}</span>
                <div>
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-banquet-muted mt-0.5 leading-snug">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <img
          src={quality.banner}
          alt="Качество обслуживания"
          className="w-full h-48 lg:h-full min-h-[180px] object-cover lg:rounded-r-xl"
        />
      </div>
    </section>
  )
}
