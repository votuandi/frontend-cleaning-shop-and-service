import { makeStyles } from 'tss-react/mui'

type IStyleParams = {}

const useStyles = makeStyles<{ params: IStyleParams }>({
  name: 'News',
  uniqId: 'news',
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

    leftContain: {
      padding: '30px 0 30px 20px',
    },

    rightContain: {
      padding: 30,
    },
  }
})

export default useStyles
