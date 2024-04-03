import { makeStyles } from 'tss-react/mui'

type IStyleParams = {}

const useStyles = makeStyles<{ params: IStyleParams }>({
  name: 'PaymentFailed',
  uniqId: 'payment_failed',
})((theme, { params }, classes) => {
  return {
    root: {},
  }
})

export default useStyles
