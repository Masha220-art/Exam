import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useConfig } from '../contexts/ConfigContext'
import PageLogo from './PageLogo'
import clsx from 'clsx'

export default function Layout() {
  const { user, logout } = useAuth()
  const { config } = useConfig()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname.startsWith(path)

  const userLinks =
    user.role === 'admin'
      ? [
          { to: '/admin/dashboard', label: 'Сводка' },
          { to: '/admin/applications', label: 'Заявки' },
        ]
      : [
          { to: '/dashboard', label: 'Главная' },
          { to: '/applications', label: config.labels?.viewButton || 'Мои заявки' },
          { to: '/applications/new', label: 'Бронь' },
        ]

  const pageTitle =
    userLinks.find((l) => isActive(l.to))?.label || config.title

  return (
    <div className="min-h-screen flex bg-white">
      <aside className="hidden lg:flex w-[230px] shrink-0 flex-col bg-banquet-ink text-white min-h-screen sticky top-0 h-screen shadow-soft">
        <div className="p-5 border-b border-white/10">
          <PageLogo className="h-12 w-12 rounded-lg mb-3 ring-2 ring-white/20" />
          <p className="font-semibold text-base leading-tight">{config.title}</p>
          <p className="text-xs text-slate-400 mt-1">Бронирование залов</p>
        </div>

        <nav className="flex-1 py-3">
          {userLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={clsx(isActive(to) ? 'sidebar-link-active' : 'sidebar-link')}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <p className="text-sm text-slate-200 truncate">{user.fullName}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 w-full text-sm text-slate-300 hover:text-white underline text-left"
          >
            Выйти
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden bg-banquet-ink text-white px-4 py-3 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">{config.title}</span>
            <button type="button" onClick={handleLogout} className="text-sm text-rose-200">
              Выйти
            </button>
          </div>
          <nav className="flex gap-2 overflow-x-auto">
            {userLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={clsx(
                  'shrink-0 px-3 py-1.5 rounded-full text-sm',
                  isActive(to) ? 'bg-banquet-red text-white' : 'bg-white/10'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </header>

        <div className="page-strip mx-4 sm:mx-6 lg:mx-8 mt-4 lg:mt-6 !mb-0">
          <p className="text-sm text-rose-100/90">Сейчас открыто</p>
          <p className="text-xl font-semibold mt-0.5">{pageTitle}</p>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:px-8 lg:pb-8 pt-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
