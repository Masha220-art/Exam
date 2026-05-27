import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useConfig } from '../contexts/ConfigContext'
import { applicationService } from '../services/applications'
import { validateRussianDate } from '../utils/dateValidation'
import { photos } from '../config/images'
import toast from 'react-hot-toast'

export default function ApplicationForm() {
  const { config } = useConfig()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await applicationService.create({
        type: config.application.type,
        data
      })
      toast.success('Заявка успешно создана!')
      navigate('/applications')
    } catch (error) {
      const message = error.response?.data?.message || 'Ошибка при создании заявки'
      toast.error(message)
    }
    setIsLoading(false)
  }

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="label">
              {field.label}
            </label>
            <input
              {...register(field.name, field.required ? { required: `${field.label} обязательно` } : {})}
              type="text"
              className={`input ${errors[field.name] ? 'input-error' : ''}`}
              placeholder={field.placeholder}
            />
            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-600">{errors[field.name].message}</p>
            )}
          </div>
        )

      case 'number':
        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="label">
              {field.label}
            </label>
            <input
              {...register(field.name, field.required ? { required: `${field.label} обязательно` } : {})}
              type="number"
              className={`input ${errors[field.name] ? 'input-error' : ''}`}
              placeholder={field.placeholder}
            />
            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-600">{errors[field.name].message}</p>
            )}
          </div>
        )

      case 'textarea':
        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="label">
              {field.label}
            </label>
            <textarea
              {...register(field.name, field.required ? { required: `${field.label} обязательно` } : {})}
              rows={3}
              className={`input ${errors[field.name] ? 'input-error' : ''}`}
              placeholder={field.placeholder}
            />
            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-600">{errors[field.name].message}</p>
            )}
          </div>
        )

      case 'dateText':
        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="label">
              {field.label}
            </label>
            <input
              {...register(field.name, {
                ...(field.required ? { required: `${field.label} обязательно` } : {}),
                validate: validateRussianDate
              })}
              type="text"
              inputMode="numeric"
              maxLength={10}
              className={`input ${errors[field.name] ? 'input-error' : ''}`}
              placeholder={field.placeholder || 'ДД.ММ.ГГГГ'}
            />
            {errors[field.name] && (
              <p className="mt-1 text-sm text-banquet-red">{errors[field.name].message}</p>
            )}
          </div>
        )

      case 'date':
        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="label">
              {field.label}
            </label>
            <input
              {...register(field.name, field.required ? { required: `${field.label} обязательно` } : {})}
              type="date"
              className={`input ${errors[field.name] ? 'input-error' : ''}`}
            />
            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-600">{errors[field.name].message}</p>
            )}
          </div>
        )

      case 'time':
        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="label">
              {field.label}
            </label>
            <input
              {...register(field.name, field.required ? { required: `${field.label} обязательно` } : {})}
              type="time"
              className={`input ${errors[field.name] ? 'input-error' : ''}`}
              placeholder={field.placeholder}
            />
            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-600">{errors[field.name].message}</p>
            )}
          </div>
        )

      case 'select':
        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="label">
              {field.label}
            </label>
            <select
              {...register(field.name, field.required ? { required: `${field.label} обязательно` } : {})}
              className={`input ${errors[field.name] ? 'input-error' : ''}`}
            >
              <option value="">Выберите...</option>
              {field.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-600">{errors[field.name].message}</p>
            )}
          </div>
        )

      case 'radio':
        return (
          <div key={field.name}>
            <label className="label">{field.label}</label>
            <div className="space-y-2 border border-banquet-peach rounded-lg p-3 bg-white">
              {field.options.map(option => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    {...register(field.name, field.required ? { required: `${field.label} обязательно` } : {})}
                    type="radio"
                    value={option.value}
                    className="w-4 h-4 accent-banquet-red"
                  />
                  <span className="text-sm font-medium">{option.label}</span>
                </label>
              ))}
            </div>
            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-600">{errors[field.name].message}</p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,320px)_1fr] gap-0 panel overflow-hidden shadow-soft">
      <div className="relative min-h-[200px] lg:min-h-full lg:border-r border-banquet-peach">
        <img src={photos.authDefault} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-banquet-ink/70 to-banquet-red/30" />
        <div className="relative z-10 p-6 lg:p-8 text-white h-full flex flex-col justify-end">
          <p className="text-sm text-rose-100/90">Новая заявка</p>
          <h1 className="!text-white !text-2xl lg:!text-2xl mt-2 font-bold">
            {config.labels?.createButton || 'Бронирование'}
          </h1>
          <p className="text-sm mt-3 text-rose-50/90">Заполните форму справа — все поля со звёздочкой обязательны.</p>
        </div>
      </div>

      <div className="p-6 lg:p-8 bg-white">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-4">
          {config.application.fields.map(field => renderField(field))}

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-banquet-peach">
            <button
              type="button"
              onClick={() => navigate('/applications')}
              className="btn-secondary flex-1 order-2 sm:order-1"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1 order-1 sm:order-2"
            >
              {isLoading ? 'Отправка...' : 'Отправить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
