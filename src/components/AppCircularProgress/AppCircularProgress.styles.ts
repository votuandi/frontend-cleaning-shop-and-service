import { makeStyles } from 'tss-react/mui'

export type IStyleParams = {}

const useStyles = makeStyles<{ params: IStyleParams }>({
  name: 'AppCircularProgress',
  uniqId: 'app_circular_progress',
})((theme, { params }, classes) => {
  return {}
})

export default useStyles
