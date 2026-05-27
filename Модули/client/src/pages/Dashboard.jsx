import { useAuth } from '../contexts/AuthContext'
import { useConfig } from '../contexts/ConfigContext'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import ImageSlider from '../components/ImageSlider'
import QualityBlock from '../components/QualityBlock'
import ContactsBlock from '../components/ContactsBlock'
import { roomCards } from '../config/images'

export default function Dashboard() {
  const { user } = useAuth()
  const { config } = useConfig()

  return (
    <div className="space-y-6 -mt-2">
      <section className="panel overflow-hidden lg:grid lg:grid-cols-[1fr_270px] shadow-soft">
        <div className="relative">
          <div className="absolute top-4 left-4 z-20 card !p-4 max-w-xs !mb-0 shadow-soft bg-white/95 backdrop-blur-sm">
            <p className="text-xs text-banquet-red font-medium">Личный кабинет</p>
            <h1 className="!text-xl !mt-1">Привет, {user.fullName.split(' ')[0]}!</h1>
            <p className="text-secondary text-sm mt-1">{config.description}</p>
          </div>
          <ImageSlider variant="hero" />
        </div>

        <div className="flex flex-col bg-white lg:border-l border-banquet-peach">
          <ContactsBlock compact />
          <div className="flex-1 p-4 flex flex-col justify-center gap-2">
            <h3 className="text-banquet-red">Действия</h3>
            <Link to="/applications/new" className="btn-primary w-full text-center">
              {config.labels?.createButton || 'Бронирование'}
            </Link>
            <Link to="/applications" className="btn-secondary w-full text-center">
              {config.labels?.viewButton || 'Мои заявки'}
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin/dashboard" className="btn-secondary w-full text-center !border-banquet-gold">
                Админ-панель
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="space-y-6">
        {user.role === 'admin' && (
          <div className="card bg-amber-50 border-amber-200 !py-3">
            <p className="text-sm text-amber-900">Вы вошли как администратор</p>
          </div>
        )}

        <section>
          <h2 className="section-title">Помещения</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
            {roomCards.map((room) => (
              <article
                key={room.label}
                className="snap-start shrink-0 w-[180px] rounded-xl overflow-hidden border border-banquet-peach shadow-sm bg-white"
              >
                <img src={room.img} alt={room.label} className="h-32 w-full object-cover" />
                <p className="p-2.5 text-center text-sm font-medium text-banquet-red bg-white">
                  {room.label}
                </p>
              </article>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
          <QualityBlock layout="default" />
          <div className="panel p-5">
            <h3>Профиль</h3>
            <dl className="mt-4 space-y-3 text-sm border-t border-banquet-peach pt-4">
              <div className="flex justify-between gap-2">
                <dt className="text-banquet-muted uppercase text-xs">Роль</dt>
                <dd className="font-bold">{user.role === 'admin' ? 'Админ' : 'Гость'}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-banquet-muted uppercase text-xs">Email</dt>
                <dd className="text-right break-all">{user.email}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-banquet-muted uppercase text-xs">С нами с</dt>
                <dd>
                  {user.createdAt
                    ? format(new Date(user.createdAt), 'd MMM yyyy', { locale: ru })
                    : '—'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
