import { Suspense, startTransition } from "react";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import LayoutAccount from "@/layouts/Account";

import type { NextPageWithLayout } from "@/pages/_app";
import type {
  GetServerSideProps,
  GetStaticProps,
  InferGetServerSidePropsType,
} from "next";
// import pageStructuresApi from "@/utils/api/pageStructures/pageStructures.api";
import { NextSeo } from "next-seo";

type ISeoProps = {
  title: string;
  description: string;
};

export const getServerSideProps = (async ({ locale }) => {
  let seoData: ISeoProps = {
    title: "Verify OTP",
    description: "Cleaning Papa",
  };
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
    props: { seoData, ...(await serverSideTranslations(locale || "")) },
  };
}) satisfies GetServerSideProps<{
  seoData: ISeoProps;
}>;

const ViewVerifyOTP = dynamic(() => import("@/views/VerifyOTP"), {
  suspense: true,
  ssr: false,
});

const VerifyOTP: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
  return (
    <Suspense fallback="...">
      <NextSeo
        title={props.seoData.title}
        description={props.seoData.description}
      />
      <ViewVerifyOTP />
    </Suspense>
  );
};

VerifyOTP.getLayout = (page) => {
  return <LayoutAccount>{page}</LayoutAccount>;
};

export default VerifyOTP;
