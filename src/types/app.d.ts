declare module "*.svg" {
  import React = require("react");
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module "*.svg?url" {
  const content: any;
  export default content;
}

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    NEXT_PUBLIC_API_HOST: string;
    NEXT_PUBLIC_API_BASE_URL: string;
  }
}

interface Window {
  NextPublic: {
    lang: "en-US" | "zh-HK" | "zh-CN" | "ko-KR" | "ja-JP";
    version: string;
  };
}

type SafeNumber = number | `${number}`;
