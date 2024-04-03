import { makeStyles } from 'tss-react/mui'

type IStyleParams = {}

const useStyles = makeStyles<{ params: IStyleParams }>({
  name: 'MyProfile',
  uniqId: 'my_profile',
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

    gridRow: {
      width: '100%',
    },

    gridColumn: {
      padding: '0 20px',
      borderRadius: 12,
      backgroundColor: '#fbfbfb',
      // backgroundColor: '#cdef12',
      display: 'flex',
      flexDirection: 'column',
    },

    rowItem: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 0',

      '& img': {
        width: 24,
        height: 24,
      },

      '& h3': {
        color: '#000',
        fontSize: 16,
        fontWeight: 500,
      },

      '& span': {
        color: '#FFB81A',
        fontSize: 16,
        fontWeight: 400,
      },
    },

    pointBtn: {
      color: '#0596A6',
      border: '1px solid #0596A6',
      borderRadius: 8,
      padding: 'auto 16px',
    },
  }
})

export default useStyles
