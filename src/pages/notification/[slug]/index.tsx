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

type NotificationDetailSlugProps = {
  notify: IGetNotificationDetailResponse
}

const ViewNotificationDetailSlug = dynamic(() => import('@/views/NotificationDetail'), {
  suspense: true,
  ssr: false,
})

const NotificationDetailSlug: NextPageWithLayout<NotificationDetailSlugProps> = () => {
  return (
    <Suspense fallback="...">
      <ViewNotificationDetailSlug />
    </Suspense>
  )
}

NotificationDetailSlug.getLayout = (page, pageParams) => {
  return (
    <LayoutCoreProvider
      headParams={{
        title: pageParams?.notify ? pageParams.notify.name : 'Notification Detail',
        openGraph: {
          title: pageParams?.notify ? pageParams.notify.name : 'Notification Detail',
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
  const notificationId = slug.split('-').reverse()[0]

  if (commonHelpers.isNumber(notificationId)) {
    try {
      const storageAvailable = localStorageAvailable()
      const accessToken = storageAvailable ? localStorage.getItem('access_token') : ''
      if (!accessToken) {
        return {
          props: {
            ...(await serverSideTranslations(locale || '')),
            notify: null,
          },
        }
      } else {
        const { data: response } = await memberApi.getNotificationDetail({
          params: {
            language: locale === 'en-US' ? 'eng' : 'zho',
            token: accessToken!,
            member_push_id: notificationId,
          },
        })

        return {
          props: {
            ...(await serverSideTranslations(locale || '')),
            notify: response.params,
          },
        }
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

export default NotificationDetailSlug
