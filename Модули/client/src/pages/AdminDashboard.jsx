import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useConfig } from '../contexts/ConfigContext'
import { applicationService } from '../services/applications'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const { config } = useConfig()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await applicationService.getStats()
      setStats(data)
    } catch {
      toast.error('Ошибка при загрузке статистики')
    }
    setLoading(false)
  }

  if (loading) {
    return <p className="panel p-8">Загрузка...</p>
  }

  const statCards = [
    { name: 'Всего', value: stats?.totalApplications || 0 },
    { name: 'Новые', value: stats?.newApplications || 0 },
    { name: 'Назначено', value: stats?.assignedApplications || 0 },
    { name: 'Готово', value: stats?.completedApplications || 0 },
    { name: 'Юзеры', value: stats?.totalUsers || 0 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs text-banquet-muted">Администрирование</p>
          <h1 className="!mt-1">Сводка</h1>
        </div>
        <Link to="/admin/applications" className="btn-primary">
          Перейти к заявкам →
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {statCards.map((stat) => (
          <div key={stat.name} className="stat-pill">
            <p className="text-3xl font-bold text-banquet-red">{stat.value}</p>
            <p className="text-xs text-banquet-muted mt-2">{stat.name}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3>Возможности</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-banquet-gold">▸</span> Фильтры и поиск</li>
            <li className="flex gap-2"><span className="text-banquet-gold">▸</span> Сортировка и страницы</li>
            <li className="flex gap-2"><span className="text-banquet-gold">▸</span> Смена статуса в модалке</li>
          </ul>
        </div>
        <div className="card bg-banquet-red text-white border-0">
          <h3 className="!text-white">О проекте</h3>
          <p className="text-sm mt-3 text-rose-50/90">{config.description}</p>
          <p className="text-sm mt-3 text-rose-100/80">{config.title}</p>
        </div>
      </div>
    </div>
  )
}
