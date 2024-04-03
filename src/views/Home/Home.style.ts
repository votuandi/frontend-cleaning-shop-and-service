import { makeStyles } from 'tss-react/mui'

type IStyleParams = {}

const useStyles = makeStyles<{ params: IStyleParams }>({
  name: 'Home',
  uniqId: 'home',
})((theme, { params }, classes) => {
  return {
    root: {},
    slider: {
      '& .slick-dots': {
        bottom: 16,

        '& li': {
          margin: 0,
          '& button': {
            '&:before': {
              width: '15px',
              height: '15px',
              fontSize: '15px',
              color: '#B3B3B3',
            },
          },
        },

        '& .slick-active': {
          '& button': {
            '&:before': {
              color: 'white',
            },
          },
        },
      },
    },
    mainContent: {
      padding: '60px 24px 50px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 60,
    },
  }
})

export default useStyles
