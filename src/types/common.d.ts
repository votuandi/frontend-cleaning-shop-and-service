export type SortSettingsType = {
  sort: SortType | CouponSortType | ServiceSortType
  sortOrder: SortOderType
}

export type CouponSortType = 'type' | ''

export type ServiceSortType = 'categories' | 'type' | ''

export type SortType = 'price' | 'categories' | 'type' | ''

export type SortOderType = 'ASC' | 'DESC'

export type FilterType = 'all' | 'product' | 'gift'

export type RedeemedCouponFilterType = 'all' | 'active' | 'past'

export type ServiceTypeType = '' | 'car_cleaning' | 'commerce_cleaning' | 'home_cleaning'

export type OrderFilterType = 'waiting_for_payment' | 'paid' | 'delivery' | 'completed' | ''

export type FooterContentType =
  | 'content-web-title'
  | 'content-web-seo'
  | 'content-web-phone'
  | 'content-web-email'
  | 'content-web-address'
  | 'content-web-facebook'
  | 'content-web-instagram'
  | 'content-web-youtube'
  | 'content-web-whatsapp'
