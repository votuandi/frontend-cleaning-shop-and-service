import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { newsApi, productApi } from '@/utils/api'
import { commonHelpers } from '@/utils/helpers'
import { commonConfig } from '@/utils/configs'

import LayoutMain from '@/layouts/Main'
import LayoutCoreProvider from '@/layouts/CoreProvider'

import type { NextPageWithLayout } from '@/pages/_app'
import type { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'
import { IGetProductDetailResponse } from '@/utils/api/product'

type NewsDetailSlugProps = {
  productDetail: IGetProductDetailResponse
}

const ViewProductSlug = dynamic(() => import('@/views/ProductDetail'), {
  suspense: true,
  ssr: false,
})

const ProductDetailSlug: NextPageWithLayout<NewsDetailSlugProps> = () => {
  return (
    <Suspense fallback="...">
      <ViewProductSlug />
    </Suspense>
  )
}

ProductDetailSlug.getLayout = (page, pageParams) => {
  return (
    <LayoutCoreProvider
      headParams={{
        title: pageParams?.productDetail?.ProductLanguage?.name,
        openGraph: {
          title: pageParams?.productDetail?.ProductLanguage?.name,
          images: [
            {
              url: pageParams?.productDetail?.image,
              alt: pageParams?.productDetail?.ProductLanguage?.name,
            },
          ],
        },
      }}
    >
      <LayoutMain>{page}</LayoutMain>
    </LayoutCoreProvider>
  )
}

// export const getStaticPaths: GetStaticPaths = async () => {
//   return {
//     paths: [],
//     fallback: 'blocking',
//   }
// }

export const getServerSideProps: GetServerSideProps = async ({ locale, params }) => {
  const slug = params!.slug as string
  const productId = slug.split('-').reverse()[0]

  if (commonHelpers.isNumber(productId)) {
    try {
      const { data: response } = await productApi.getDetail({
        params: {
          product_id: productId as unknown as number,
          language: locale === 'en-US' ? 'eng' : 'zho',
        },
      })

      return {
        props: {
          ...(await serverSideTranslations(locale || '')),
          productDetail: response.params,
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

export default ProductDetailSlug
