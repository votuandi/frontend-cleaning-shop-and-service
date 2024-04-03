import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { newsApi, serviceApi } from '@/utils/api'
import { commonHelpers } from '@/utils/helpers'
import { commonConfig } from '@/utils/configs'

import LayoutMain from '@/layouts/Main'
import LayoutCoreProvider from '@/layouts/CoreProvider'

import type { NextPageWithLayout } from '@/pages/_app'
import type { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'
import { IGetServiceDetailResponse } from '@/utils/api/service'

type ServiceDetailSlugProps = {
  serviceDetail: IGetServiceDetailResponse
}

const ViewServiceDetailSlug = dynamic(() => import('@/views/ServiceDetail'), {
  suspense: true,
  ssr: false,
})

const ServiceDetailSlug: NextPageWithLayout<ServiceDetailSlugProps> = () => {
  return (
    <Suspense fallback="...">
      <ViewServiceDetailSlug />
    </Suspense>
  )
}

ServiceDetailSlug.getLayout = (page, pageParams) => {
  return (
    <LayoutCoreProvider
      headParams={{
        title: pageParams?.serviceDetail?.ServiceLanguage?.title,
        openGraph: {
          title: pageParams?.serviceDetail?.ServiceLanguage?.title,
          images: [
            {
              url: pageParams?.serviceDetail?.thumbnail_image,
              alt: pageParams?.serviceDetail?.ServiceLanguage?.title,
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
  const serviceId = slug.split('-').reverse()[0]

  if (commonHelpers.isNumber(serviceId)) {
    try {
      const { data: response } = await serviceApi.getDetail({
        params: {
          service_id: serviceId as unknown as number,
          language: locale === 'en-US' ? 'eng' : 'zho',
        },
      })

      return {
        props: {
          ...(await serverSideTranslations(locale || '')),
          news: response.params,
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

export default ServiceDetailSlug
