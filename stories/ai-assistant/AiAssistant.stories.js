import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { CssAssistantProvider } from '../../src/components/component-ai-assistant/hooks/CssAssistantContext'
import AiPDFDesigner from '../../src/components/component-ai-assistant/AiPDFDesigner'

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`

/* stylelint-disable indentation */
const Global = createGlobalStyle`
  body,
  html,
  #root {
    height: 100%;
}
/* stylelint-enable indentation */
`

const settings = {
  advancedTools: true,
  editor: {
    contentEditable: true,
    enablePaste: true,
  },
}

export const AiAssistantStory = () => {
  return (
    <CssAssistantProvider>
      <Global />
      <Wrapper>
        <AiPDFDesigner settings={settings} />
      </Wrapper>
    </CssAssistantProvider>
  )
}

export default {
  component: AiAssistantStory,
  title: 'AI PDF Designer/AI PDF Designer',
}
