/* stylelint-disable string-quotes */

import { css, keyframes } from 'styled-components'
import { th } from '../../toolkit'

const checking = keyframes`
  0% {
    transform: scale(0.8);
  }

  20% {
    transform: scale(1.2);
  }

  80% {
    transform: scale(1);
  }

  100% {
    transform: scale(1);
  }
`

export default {
  Root: css`
    transition: all ${th('transitionDuration')};

    &:hover {
      span {
        color: ${props =>
          props.checked ? 'inherit' : props.theme.colorPrimary};

        &::before {
          animation-duration: ${th('transitionDuration')};
          animation-name: ${props => (props.checked ? 'none' : checking)};
          box-shadow: 0 0 0 ${th('borderWidth')}
            ${props =>
              props.checked ? 'currentColor' : props.theme.colorPrimary};
        }
      }
    }
  `,
  Label: css`
    font-style: italic;

    &::before {
      /* This is not a real border (box-shadow provides that), so not themed as such */
      background: ${props => (props.checked ? 'currentColor' : 'transparent')};
      border: calc(${th('gridUnit')} / 4) solid white;
      border-radius: 50%;
      box-shadow: 0 0 0 ${th('borderWidth')} currentColor;
      color: ${props => (props.color ? props.color : props.theme.colorText)};
      content: ' ';
      display: inline-block;
      height: calc(${th('gridUnit')} * 2);
      margin-left: ${th('gridUnit')};
      margin-right: ${th('gridUnit')};
      transition: border ${th('transitionDuration')}
        ${th('transitionTimingFunction')};
      vertical-align: middle;
      width: calc(${th('gridUnit')} * 2);
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
}
