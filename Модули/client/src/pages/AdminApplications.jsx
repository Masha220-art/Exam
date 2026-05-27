import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useConfig } from '../contexts/ConfigContext'
import { applicationService } from '../services/applications'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import { getFieldLabel, formatFieldValue, getStatusBadgeClass } from '../utils/applicationDisplay'

export default function AdminApplications() {
  const { config } = useConfig()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('DESC')
  const [selectedApp, setSelectedApp] = useState(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [adminComment, setAdminComment] = useState('')

  useEffect(() => {
    loadApplications()
  }, [page, statusFilter, searchQuery, sortBy, sortOrder])

  const loadApplications = async () => {
    setLoading(true)
    try {
      const params = {
        page,
        limit: 10,
        sortBy,
        sortOrder,
        ...(statusFilter && { status: statusFilter }),
        ...(searchQuery && { search: searchQuery })
      }
      const data = await applicationService.getAllAdmin(params)
      setApplications(data.applications)
      setTotalPages(data.pages)
    } catch {
      toast.error('Ошибка при загрузке заявок')
    }
    setLoading(false)
  }

  const handleStatusUpdate = async () => {
    try {
      await applicationService.updateStatus(selectedApp.id, {
        status: newStatus,
        adminComment
      })
      toast.success('Статус обновлён')
      setShowStatusModal(false)
      setSelectedApp(null)
      setNewStatus('')
      setAdminComment('')
      loadApplications()
    } catch {
      toast.error('Ошибка при обновлении статуса')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Удалить эту заявку?')) {
      try {
        await applicationService.deleteAdmin(id)
        toast.success('Заявка удалена')
        loadApplications()
      } catch {
        toast.error('Ошибка при удалении')
      }
    }
  }

  const getStatusColor = (status) => {
    const statusConfig = config.application.statuses[status]
    return getStatusBadgeClass(statusConfig?.color)
  }

  if (loading && applications.length === 0) {
    return <p>Загрузка...</p>
  }

  return (
    <div className="space-y-6">
      <h1 className="!text-2xl">Реестр заявок</h1>

      <div className="card grid sm:grid-cols-2 lg:grid-cols-4 gap-4 !mb-0">
        <div>
          <label htmlFor="status" className="label">Статус</label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(1)
            }}
            className="input"
          >
            <option value="">Все статусы</option>
            {Object.entries(config.application.statuses).map(([value, status]) => (
              <option key={value} value={value}>{status.label}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="search" className="label">Поиск</label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            className="input"
            placeholder="ФИО, email или телефон..."
          />
        </div>

        <div>
          <label htmlFor="sortBy" className="label">Сортировка</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value)
              setPage(1)
            }}
            className="input"
          >
            <option value="createdAt">По дате</option>
            <option value="status">По статусу</option>
            <option value="id">По номеру</option>
          </select>
        </div>

        <div>
          <label htmlFor="sortOrder" className="label">Порядок</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value)
              setPage(1)
            }}
            className="input"
          >
            <option value="DESC">Сначала новые</option>
            <option value="ASC">Сначала старые</option>
          </select>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-xl font-semibold">Заявки не найдены</p>
        </div>
      ) : (
        <div className="panel divide-y divide-banquet-peach">
          {applications.map((app) => (
            <article key={app.id} className="app-row flex-col sm:flex-row !items-stretch">
              <div className="flex gap-4 flex-1 min-w-0">
                <div
                  className={clsx(
                    'shrink-0 w-2 self-stretch min-h-[60px]',
                    app.status === 'new' && 'bg-blue-500',
                    app.status === 'assigned' && 'bg-banquet-gold',
                    app.status === 'completed' && 'bg-banquet-green'
                  )}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap justify-between gap-2 mb-2">
                    <div>
                      <p className="font-semibold text-lg">№{app.id}</p>
                      <p className="text-sm font-medium">{app.user.fullName}</p>
                      <p className="text-xs text-banquet-muted">{app.user.email} · {app.user.phone}</p>
                      <p className="text-xs text-banquet-muted mt-1">
                        {format(new Date(app.createdAt), 'd MMM yyyy, HH:mm', { locale: ru })}
                      </p>
                    </div>
                    <span className={getStatusColor(app.status)}>
                      {config.application.statuses[app.status]?.label}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1 text-sm mb-2">
                    {Object.entries(app.data).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-banquet-muted">{getFieldLabel(config, key)}: </span>
                        <span className="font-medium">{formatFieldValue(config, key, value)}</span>
                      </div>
                    ))}
                  </div>

                  {app.adminComment && (
                    <p className="text-xs panel !p-2 !inline-block bg-rose-50 mb-2">
                      {app.adminComment}
                    </p>
                  )}

                  {app.rating && (
                    <p className="text-sm">
                      {'★'.repeat(app.rating)}{'☆'.repeat(5 - app.rating)}
                      {app.review && <span className="text-banquet-muted ml-2">{app.review}</span>}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex sm:flex-col gap-2 shrink-0 sm:border-l sm:border-banquet-peach sm:pl-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedApp(app)
                    setNewStatus(app.status)
                    setAdminComment(app.adminComment || '')
                    setShowStatusModal(true)
                  }}
                  className="btn-primary !text-xs !py-2 whitespace-nowrap"
                >
                  Статус
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(app.id)}
                  className="btn-secondary !text-xs !py-2 !border-red-800 !text-red-800 whitespace-nowrap"
                >
                  Удалить
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="card flex items-center justify-between !py-3">
          <button
            type="button"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="btn-secondary text-sm py-2"
          >
            Назад
          </button>
          <span className="text-sm font-semibold text-banquet-muted">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="btn-secondary text-sm py-2"
          >
            Вперёд
          </button>
        </div>
      )}

      {showStatusModal && createPortal(
        <div className="fixed inset-0 bg-banquet-ink/70 flex items-center justify-center p-4 z-[100]">
          <div className="card max-w-md w-full shadow-soft">
            <h3 className="mb-3">Изменить статус</h3>

            <div className="mb-4">
              <label htmlFor="newStatus" className="label">Статус</label>
              <select
                id="newStatus"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="input"
              >
                {Object.entries(config.application.statuses).map(([value, status]) => (
                  <option key={value} value={value}>{status.label}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="comment" className="label">Комментарий администратора</label>
              <textarea
                id="comment"
                rows={3}
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                className="input"
                placeholder="Комментарий для пользователя..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowStatusModal(false)
                  setSelectedApp(null)
                }}
                className="btn-secondary"
              >
                Отмена
              </button>
              <button type="button" onClick={handleStatusUpdate} className="btn-primary">
                Сохранить
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
