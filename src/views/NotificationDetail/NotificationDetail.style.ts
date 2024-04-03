import { makeStyles } from 'tss-react/mui'

type IStyleParams = {}

const useStyles = makeStyles<{ params: IStyleParams }>({
  name: 'NotificationDetail',
  uniqId: 'notification_detail',
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
  }
})

export default useStyles
