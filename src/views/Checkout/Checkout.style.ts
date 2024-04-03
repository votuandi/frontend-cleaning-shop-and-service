import { makeStyles } from 'tss-react/mui'

type IStyleParams = {}

const useStyles = makeStyles<{ params: IStyleParams }>({
  name: 'Checkout',
  uniqId: 'check_out',
})((theme, { params }, classes) => {
  return {
    root: {},
    showPerPage: {
      borderRadius: 8,

      '& .MuiSelect-select': {
        padding: '5px 10px',
        color: '#1A1A1A',
      },
    },

    pickAmountTextField: {
      backgroundColor: '#fff',
      height: 40,
      zIndex: 0,
      width: 'fit-content',
      border: '1px solid #ccc',
      borderRadius: 8,

      '& .MuiFilledInput-root': {
        backgroundColor: '#fff',
        borderRadius: 8,
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
        width: 40,
      },

      '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {
        '-webkit-appearance': 'none',
        margin: 0,
      },
      '& input[type=number]': {
        '-moz-appearance': 'textfield',
      },
    },

    smallPickAmountTextField: {
      backgroundColor: '#fff',
      height: 20,
      zIndex: 0,
      width: 'fit-content',
      // border: '1px solid #ccc',
      borderRadius: 8,

      '& .MuiFilledInput-root': {
        backgroundColor: '#fff',
        borderRadius: 8,
      },

      '& fieldset': {
        border: 'none',
      },

      '& input': {
        color: '#000',
        fontSize: '14px',
        fontStyle: 'normal',
        fontWeight: '500',
        lineHeight: 'normal',
        borderRadius: 4,
        textAlign: 'center',
        padding: 0,
        width: 20,
      },

      '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {
        '-webkit-appearance': 'none',
        margin: 0,
      },
      '& input[type=number]': {
        '-moz-appearance': 'textfield',
      },
    },
    couponContainer: {
      width: '100%',
      marginTop: '24px',
    },
  }
})

export default useStyles
