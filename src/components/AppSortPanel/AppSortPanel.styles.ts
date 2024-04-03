import { useMediaQuery } from '@mui/material'
import { makeStyles } from 'tss-react/mui'

export type IStyleParams = {}

const useStyles = makeStyles<{ params: IStyleParams }>({
  name: 'AppSortPanel',
  uniqId: 'app_sort_panel',
})((theme, { params }, classes) => {
  return {
    // root: {
    //   width: useMediaQuery(theme.breakpoints.down(320)) ? '240px' : '300px',
    //   display: 'flex',
    //   flexDirection: 'column',
    //   filter: 'drop-shadow(0px 4px 4px rgba(149, 157, 165, 0.3))',
    // },
    // container: {
    //   width: useMediaQuery(theme.breakpoints.down(320)) ? '240px' : '300px',
    //   height: 'fit-content',
    //   backgroundColor: '#fff',
    //   marginTop: '-4px',
    //   borderRadius: '16px',
    //   display: 'flex',
    //   flexDirection: 'column',
    // },
  }
})

export default useStyles
