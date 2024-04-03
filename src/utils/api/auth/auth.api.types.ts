import { CancelToken, RawAxiosRequestHeaders } from 'axios'

type Payload = {
  cancelToken?: CancelToken
}

export type IRegisterPayload = {
  params: {
    language: 'eng' | 'zho'
    country_code: string
    phone: string
    name: string
    email: string
    password: string
    confirm_password: string
    gender_id: string
    date_of_birth: string
    referral_member_phone: string
    referral_member_country_code: string
    receive_notification: string
    policy_agreement: string
  }
} & Payload

export type IRegisterResponse = {}

export type IRequestOTPPayload = {
  params: {
    language: 'eng' | 'zho'
    country_code: string
    phone: string
    verify_type: 'register' | 'forgot_password' | 'change_phone'
    token?: string
  }
} & Payload

export type IRequestOtpResponse = {
  counter: number
  waiting_time: string
  otp_code: string
}

export type IVerifyOTPPayload = {
  params: {
    language: 'eng' | 'zho'
    country_code: string
    phone: string
    verify_type: 'register' | 'forgot_password' | 'change_phone'
    code: string
  }
} & Payload

export type IVerifyOtpResponse = {
  token: string
}

export type ILoginPayload = {
  params: {
    country_code: string
    phone: string
    password: string
    language: 'eng' | 'zho'
  }
} & Payload

export type ILoginResponse = {
  new_token: string
}

export type IResetPasswordPayload = {
  params: {
    language: 'eng' | 'zho'
    password: string
    confirm_password: string
    verification_token: string
    country_code: string
    phone: string
  }
} & Payload

export type IResetPasswordResponse = {}
