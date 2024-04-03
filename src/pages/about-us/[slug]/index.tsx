import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { newsApi } from '@/utils/api'
import { commonHelpers } from '@/utils/helpers'
import { commonConfig } from '@/utils/configs'

import LayoutMain from '@/layouts/Main'
import LayoutCoreProvider from '@/layouts/CoreProvider'

import type { NextPageWithLayout } from '@/pages/_app'
import type { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'
import memberApi from '@/utils/api/member/member.api'
import { IGetNotificationDetailResponse } from '@/utils/api/member'
import { localStorageAvailable } from '@/utils/helpers/common'
import { StringSchema } from 'yup'

type TermsAndConditionsSlugProps = {
  name: StringSchema
}

const ViewTermsAndConditionsSlug = dynamic(() => import('@/views/TermAndConditions'), {
  suspense: true,
  ssr: false,
})

const TermsAndConditionsSlug: NextPageWithLayout<TermsAndConditionsSlugProps> = () => {
  return (
    <Suspense fallback="...">
      <ViewTermsAndConditionsSlug />
    </Suspense>
  )
}

TermsAndConditionsSlug.getLayout = (page, pageParams) => {
  return (
    <LayoutCoreProvider
      headParams={{
        title: typeof pageParams?.name === 'string' ? pageParams?.name : 'ERROR NOT FOUND',
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
  const query = params!.slug as string

  switch (query) {
    case 'terms-and-conditions':
      return {
        props: {
          ...(await serverSideTranslations(locale || '')),
          name: 'Term and conditions',
        },
      }
    case 'privacy-policy':
      return {
        props: {
          ...(await serverSideTranslations(locale || '')),
          name: 'Privacy policy',
        },
      }
    default:
      return {
        props: {
          ...(await serverSideTranslations(locale || '')),
        },
        notFound: true,
      }
  }
}

export default TermsAndConditionsSlug
