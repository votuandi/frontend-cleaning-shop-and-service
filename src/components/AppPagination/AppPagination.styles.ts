import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles({
  name: 'AppPagination',
  uniqId: 'app_pagination',
})((theme, _, classes) => {
  return {
    root: {
      '& button': {
        padding: '7px 14px',
        color: '#202020',
        textAlign: 'center',
        fontSize: '14px',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 'normal',
      },

      '& .Mui-selected': {
        border: '1px solid #0596A6',
        borderRadius: 8,
        backgroundColor: 'transparent',
      },
    },
  }
})

export default useStyles
1
