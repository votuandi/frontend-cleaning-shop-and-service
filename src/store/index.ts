// store/index.ts
import alertSlice from '@/slice/alertSlice'
import cartSlice from '@/slice/cartSlice'
import memberSettingSlice from '@/slice/memberSettingSlice'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    alert: alertSlice,
    memberSetting: memberSettingSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
