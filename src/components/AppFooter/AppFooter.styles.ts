import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles({
  name: 'AppHeader',
  uniqId: 'app_header',
})((theme, _, classes) => {
  return {
    root: {
      backgroundImage: 'url(/img/bg-footer.jpg)',
      backgroundSize: 'cover',
    },
  }
})

export default useStyles
