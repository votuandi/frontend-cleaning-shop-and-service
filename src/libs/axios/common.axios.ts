import axios from "axios";

// import { commonConfig } from "@/utils/config";

const commonAxios = axios.create({
  // baseURL: commonConfig.API_BASE_URL,
});

commonAxios.interceptors.request.use(
  (req) => {
    if (!req.headers["x-lang"]) {
      req.headers["x-lang"] =
        typeof window !== "undefined"
          ? window.NextPublic.lang.toLowerCase()
          : undefined;
    }

    switch ((req.method as string).toUpperCase()) {
      case "GET": {
        req.params = req.params || {};
        // Object.assign(req.params, {});
        break;
      }
      case "POST": {
        // if (!(req.data instanceof FormData) && !!req.data) {
        //   req.data = commonHelpers.formatFormData(req.data);
        // }

        // if (req.data instanceof FormData) {
        // } else {
        //   req.data = req.data || {};
        //   // Object.assign(req.params, {});
        // }
        break;
      }
      case "PUT": {
        // if (!(req.data instanceof FormData) && !!req.data) {
        //   req.data = commonHelpers.formatFormData(req.data);
        // }
        // if (req.data instanceof FormData) {
        //   // req.data.append("language", window.NextPublic.lang);
        // } else {
        //   req.data = req.data || {};
        //   // Object.assign(req.params, {});
        // }
        break;
      }
    }
    return req;
  },
  (err) => {
    console.log(err);
    return Promise.reject(err);
  }
);

commonAxios.interceptors.response.use(
  (res) => {
    // if (!["", null, undefined].includes(res?.data?.error_code)) {
    // 	// helpers.axios.allocateRoute(res.data.error_code)
    // }

    return res;
  },
  (err) => {
    console.log(err);
    return Promise.reject(err);
  }
);

export default commonAxios;
