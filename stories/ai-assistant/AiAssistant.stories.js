/* stylelint-disable color-hex-case */
import React from 'react'
import { createGlobalStyle } from 'styled-components'
import { CssAssistantProvider } from '../../src/components/component-ai-assistant/hooks/CssAssistantContext'
import AiPDFDesigner from '../../src/components/component-ai-assistant/AiPDFDesigner'
import {
  initialPagedJSCSS,
  loadFromLs,
} from '../../src/components/component-ai-assistant/utils'

const GlobalStyle = createGlobalStyle`
  #root {
    --color-yellow: #FBCD55;
    --color-yellow-dark: #a27400;
    --color-orange: #FE7B4D;
    --color-orange-dark: #9c4b2e;
    --color-green: #6FAB6A;
    --color-green-dark: #558151;
    --color-blue: #21799E;
    --color-blue-alpha: #21799e52;
    --color-blue-dark: #154a61;
    --color-fill: #50737c;
    --color-fill-1: #6a919b;
    --color-fill-2: #fff;
    height: calc(100vh - 10px);
  }

  body,
  html,
  html > body.sb-show-main body.sb-main-padded {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  * :not(div#assistant-ctx) {
    box-sizing: inherit;
    font-family: Arial, Helvetica, sans-serif;
  }

  div#assistant-ctx * {
    font-family: inherit; /* Reset the font for children */
  }
`

export const AiAssistantStory = () => {
  const passedSettings = loadFromLs('storedsession')?.settings
  return (
    <CssAssistantProvider>
      <GlobalStyle />
      <AiPDFDesigner
        passedCss={initialPagedJSCSS}
        passedSettings={passedSettings}
      />
    </CssAssistantProvider>
  )
}

export default {
  component: AiAssistantStory,
  title: 'AI PDF Designer/AI PDF Designer',
}
