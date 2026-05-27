import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { useConfig } from '../contexts/ConfigContext'
import { applicationService } from '../services/applications'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import { getFieldLabel, formatFieldValue, getStatusBadgeClass } from '../utils/applicationDisplay'

export default function Applications() {
  const { config } = useConfig()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      const data = await applicationService.getAll()
      setApplications(data)
    } catch {
      toast.error('Ошибка при загрузке заявок')
    }
    setLoading(false)
  }

  const handleReview = async () => {
    try {
      await applicationService.update(selectedApp.id, { rating, review })
      toast.success('Отзыв добавлен')
      setShowReviewModal(false)
      setSelectedApp(null)
      setRating(5)
      setReview('')
      loadApplications()
    } catch {
      toast.error('Ошибка при добавлении отзыва')
    }
  }

  const getStatusColor = (status) => {
    const statusConfig = config.application.statuses[status]
    return getStatusBadgeClass(statusConfig?.color)
  }

  if (loading) {
    return <p className="panel p-8 text-center">Загрузка заявок...</p>
  }

  return (
    <div className="lg:grid lg:grid-cols-[260px_1fr] gap-6 items-start">
      <aside className="card lg:sticky lg:top-6 space-y-4 !mb-0">
        <div>
          <p className="text-xs text-banquet-muted">Раздел</p>
          <h1 className="!text-xl mt-1">{config.labels?.viewButton || 'Мои заявки'}</h1>
        </div>
        <p className="text-4xl font-bold text-banquet-red">{applications.length}</p>
        <p className="text-sm text-banquet-muted">всего заявок</p>
        <Link to="/applications/new" className="btn-primary w-full text-center block">
          + Новая заявка
        </Link>
      </aside>

      <div className="min-w-0">
        {applications.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-xl font-semibold">Заявок пока нет</p>
            <p className="text-secondary mt-2">Оформите первое бронирование</p>
            <Link to="/applications/new" className="btn-primary inline-flex mt-6">
              {config.labels?.createButton || 'Оформить бронирование'}
            </Link>
          </div>
        ) : (
          <div className="panel divide-y divide-banquet-peach overflow-hidden">
            {applications.map((app, idx) => (
              <article
                key={app.id}
                className={clsx('app-row !border-0', idx % 2 === 1 && 'bg-banquet-cream/40')}
              >
                <div
                  className={clsx(
                    'shrink-0 w-1 self-stretch min-h-[80px]',
                    app.status === 'new' && 'bg-blue-500',
                    app.status === 'assigned' && 'bg-banquet-gold',
                    app.status === 'completed' && 'bg-banquet-green'
                  )}
                  aria-hidden
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="text-lg font-semibold text-banquet-ink">
                        №{app.id} · {config.labels?.applicationName || 'Заявка'}
                      </p>
                      <p className="text-xs text-banquet-muted mt-0.5">
                        {format(new Date(app.createdAt), 'd MMMM yyyy', { locale: ru })}
                      </p>
                    </div>
                    <span className={getStatusColor(app.status)}>
                      {config.application.statuses[app.status]?.label}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                    {Object.entries(app.data).map(([key, value]) => (
                      <div key={key} className="flex gap-2">
                        <span className="text-banquet-muted shrink-0">{getFieldLabel(config, key)}:</span>
                        <span className="font-medium">{formatFieldValue(config, key, value)}</span>
                      </div>
                    ))}
                  </div>

                  {app.adminComment && (
                    <p className="mt-3 text-sm panel !p-2 !inline-block bg-rose-50 border-banquet-red/30">
                      <b>Админ:</b> {app.adminComment}
                    </p>
                  )}

                  {app.rating && (
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold uppercase">Оценка:</span>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < app.rating ? 'text-banquet-gold' : 'text-banquet-peach'}>
                          ★
                        </span>
                      ))}
                      {app.review && <span className="text-sm text-banquet-muted">— {app.review}</span>}
                    </div>
                  )}

                  {config.features.reviews && app.status !== 'new' && !app.rating && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedApp(app)
                        setShowReviewModal(true)
                      }}
                      className="mt-3 btn-secondary !text-xs !py-1.5"
                    >
                      Оставить отзыв
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {showReviewModal && createPortal(
        <div className="fixed inset-0 bg-banquet-ink/70 flex items-center justify-center p-4 z-[100]">
          <div className="card max-w-md w-full shadow-soft">
            <h3 className="mb-4">Оставить отзыв</h3>

            <div className="mb-4">
              <span className="label">Оценка</span>
              <div className="flex gap-2 mt-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button key={value} type="button" onClick={() => setRating(value)} className="text-2xl focus:outline-none">
                    <span className={value <= rating ? 'text-banquet-gold' : 'text-banquet-peach'}>★</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="review" className="label">Комментарий</label>
              <textarea
                id="review"
                rows={4}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="input"
                placeholder="Поделитесь впечатлениями..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowReviewModal(false)
                  setSelectedApp(null)
                  setRating(5)
                  setReview('')
                }}
                className="btn-secondary flex-1"
              >
                Отмена
              </button>
              <button type="button" onClick={handleReview} className="btn-primary flex-1">
                Отправить
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
