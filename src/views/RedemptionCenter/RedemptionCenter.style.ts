import { makeStyles } from 'tss-react/mui'

type IStyleParams = {}

const useStyles = makeStyles<{ params: IStyleParams }>({
  name: 'RedemptionCenter',
  uniqId: 'redemption_center',
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
    customTextField: {
      backgroundColor: '#fff',
      width: '500px',

      color: '#1a1a1a',
      '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        height: '100%',
      },
      '& input::placeholder': {
        color: '#1a1a1a',
      },
      '& input': {
        color: '#1a1a1a',
        fontSize: '16px',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 'normal',
        padding: '6px 16px',
      },
    },

    filterBtns: {
      borderRadius: 8,
      borderColor: '#CCCCCC',
      backgroundColor: '#fff',
      width: 'fit-content',
      height: '100%',
      padding: '8px 16px',
      color: '#1a1a1a',
      fontStyle: 'normal',
      fontWeight: '500',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,

      '& svg': {
        width: 24,
        height: 24,
      },

      '& span': {
        color: '#1a1a1a',
      },
    },

    couponBtns: {
      borderRadius: 8,
      borderColor: '#0596A6',
      backgroundColor: '#fff',
      width: 'fit-content',
      height: '100%',
      padding: '8px 16px',
      color: '#0596A6',
      fontStyle: 'normal',
      fontWeight: '500',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,

      '& svg': {
        width: 24,
        height: 24,
      },

      '& span': {
        color: '#0596A6',
      },
    },

    typeFilterBtn: {
      padding: '12px 20px',
      backgroundColor: '#EFF7FA',
      borderRadius: 8,
      color: '#999999',
      boxShadow: 'none',

      '&:hover': {
        color: '#fff',
      },
    },

    typeFilterSelectedBtn: {
      padding: '12px 20px',
      backgroundColor: '#06455E',
      borderRadius: 8,
      color: '#fff',
      boxShadow: 'none',
    },

    leftContain: {
      padding: '30px 0 30px 20px',
    },

    rightContain: {
      padding: 30,
    },

    pickAmountTextField: {
      backgroundColor: '#fff',
      height: 40,
      zIndex: 0,
      width: 'fit-content',
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
  }
})

export default useStyles
