const { isEmpty, kebabCase, keys, pickBy } = require('lodash')

const mapper = theme => {
  if (!theme) return {}

  const defaultMappings = {
    'primary-color': theme.colorPrimary,
    // 'normal-color': theme.colorSecondary,
    'disabled-color': theme.colorDisabled,
    'divider-color': theme.colorFurniture,

    'success-color': theme.colorSuccess,
    'warning-color': theme.colorWarning,
    'error-color': theme.colorError,

    'body-background': theme.colorBackground,
    'component-background': theme.colorBackground,

    'text-color': theme.colorText,
    'text-color-inverse': theme.colorTextReverse,
    'input-placeholder-color': theme.colorTextPlaceholder,

    'font-family': theme.fontInterface,

    'font-size-base': theme.fontSizeBase,
    'font-size-sm': theme.fontSizeBaseSmall,
    'heading-1-size': theme.fontSizeHeading1,
    'heading-2-size': theme.fontSizeHeading2,
    'heading-3-size': theme.fontSizeHeading3,
    'heading-4-size': theme.fontSizeHeading4,
    'heading-5-size': theme.fontSizeHeading5,

    'line-height-base': theme.lineHeightBase,

    'border-width-base': theme.borderWidth,
    'border-style-base': theme.borderStyle,
    'border-radius-base': theme.borderRadius,
    'border-color-base': theme.colorBorder,

    'box-shadow-base': theme.boxShadow,

    // 'animation-duration-slow': '0.3s', // Modal
    // 'animation-duration-base': theme.transitionDuration,
    // 'animation-duration-fast': '0.1s', // Tooltip
  }

  const output = pickBy(defaultMappings, i => !isEmpty(i))

  if (!theme.ant) return output

  keys(theme.ant).forEach(key => {
    output[kebabCase(key)] = theme.ant[key]
  })

  return output
}

module.exports = mapper
