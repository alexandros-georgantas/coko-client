import 'fontsource-advent-pro'

const theme = {
  colorBackground: '#fefae0',
  colorBorder: 'lightslategray',
  colorPrimary: '#606c38',

  fontInterface: 'Advent Pro',
  fontSize: '16',
  fontSizeBase: '16px',
  lineHeight: '1.618',

  gridUnit: '8px',

  ...window.env?.themeOverrides,
}

export default theme
