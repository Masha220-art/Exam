import { photos } from '../config/images'

export default function PageLogo({ className = 'h-14 w-14' }) {
  return (
    <img
      src={photos.logo}
      alt="Банкетам.Нет"
      className={`${className} object-cover`}
    />
  )
}
