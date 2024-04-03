import { makeStyles } from 'tss-react/mui'

type IStyleParams = {
  isError: boolean | undefined
}

const useStyles = makeStyles<{ params: IStyleParams }>({
  name: 'RequestQuote',
  uniqId: 'request_quote',
})((theme, { params }, classes) => {
  return {
    root: {},

    GridItem: {
      display: 'flex',
      flexDirection: 'column',
    },

    formControl: {
      minWidth: 'fit-content',
      width: '100%',

      '& fieldset': { border: 'none' },

      '& .MuiFormLabel-root': {
        color: '#4d4d4d',
        fontSize: '12px',
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: '16px',
        letterSpacing: '0.32px',
        marginBottom: 4,

        '& .MuiFormLabel-asterisk': {
          color: '#DA1E28',
        },
      },

      '& .MuiInputBase-root': {
        borderRadius: 8,
        '&:hover': {},

        '& input': {
          color: params.isError ? '#DA1E28' : '#161616',
          backgroundColor: '#f3f6f9',
          borderRadius: 8,
          border: 'none',
        },
      },

      '&:hover': {},
    },
  }
})

export default useStyles
