import { makeStyles } from 'tss-react/mui'

type IStyleParams = {}

const useStyles = makeStyles<{ params: IStyleParams }>({
  name: 'ChoosePaymentMethod',
  uniqId: 'choose_payment_method',
})((theme, { params }, classes) => {
  return {
    root: {},
    labelContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    labelImage: {
      width: '32px',
      height: '32px',
      marginRight: '8px', // Adjust as needed
    },
  }
})

export default useStyles
