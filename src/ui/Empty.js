import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import { Empty as AntEmpty } from 'antd'

const Empty = styled(AntEmpty)`
  color: ${th('colorText')};

  svg * {
    stroke: ${th('colorTextPlaceholder')};
  }

  svg ellipse {
    fill: ${th('colorBackgroundHue')};
    stroke: ${th('colorBackgroundHue')};
  }

  .ant-empty-description {
    color: ${th('colorText')};
  }
`

export default Empty
