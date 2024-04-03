// slices/valSlice.ts
import { IGetCartResponse } from '@/utils/api/transaction'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CartState {
  cart: IGetCartResponse
}

const initialState: CartState = {
  cart: {
    Cart: {
      id: '',
      member_id: '',
      coupon_id: '',
      total_amount: '',
      shipping_fee: '',
      disc_amount: '',
      grand_total: '',
      name: '',
      phone: '',
      address: '',
      remark: '',
    },
    CartDetail: [],
  },
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setGlobalCart: (state, action: PayloadAction<IGetCartResponse>) => {
      state.cart = action.payload
    },
  },
})

export const { setGlobalCart } = cartSlice.actions
export default cartSlice.reducer
