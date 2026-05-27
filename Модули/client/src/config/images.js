/**
 * Медиафайлы портала «Банкетам.Нет»
 *
 * Основные фотографии: Модули/client/public/assets/
 *   в браузере: /assets/имя-файла.jpg
 *
 * Блок «Качество»: Модули/client/public/quality_img/
 * Запасные фото: Модули/client/public/images/
 */

const base = '/assets'

export const photos = {
  logo: `${base}/3505f015e0d26644e8e4c.jpg`,
  loginBanner: `${base}/66155ef0748e9.jpg`,
  registerBanner: `${base}/1686676944_elles-top-p-letnyaya-ploshcha.jpg`,
  authDefault: `${base}/f2fb9b7b5b497ab50072e4a0bb6efa01.jpg`,
  rooms: {
    hall: `${base}/3505f015e0d26644e8e4c.jpg`,
    restaurant: `${base}/339037.jpeg`,
    summerVeranda: `${base}/1686676944_elles-top-p-letnyaya-ploshcha.jpg`,
    closedVeranda: `${base}/1671649122_idei-club-p-veranda-.jpg`,
  },
}

export const sliderSlides = [
  { src: photos.rooms.hall, alt: 'Зал' },
  { src: photos.rooms.restaurant, alt: 'Ресторан' },
  { src: photos.rooms.summerVeranda, alt: 'Летняя веранда' },
  { src: photos.rooms.closedVeranda, alt: 'Закрытая веранда' },
]

export const roomCards = [
  { img: photos.rooms.hall, label: 'Зал' },
  { img: photos.rooms.restaurant, label: 'Ресторан' },
  { img: photos.rooms.summerVeranda, label: 'Летняя веранда' },
  { img: photos.rooms.closedVeranda, label: 'Закрытая веранда' },
]

/** Фото и значки блока «Качество» — папка public/quality_img/ */
export const quality = {
  banner: '/quality_img/30f95413dfc906ce9c2ed749a1a6933c.jpg',
  badges: [
    { icon: '★', title: 'Меню', text: 'Авторские блюда и сезонные предложения' },
    { icon: '✦', title: 'Сервировка', text: 'Аккуратная подача и оформление стола' },
    { icon: '♥', title: 'Сервис', text: 'Внимательный персонал на протяжении банкета' },
    { icon: '✓', title: 'Атмосфера', text: 'Уютные залы и веранды для любого события' },
  ],
}
