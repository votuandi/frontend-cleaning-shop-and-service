// slices/valSlice.ts
import { IGetCartResponse } from '@/utils/api/transaction'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AlertState {
  cancelState: string
  okState: string
  message: string
}

const initialState: AlertState = {
  cancelState: '',
  okState: '',
  message: '',
}

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlertCancelState: (state, action: PayloadAction<string>) => {
      state.cancelState = action.payload
    },
    setAlertOkState: (state, action: PayloadAction<string>) => {
      state.okState = action.payload
    },
    setAlertMessageState: (state, action: PayloadAction<string>) => {
      state.message = action.payload
    },
    resetAlertState: (state) => {
      state.cancelState = ''
      state.okState = ''
      state.message = ''
    },
  },
})

export const { setAlertCancelState, setAlertOkState, setAlertMessageState, resetAlertState } = alertSlice.actions
export default alertSlice.reducer
