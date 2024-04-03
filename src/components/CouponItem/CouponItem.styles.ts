import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles({
  name: 'CouponItem',
  uniqId: 'coupon_item',
})((theme, _, classes) => {
  return {
    pickAmountTextField: {
      backgroundColor: '#F0F0F0',
      borderRadius: 4,
      height: 40,
      zIndex: 0,

      '& .MuiFilledInput-root': {
        backgroundColor: '#F0F0F0',
        borderRadius: 4,
      },

      '& fieldset': {
        border: 'none',
      },

      '& input': {
        color: '#000',
        fontSize: '16px',
        fontStyle: 'normal',
        fontWeight: '500',
        lineHeight: 'normal',
        borderRadius: 4,
        textAlign: 'center',
        padding: 0,
      },

      '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {
        '-webkit-appearance': 'none',
        margin: 0,
      },
      '& input[type=number]': {
        '-moz-appearance': 'textfield',
      },
    },
  }
})

export default useStyles
