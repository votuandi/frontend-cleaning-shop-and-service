import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import * as React from "react";

export interface IAppProps {}

export default function AppLanguageSwitch(props: IAppProps) {
  const router = useRouter();
  const { pathname, asPath, query } = router;
  const { i18n } = useTranslation();

  let onTranslate = (lang: string) => {
    router.push({ pathname, query }, asPath, { locale: lang });

    if (typeof window !== undefined)
      (window as any).NextPublic.lang = i18n.language as any;
  };
  return (
    <div
      className={`relative flex flex-row w-[85px] h-[34px] bg-[#fff] rounded-[40px] justify-between items-center ${
        i18n.language === "en-US" ? "pl-3 pr-4" : "pl-4 pr-3"
      }`}
    >
      <div
        className={`absolute bg-[#0596A6] top-[2px] w-[50px] h-[30px] rounded-[40px] ${
          i18n.language === "en-US" ? "right-[2px]" : "left-[2px]"
        }`}
      ></div>
      <span
        className={`font-medium text-sm leading-[100%] flex items-center text-center tracking-[0.01em] z-10 cursor-pointer ${
          i18n.language === "zh-HK" ? "text-white" : "text-[#0596A6]"
          // "text-white"
        }`}
        onClick={() => onTranslate("zh-HK")}
      >
        中
      </span>
      <span
        className={`font-medium text-sm leading-[100%] flex items-center text-center tracking-[0.01em] z-10 cursor-pointer ${
          i18n.language === "en-US" ? "text-white" : "text-[#0596A6]"
        }`}
        onClick={() => onTranslate("en-US")}
      >
        EN
      </span>
    </div>
  );
}
