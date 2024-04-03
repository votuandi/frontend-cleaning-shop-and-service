import createCache from "@emotion/cache";
// import { commonConfig } from "../../utils/config";

export function createTssEmotionCache() {
  return createCache({
    // key: commonConfig.APP_EMOTION_CACHE_KEY,
    key: "app",
  });
}

export default createTssEmotionCache;
