import { css } from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

export default {
  // TODO
  // -- input padding: breaking the grid?
  // -- small placeholder text? maybe by default?
  Input: css`
    border-color: ${props => {
      switch (props.validationStatus) {
        case 'success':
          return props.theme.colorSuccess
        case 'warning':
          return props.theme.colorWarning
        case 'error':
          return props.theme.colorError
        default:
          return props.theme.colorBorder
      }
    }};
    border-style: dashed;
    border-width: 0 0 1px 0;
    color: ${props => {
      switch (props.validationStatus) {
        case 'success':
          return props.theme.colorSuccess
        case 'warning':
          return props.theme.colorWarning
        case 'error':
          return props.theme.colorError
        default:
          return 'inherit'
      }
    }};
    height: calc(${th('gridUnit')} * 8);
    outline: 0;
    padding: 0 0 0 2px;
    transition: ${th('transitionDuration')} ${th('transitionTimingFunction')};

    &:focus {
      border-color: ${th('colorPrimary')};
      color: inherit;
    }

    &::placeholder {
      font-size: ${th('fontSizeBaseSmall')};
      line-height: ${th('lineHeightBaseSmall')};
    }
  `,
}
