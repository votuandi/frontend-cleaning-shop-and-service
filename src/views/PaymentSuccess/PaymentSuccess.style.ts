import { makeStyles } from 'tss-react/mui'

type IStyleParams = {}

const useStyles = makeStyles<{ params: IStyleParams }>({
  name: 'PaymentSuccess',
  uniqId: 'payment_success',
})((theme, { params }, classes) => {
  return {
    root: {},
  }
})

export default useStyles
