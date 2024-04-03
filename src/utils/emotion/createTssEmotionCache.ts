import createCache from "@emotion/cache";
import { commonConfig } from "../configs";

export function createTssEmotionCache() {
  return createCache({
    key: commonConfig.APP_NAME,
  });
}

export default createTssEmotionCache;
