import { Suspense, startTransition } from 'react'
import dynamic from 'next/dynamic'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import LayoutMain from '@/layouts/Main'

import type { NextPageWithLayout } from '@/pages/_app'
import type { GetServerSideProps, GetStaticProps, InferGetServerSidePropsType } from 'next'
// import pageStructuresApi from "@/utils/api/pageStructures/pageStructures.api";
import { NextSeo } from 'next-seo'

type ISeoProps = {
  title: string
  description: string
}

export const getServerSideProps = (async ({ locale }) => {
  let seoData: ISeoProps = {
    title: 'Home Page',
    description: 'Cleaning Papa',
  }
  // try {
  //   const res = await pageStructuresApi.getPageStructures({
  //     params: {
  //       page: "HOME",
  //     },
  //     headers: {
  //       Language: locale?.replace("-", "_"),
  //     },
  //   });
  //   if (res.status === 200) {
  //     seoData = res.data.params.Seo ? res.data.params.Seo : seoData;
  //   }
  // } catch (error) {
  //   console.log(error);
  // }
  return {
    props: { seoData, ...(await serverSideTranslations(locale || '')) },
  }
}) satisfies GetServerSideProps<{
  seoData: ISeoProps
}>

const ViewHome = dynamic(() => import('@/views/Home'), {
  suspense: true,
  ssr: false,
})

const Home: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = (props) => {
  return (
    <Suspense fallback="...">
      <NextSeo title={props.seoData.title} description={props.seoData.description} />
      <ViewHome />
    </Suspense>
  )
}

Home.getLayout = (page) => {
  return <LayoutMain>{page}</LayoutMain>
}

export default Home
