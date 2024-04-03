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
import { capitalizeFirstLetterAllWords } from '@/utils/helpers/common'

type ServiceCategorySlugProps = {
  name: string
}

const ViewServiceDetailSlug = dynamic(() => import('@/views/ServiceCategory'), {
  suspense: true,
  ssr: false,
})

const ServiceCategorySlug: NextPageWithLayout<ServiceCategorySlugProps> = () => {
  return (
    <Suspense fallback="...">
      <ViewServiceDetailSlug />
    </Suspense>
  )
}

ServiceCategorySlug.getLayout = (page, pageParams) => {
  return (
    <LayoutCoreProvider
      headParams={{
        title: pageParams?.name,
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

  return {
    props: {
      ...(await serverSideTranslations(locale || '')),
      name: capitalizeFirstLetterAllWords(slug.replaceAll('-', ' ')),
    },
  }
}

export default ServiceCategorySlug
