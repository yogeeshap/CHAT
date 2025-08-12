import { createTheme, Zoom } from '@mui/material'
import type {} from '@mui/x-data-grid/themeAugmentation'

// canot import rootElement from index.tsx file as it will create a dep cycle loop
const rootElement = document.getElementById('root')

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#ffffff',
    },
    error: {
      main: '#CC3333',
    },
    info: {
      main: '#0000A0',
    },
    success: {
      main: '#669966',
    },
    warning: {
      main: '#FFCC00',
    },
  },
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    // Optional: base typography config
    body1: {
      color: 'black', // sets default for variant="body1"
    },
  },
  components: {

    MuiTypography:{

        styleOverrides: {
        root: {
            color: 'black'
        },
    },
        variants: [
        {
          props: { variant: 'body1' },
          style: {
            color: 'black', // Applies only to Typography with variant="body1"
          },
        },
      ],
    
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
          textTransform: 'none',
          color:'#11c111 !important',
          backgroundColor:'#eded567d !important'
        },
        text: {
          fontWeight: 'bold',
          textTransform: 'none',

        },
        contained: {
          fontWeight: 'bold',
          textTransform: 'none',
          backgroundColor: '#0000A0',
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: '12px',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '12px',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: { fontSize: '12px' },
        input: {
          fontSize: '12px',
          '&::placeholder': {
            opacity: 1,
            color: 'rgba(0, 0, 0, 0.6)',
            fontWeight: '400',
            fontSize: '12px',
            lineHeight: '1.66',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          '& .MuiButton-root:hover': {
            color: 'black',
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        selectLabel: {
          color: '#8A8A8A',
        },
        displayedRows: {
          fontWeight: 600,
        },
        // actions: {
        //   color: '#000000',
        // },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
            fontFamily: "'Roboto', sans-serif",
          scrollbarColor: '#c1c1c1 #f1f1f1',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            backgroundColor: '#f1f1f1',
            width: '9px',
            height: '9px',
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: '#c1c1c1',
            minHeight: 24,
            border: '3px solid #f1f1f1',
          },
          '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus':
            {
              backgroundColor: '#999999',
            },
          '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active':
            {
              backgroundColor: '#999999',
            },
          '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover':
            {
              backgroundColor: '#999999',
            },
          '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
            backgroundColor: '#f1f1f1',
          },
        },
         html: {
          fontSize: '12px',
        },
      },
    },
    MuiModal: {
      defaultProps: {
        container: rootElement, // so that tailwind css would be applied, as by default it renders outside the root container
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        columnHeaders: {
          backgroundColor: '#F8F8F8',
        },
        columnHeader: {
          backgroundColor: '#F8F8F8',
          outline: 'transparent',
          ':focus-within': {
            outline: 'none',
          },
          ':focus': {
            outline: 'none',
          },
        },
        cell: {
          outline: 'transparent',
          ':focus-within': {
            outline: 'none',
          },
          ':focus': {
            outline: 'none',
          },
        },
        // 'cell--editing': {
        //   outline: 'transparent',
        //   ':focus-within': {
        //     outline: 'none',
        //   },
        //   ':focus': {
        //     outline: 'none',
        //   },
        // },
        columnHeaderTitle: {
          color: '#666666',
          fontWeight: '700',
          whiteSpace: 'break-spaces',
          lineHeight: 1,
        },
        row: {
          ':hover': { backgroundColor: 'unset' },
        },
        // cellContent: {
        //   fontSize: '12px',
        //   textWrap: 'nowrap',
        // },
        columnHeaderTitleContainer: {
          fontSize: '12px',
        },
      },
    },
    MuiFab: {
        defaultProps: {
        size: 'medium',
      },
      styleOverrides: {
        root: {
          minWidth: 30,         // set your global width here
          minHeight: 30,
          width: 30,         // set your global width here
          height: 30,
          color:'#11c111 !important',
          backgroundColor:'#eded567d !important'
        },
      },
    },

    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 30,
          '@media (min-width:600px)': {
            minHeight: 50,
          },
        },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 30,
          height: 30,
          color:'#11c111 !important',
          backgroundColor:'#eded567d !important'
        },
      },
    },
  }
})
