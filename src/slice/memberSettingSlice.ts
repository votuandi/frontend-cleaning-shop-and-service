import { ICountryCodeDataItem, IGenderDataItem, ILanguageDataItem } from '@/utils/api/member'
import { IGetMemberSettingResponse, ITransStatusDataItem } from '@/utils/api/setting'
// slices/valSlice.ts
import { IGetCartResponse } from '@/utils/api/transaction'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type MemberSettingState = IGetMemberSettingResponse

const initialState: MemberSettingState = {
  country_code: [],
  gender: [],
  lang: [],
  trans_status: [],
}

const memberSettingSlice = createSlice({
  name: 'memberSetting',
  initialState,
  reducers: {
    setCountryCodeDataSetting: (state, action: PayloadAction<ICountryCodeDataItem[]>) => {
      state.country_code = action.payload
    },
    setGenderDataSetting: (state, action: PayloadAction<IGenderDataItem[]>) => {
      state.gender = action.payload
    },
    setLanguageDataSettings: (state, action: PayloadAction<ILanguageDataItem[]>) => {
      state.lang = action.payload
    },
    setTransStatusDataSetting: (state, action: PayloadAction<ITransStatusDataItem[]>) => {
      state.trans_status = action.payload
    },
  },
})

export const { setCountryCodeDataSetting, setGenderDataSetting, setLanguageDataSettings, setTransStatusDataSetting } = memberSettingSlice.actions
export default memberSettingSlice.reducer
