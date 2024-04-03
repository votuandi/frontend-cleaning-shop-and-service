import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles({
  name: 'AppAlert',
  uniqId: 'app_alert',
})((theme, _, classes) => {
  return {
    root: {
      position: 'fixed',
      width: '100vw',
      height: '100vh',
      backgroundColor: '#021F31F2',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }
})

export default useStyles
