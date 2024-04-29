/* stylelint-disable string-quotes */

import { css } from 'styled-components'
import { th } from '../../toolkit'

// const checking = keyframes`
//   0% {
//     transform: scale(0.8);
//   }

//   20% {
//     transform: scale(1.2);
//   }

//   80% {
//     transform: scale(1);
//   }

//   100% {
//     transform: scale(1);
//   }
// `

const localBorderSize = '3px'
const localBorderTwoSize = '1px'

export default {
  Label: css`
    font-size: 1.1em;
    font-style: italic;
    letter-spacing: 1px;
    transition: color 0.5s;

    &::before {
      background: ${props => (props.checked ? 'currentColor' : 'transparent')};
      border: ${localBorderSize} solid white;
      box-shadow: 0 0 0 ${localBorderTwoSize} currentColor;
      content: ' ';
      display: inline-block;
      height: 0.7em;
      margin-right: 0.5em;
      transition: border 0.5s ease, background-size 0.3s ease;
      vertical-align: middle;
      width: 0.7em;
    }
  `,
  Input: css`
    opacity: 0;
    position: absolute;
    z-index: -1;

    &:focus + span::before {
      box-shadow: 0 0 ${th('borderWidth')} calc(${th('borderWidth')} * 2)
        ${th('colorPrimary')};
    }
  `,
  Root: css`
    transition: all 2s;

    &:hover span {
      color: ${th('colorPrimary')};

      &::before {
        box-shadow: 0 0 0 ${localBorderTwoSize} ${th('colorPrimary')};
      }
    }
  `,
}
