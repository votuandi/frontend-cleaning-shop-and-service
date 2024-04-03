import { useMediaQuery } from '@mui/material'
import { makeStyles } from 'tss-react/mui'

type IStyleParams = {}

const useStyles = makeStyles<{ params: IStyleParams }>({
  name: 'AllService',
  uniqId: 'all_service',
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

      // '& .MuiButton-startIcon': {
      //   margin: useMediaQuery(theme.breakpoints.down(800)) ? 0 : 'auto',
      // },
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

    // leftContain: {
    //   padding: useMediaQuery(theme.breakpoints.down(800)) ? '16px' : '30px 0 30px 20px',
    //   width: useMediaQuery(theme.breakpoints.down(800)) ? '100%' : '260px',
    //   flexShrink: 0,
    // },

    // rightContain: {
    //   padding: useMediaQuery(theme.breakpoints.down(800)) ? '16px' : '30px',
    //   // width: '100%',
    // },
    searchBox: {
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
    contentContainer: {
      // width: useMediaQuery(theme.breakpoints.down(800)) ? '100vh' : '100%',
      // height: 'fit-content',
      // backgroundColor: '#FBFBFB',
      // margin: useMediaQuery(theme.breakpoints.down(800)) ? '0 -24px' : '0',
      // display: 'flex',
      // flexDirection: useMediaQuery(theme.breakpoints.down(800)) ? 'column' : 'row',
      // justifyContent: 'start',
      // alignItems: 'start',
    },
  }
})

export default useStyles
