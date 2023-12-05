import {
  Action,
  ActionGroup,
  AppBar,
  Button,
  Checkbox,
  GlobalStyle,
  Radio,
  TextField,
  Menu,
  Logo,
} from './elements'

const defaultFont =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'

const cokoTheme = {
  /* Colors */
  colorBackground: 'white',
  colorBackgroundHue: '#F1F1F1', // deprecate
  colorFurniture: '#CCC', // deprecate

  colorPrimary: '#0B65CB',
  colorSecondary: '#E7E7E7',
  colorDisabled: '#595959',
  colorBorder: '#AAA',

  colorSuccess: '#008800',
  colorError: '#FF2D1A',
  colorWarning: '#ffc107',

  colorText: '#111',
  colorTextReverse: '#FFF',
  colorTextPlaceholder: '#595959',

  /* Text variables */

  // fonts
  fontInterface: defaultFont,
  fontHeading: defaultFont,
  fontReading: defaultFont,
  fontWriting: defaultFont, // deprecate

  // font sizes
  fontSizeBase: '16px',
  fontSizeBaseSmall: '14px', // rename to fontSizeSmall
  fontSizeHeading1: '40px',
  fontSizeHeading2: '36px',
  fontSizeHeading3: '28px',
  fontSizeHeading4: '24px',
  fontSizeHeading5: '20px',
  fontSizeHeading6: '16px',

  // line heights
  lineHeightBase: '24px',
  lineHeightBaseSmall: '16px', // rename to lineHeightSmall
  lineHeightHeading1: '48px',
  lineHeightHeading2: '40px',
  lineHeightHeading3: '32px',
  lineHeightHeading4: '32px',
  lineHeightHeading5: '24px',
  lineHeightHeading6: '24px',

  /* Spacing */
  gridUnit: '8px',

  /* Border */
  borderRadius: '0',
  borderWidth: '1px', // julien: not 0
  borderStyle: 'solid',

  // Does not exist
  // $borderColor: var($colorFurniture);

  /* Shadow (for tooltip) */
  boxShadow: '0 2px 4px 0 rgba(51, 51, 51, 0.3)',

  /* Transition */
  transitionDuration: 0.2,
  transitionTimingFunction: 'ease',
  transitionDelay: '0',

  /* Breakpoints */
  // breakpoints: [480, 768, 1000, 1272],

  // TO DO: Revisit the need for any of these
  cssOverrides: {
    Login: {
      Logo,
    },
    ui: {
      Action,
      ActionGroup,
      AppBar,
      Button,
      Checkbox,
      GlobalStyle,
      Radio,
      TextField,
      Menu,
    },
  },
}

export default cokoTheme
