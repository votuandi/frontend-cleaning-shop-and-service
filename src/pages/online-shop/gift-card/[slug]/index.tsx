import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { promotionApi } from '@/utils/api'
import { commonHelpers } from '@/utils/helpers'

import LayoutMain from '@/layouts/Main'
import LayoutCoreProvider from '@/layouts/CoreProvider'

import type { NextPageWithLayout } from '@/pages/_app'
import type { GetServerSideProps } from 'next'
import { IGetPromotionsDetailResponse } from '@/utils/api/promotion'

type NewsDetailSlugProps = {
  giftDetail: IGetPromotionsDetailResponse
}

const ViewProductSlug = dynamic(() => import('@/views/GiftCardDetail'), {
  suspense: true,
  ssr: false,
})

const GiftDetailSlug: NextPageWithLayout<NewsDetailSlugProps> = () => {
  return (
    <Suspense fallback="...">
      <ViewProductSlug />
    </Suspense>
  )
}

GiftDetailSlug.getLayout = (page, pageParams) => {
  return (
    <LayoutCoreProvider
      headParams={{
        title: pageParams?.giftDetail?.GiftLanguage?.name,
        openGraph: {
          title: pageParams?.giftDetail?.GiftLanguage?.name,
          images: [
            {
              url: pageParams?.giftDetail?.image,
              alt: pageParams?.giftDetail?.GiftLanguage?.name,
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
  const giftId = slug.split('-').reverse()[0]

  if (commonHelpers.isNumber(giftId)) {
    try {
      const { data: response } = await promotionApi.getPromotionDetail({
        params: {
          gift_id: giftId as unknown as number,
          language: locale === 'en-US' ? 'eng' : 'zho',
        },
      })

      return {
        props: {
          ...(await serverSideTranslations(locale || '')),
          giftDetail: response.params,
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

export default GiftDetailSlug
