import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles({
  name: 'AppFilterPanel',
  uniqId: 'app_filter_panel',
})((theme, _, classes) => {
  return {
    root: {
      width: 300,
      display: 'flex',
      flexDirection: 'column',
      filter: 'drop-shadow(0px 4px 4px rgba(149, 157, 165, 0.3))',
    },
  }
})

export default useStyles
