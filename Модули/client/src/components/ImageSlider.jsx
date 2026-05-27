import { useState, useEffect, useCallback } from 'react'
import clsx from 'clsx'
import { sliderSlides } from '../config/images'

export default function ImageSlider({ variant = 'default' }) {
  const [index, setIndex] = useState(0)

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % sliderSlides.length)
  }, [])

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + sliderSlides.length) % sliderSlides.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(next, 4500)
    return () => clearInterval(timer)
  }, [next])

  if (variant === 'hero') {
    return (
      <div className="relative h-full min-h-[260px] lg:min-h-[300px] rounded-b-xl overflow-hidden">
        {sliderSlides.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            className={clsx(
              'absolute inset-0 w-full h-full object-cover',
              i === index ? 'opacity-100' : 'opacity-0 transition-opacity duration-700'
            )}
          />
        ))}
        <div className="absolute bottom-0 inset-x-0 flex justify-between items-center p-4 bg-gradient-to-t from-black/60 to-transparent">
          <span className="text-white font-medium text-lg drop-shadow">{sliderSlides[index].alt}</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={prev}
              className="w-9 h-9 rounded-full bg-white/90 text-banquet-ink text-sm hover:bg-white shadow-sm"
              aria-label="Назад"
            >
              ←
            </button>
            <button
              type="button"
              onClick={next}
              className="w-9 h-9 rounded-full bg-white/90 text-banquet-ink text-sm hover:bg-white shadow-sm"
              aria-label="Вперёд"
            >
              →
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="panel">
      <div className="flex justify-between items-center px-4 py-2 bg-white border-b border-banquet-peach text-sm">
        <span className="text-banquet-muted">Сейчас: <b className="text-banquet-ink">{sliderSlides[index].alt}</b></span>
        <span className="text-banquet-muted">{index + 1} / {sliderSlides.length}</span>
      </div>
      <div className="relative h-[200px]">
        {sliderSlides.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            className={clsx(
              'absolute inset-0 w-full h-full object-cover',
              i === index ? 'opacity-100' : 'opacity-0 transition-opacity duration-500'
            )}
          />
        ))}
      </div>
      <div className="flex border-t border-banquet-peach divide-x divide-banquet-peach">
        <button type="button" onClick={prev} className="flex-1 py-2.5 text-sm text-banquet-red hover:bg-gray-50 font-medium">
          ← Назад
        </button>
        <button type="button" onClick={next} className="flex-1 py-2.5 text-sm text-banquet-red hover:bg-gray-50 font-medium">
          Вперёд →
        </button>
      </div>
    </div>
  )
}
