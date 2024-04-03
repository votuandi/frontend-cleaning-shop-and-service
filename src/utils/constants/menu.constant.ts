export type MENU_ITEM_TYPE = {
  text: string
  path: string
  params?: string
  auth: false
}

export const MENU: MENU_ITEM_TYPE[] = [
  {
    text: 'online shop',
    path: '/online-shop',
    auth: false,
  },
  {
    text: 'car cleaning',
    path: '/service/car-cleaning',
    auth: false,
  },
  {
    text: 'home cleaning',
    path: '/service/home-cleaning',
    auth: false,
  },
  {
    text: 'commerce cleaning',
    path: '/service/commerce-cleaning',
    auth: false,
  },
  {
    text: 'redemption center',
    path: '/redemption-center',
    auth: false,
  },
  {
    text: 'news & promotions',
    path: '/news',
    auth: false,
  },
]

export const LEFT_MENU_ALL_SERVICE: {
  image: string
  title: string
  path: string
  query?: string
}[] = [
  {
    image: '/img/ic-car-leaning.png',
    title: 'car cleaning',
    path: '/service/car-cleaning',
  },
  {
    image: '/img/ic-home-cleaning.png',
    title: 'home cleaning',
    path: '/service/home-cleaning',
  },
  {
    image: '/img/ic-commerce-cleaning.png',
    title: 'commerce cleaning',
    path: '/service/commerce-cleaning',
  },
  {
    image: '/img/ic-coupon.png',
    title: 'coupon',
    path: '/redemption-center',
  },
  {
    image: '/img/ic-gift-card.png',
    title: 'Gift card',
    path: '/online-shop',
    query: '?filter=gift',
  },
]

export const LEFT_MENU_SERVICE_CATEGORY = [
  {
    image: '/img/ic-home-cleaning.png',
    title: 'Service A',
  },
  {
    image: '/img/ic-commerce-cleaning.png',
    title: 'Service B',
  },
  {
    image: '/img/ic-coupon.png',
    title: 'Coupon',
  },
]

export const LEFT_MENU_ONLINE_SHOP = [
  {
    image: '/img/ic-coupon.png',
    title: 'coupon',
    path: '/coupon',
  },
  {
    image: '/img/ic-services.png',
    title: 'services',
    path: '/service',
  },
]

export const FOOTER = [
  {
    title: 'SERVICE',
    items: [
      {
        name: 'car cleaning',
        path: '/service/car-leaning',
      },
      {
        name: 'commerce cleaning',
        path: '/service/commerce-cleaning',
      },
      {
        name: 'home cleaning',
        path: '/service/home-cleaning',
      },
    ],
  },
  {
    title: 'COMPANY',
    items: [
      {
        name: 'news',
        path: '/news',
      },
      {
        name: 'member center',
        path: '/member-center',
      },
    ],
  },
  {
    title: 'LEGAL',
    items: [
      {
        name: 'Terms & Conditions',
        path: '/about-us/terms-and-conditions',
      },
      {
        name: 'privacy policy',
        path: '/about-us/privacy-policy',
      },
    ],
  },
]
