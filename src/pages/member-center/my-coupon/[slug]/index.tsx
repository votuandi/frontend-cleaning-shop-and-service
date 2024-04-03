import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { promotionApi } from '@/utils/api'
import { commonHelpers } from '@/utils/helpers'

import LayoutMain from '@/layouts/Main'
import LayoutCoreProvider from '@/layouts/CoreProvider'

import type { NextPageWithLayout } from '@/pages/_app'
import type { GetServerSideProps } from 'next'
import { IGetCouponDetailResponse, IGetRedeemedCouponDetailResponse } from '@/utils/api/coupon'
import couponApi from '@/utils/api/coupon/coupon.api'
import { gotoPage, localStorageAvailable } from '@/utils/helpers/common'

type CouponDetailSlugProps = {
  couponDetail: IGetRedeemedCouponDetailResponse
}

const ViewRedeemedCouponSlug = dynamic(() => import('@/views/RedeemedCouponDetail'), {
  suspense: true,
  ssr: false,
})

const RedeemedCouponSlug: NextPageWithLayout<CouponDetailSlugProps> = () => {
  return (
    <Suspense fallback="...">
      <ViewRedeemedCouponSlug />
    </Suspense>
  )
}

RedeemedCouponSlug.getLayout = (page, pageParams) => {
  return (
    <LayoutCoreProvider
      headParams={{
        title: pageParams?.couponDetail?.CouponLanguage?.name,
        openGraph: {
          title: pageParams?.couponDetail?.CouponLanguage?.name,
          images: [
            {
              url: pageParams?.couponDetail?.image,
              alt: pageParams?.couponDetail?.CouponLanguage?.name,
            },
          ],
        },
      }}
    >
      <LayoutMain>{page}</LayoutMain>
    </LayoutCoreProvider>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale, params }) => {
  const slug = params!.slug as string
  const couponId = slug.split('-').reverse()[0]

  if (commonHelpers.isNumber(couponId)) {
    const storageAvailable = localStorageAvailable()
    const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''

    try {
      const { data: response } = await couponApi.getRedeemedCouponDetail({
        params: {
          member_coupon_id: couponId as unknown as number,
          language: locale === 'en-US' ? 'eng' : 'zho',
          token: accessToken ?? '',
        },
      })

      return {
        props: {
          ...(await serverSideTranslations(locale || '')),
          couponDetail: response.params,
        },
      }
    } catch (error) {
      console.log(error)
    }
  }

  return {
    props: {
      ...(await serverSideTranslations(locale || '')),
    },
    notFound: true,
  }
}

export default RedeemedCouponSlug
