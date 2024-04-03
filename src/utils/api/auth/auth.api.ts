import commonAxios from "@/utils/axios/common.axios";

import type { AxiosResponseData } from "@/utils/axios";
import type { ILoginPayload, IRegisterPayload, IRequestOTPPayload, IResetPasswordPayload, IVerifyOTPPayload } from "./auth.api.types";

const authApi = {
  register: (payload: IRegisterPayload) => {
    return commonAxios.post<AxiosResponseData>("/api/member/members/registration.json", {
      ...payload.params,
      cancelToken: payload.cancelToken,
    });
  },
  requestOtp: (payload: IRequestOTPPayload) => {
    return commonAxios.post<AxiosResponseData>("/api/member/members/request_verification_code.json", {
      ...payload.params,
      cancelToken: payload.cancelToken,
    });
  },
  verifyOtp: (payload: IVerifyOTPPayload) => {
    return commonAxios.post<AxiosResponseData>("/api/member/members/verify_phone.json", {
      ...payload.params,
      cancelToken: payload.cancelToken,
    });
  },
  signIn: (payload: ILoginPayload) => {
    return commonAxios.post<AxiosResponseData>("/api/member/members/login.json", {
      ...payload.params,
      cancelToken: payload.cancelToken,
    });
  },
  resetPassword: (payload: IResetPasswordPayload) => {
    return commonAxios.post<AxiosResponseData>("/api/member/members/reset_password.json", {
      ...payload.params,
      cancelToken: payload.cancelToken,
    });
  },
};

export default authApi;
