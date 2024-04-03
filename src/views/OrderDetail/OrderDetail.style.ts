import { makeStyles } from 'tss-react/mui'

type IStyleParams = {}

const useStyles = makeStyles<{ params: IStyleParams }>({
  name: 'OrderDetail',
  uniqId: 'order_detail',
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

    container: {
      width: '100%',
      height: 'fit-content',
      display: 'flex',
      flexDirection: 'column',
    },

    gridContainer: {
      width: '100%',
      height: 'fit',
    },

    topItem: {
      padding: '14px 20px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#F0F2F7',
      border: '1px solid #ccc',

      '& img': {
        width: '32px',
        height: '32px',
      },
    },

    topTexts: {
      width: 'fit-content',
      height: 'fit-content',
      display: 'flex',
      flexDirection: 'column',
      // gap: '8px',
      alignItems: 'start',
    },

    topItemTitle: {
      color: '#808080',
      fontSize: '12px',
      fontWeight: 400,
    },

    topItemValue: {
      color: '#1A1A1A',
      fontSize: '16px',
      fontWeight: 500,
      marginTop: '8px',
    },

    botTitle: {
      padding: '8px 24px',
      backgroundColor: '#F8FBFE',
      color: '#666666',
      fontSize: '16px',
      fontWeight: 600,
      textAlign: 'left',
    },

    botContentItem: {
      padding: '2px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      alignItems: 'start',
      justifyContent: 'center',
    },
  }
})

export default useStyles
