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
import { IGetNewsDetailResponse } from '@/utils/api/news'

type NewsDetailSlugProps = {
  news: IGetNewsDetailResponse
}

const ViewLatestNewsSlug = dynamic(() => import('@/views/NewsDetail'), {
  suspense: true,
  ssr: false,
})

const NewsDetailSlug: NextPageWithLayout<NewsDetailSlugProps> = () => {
  return (
    <Suspense fallback="...">
      <ViewLatestNewsSlug />
    </Suspense>
  )
}


NewsDetailSlug.getLayout = (page, pageParams) => {
  return (
    <LayoutCoreProvider
      headParams={{
        title: pageParams?.news?.NewsLanguage?.title,
        openGraph: {
          title: pageParams?.news?.NewsLanguage?.title,
          images: [
            {
              url: pageParams?.news?.thumbnail_image,
              alt: pageParams?.news?.NewsLanguage?.title,
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
  const newsId = slug.split('-').reverse()[0]

  if (commonHelpers.isNumber(newsId)) {
    try {
      const { data: response } = await newsApi.getNewsDetail({
        params: {
          news_id: newsId as unknown as number,
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
      console.log(error);

    }
  }

  return {
    props: {
      ...(await serverSideTranslations(locale || '')),
    },
    notFound: true,
  }
}

export default NewsDetailSlug
