import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { promotionApi } from '@/utils/api'
import { commonHelpers } from '@/utils/helpers'

import LayoutMain from '@/layouts/Main'
import LayoutCoreProvider from '@/layouts/CoreProvider'

import type { NextPageWithLayout } from '@/pages/_app'
import type { GetServerSideProps } from 'next'
import { IGetCouponDetailResponse } from '@/utils/api/coupon'
import couponApi from '@/utils/api/coupon/coupon.api'

type CouponDetailSlugProps = {
  couponDetail: IGetCouponDetailResponse
}

const ViewCouponSlug = dynamic(() => import('@/views/CouponDetail'), {
  suspense: true,
  ssr: false,
})

const CouponDetailSlug: NextPageWithLayout<CouponDetailSlugProps> = () => {
  return (
    <Suspense fallback="...">
      <ViewCouponSlug />
    </Suspense>
  )
}

CouponDetailSlug.getLayout = (page, pageParams) => {
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
    try {
      const { data: response } = await couponApi.getDetail({
        params: {
          coupon_id: couponId as unknown as number,
          language: locale === 'en-US' ? 'eng' : 'zho',
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

export default CouponDetailSlug
