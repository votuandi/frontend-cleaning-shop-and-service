import { makeStyles } from 'tss-react/mui'

type IStyleParams = {}

const useStyles = makeStyles<{ params: IStyleParams }>({
  name: 'ProductDetail',
  uniqId: 'product_detail',
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

    container: {
      width: '100%',
      height: 'fit-content',
      display: 'flex',
      flexDirection: 'column',
    },

    imagesAndName: {
      width: '100%',
      height: 'fit-content',
      marginBottom: 16,
    },

    photoSide: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      width: '100%',
      position: 'relative',
    },

    arrowBtn: {
      filter: 'drop-shadow(1px 2px 3px rgba(0, 0, 0, 0.3))',
      padding: 5,
      backgroundColor: '#fff',
      borderRadius: '50%',
    },

    imageSlider: {
      width: '100%',
      height: 'fit-content',
      position: 'relative',
    },

    // nameSide: {

    // },

    fieldName: {
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: '500',
      lineHeight: 'normal',
      color: '#1a1a1a',
    },

    fieldContent: {
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: '400',
      lineHeight: 'normal',
      color: '#666',
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

    partTitle: {
      padding: '15px 24px',
      backgroundColor: '#F0F2F7',
      fontSize: '20px',
      fontWeight: '600',
      color: '#000',
      width: '100%',
    },

    detailTitle: {
      fontSize: '16px',
      fontWeight: '400',
      color: '#999',
    },

    detailContent: {
      fontSize: '16px',
      fontWeight: '400',
      color: '#1a1a1a',
    },
  }
})

export default useStyles
