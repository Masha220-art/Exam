import { photos } from '../config/images'

export default function AuthLayout({ title, subtitle, children, image = photos.authDefault }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      <div className="lg:w-[45%] relative min-h-[220px] lg:min-h-screen">
        <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-banquet-ink/80 via-banquet-red/40 to-banquet-red/20" />
        <div className="relative z-10 h-full flex flex-col justify-end p-6 lg:p-10 text-white">
          <p className="text-sm text-rose-100/90">Портал бронирования</p>
          <h1 className="!text-white !text-3xl lg:!text-4xl mt-2 font-bold">{title}</h1>
          {subtitle && <p className="text-base mt-2 text-white/85 max-w-sm">{subtitle}</p>}
        </div>
      </div>

      <div className="lg:w-[55%] flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[400px]">
          <div className="card shadow-soft">{children}</div>
          <p className="text-center text-banquet-muted text-sm mt-5">Банкетам.Нет</p>
        </div>
      </div>
    </div>
  )
}
