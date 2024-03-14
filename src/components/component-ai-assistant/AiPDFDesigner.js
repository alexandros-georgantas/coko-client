import React, { useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { InteractionOutlined, PrinterOutlined } from '@ant-design/icons'

import Editor from './components/Editor'
import CssAssistant from './CssAssistant'
import {
  srcdoc,
  initialPagedJSCSS,
  htmlTagNames,
  cssTemplate1,
  cssTemplate3,
  setScrollFromPercent,
  getScrollPercent,
  setInlineStyle,
  addElement,
} from './utils'
import SelectionBox from './SelectionBox'
import { CssAssistantContext } from './hooks/CssAssistantContext'
import ChatBubble from './ChatBubble'
import ChatHistory from './ChatHistory'
import Checkbox from './components/Checkbox'
import useChatGpt from './hooks/useChatGpt'

const Assistant = styled(CssAssistant)`
  margin: 10px 0;
  width: 480px;
`

const CssAssistantUi = styled.div`
  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  padding: 0 5px;
`

const StyledHeading = styled.div`
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #0004;
  display: flex;
  flex-direction: row;
  height: fit-content;
  justify-content: space-between;
  padding: 0 0 0 10px;
  scrollbar-color: #00495c;
  scrollbar-width: thin;
  width: 100%;
`

const Root = styled.div`
  border: 1px solid #0002;
  border-radius: 0 8px 8px;
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-top: -1px;
  overflow: hidden;
  position: relative;
  width: 100%;
`

const EditorContainer = styled.div`
  background: #eee;
  display: flex;
  height: 100%;
  overflow: auto;
  padding: 40px;
  position: relative;
  transition: width 0.5s;
  user-select: none;

  ::-webkit-scrollbar {
    height: 5px;
    width: 5px;
  }

  ::-webkit-scrollbar-thumb {
    background: #00495c;
    border-radius: 5px;
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background: #fff0;
    padding: 5px;
  }
`

const PreviewIframe = styled.iframe`
  border: none;
  display: flex;
  height: 100%;
  width: 100%;
`

const CheckBoxes = styled.div`
  border-left: 1px solid #0002;
  color: #555;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  line-height: 1.3;
  min-width: 150px;
  padding: 0;

  > span {
    padding: 5px 10px;
  }
`

const WindowsContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`

const StyledWindow = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.5s ease;
  width: ${p => (p.$show ? '100%' : '0')};
`

const WindowHeading = styled.div`
  align-items: center;
  background-color: #efefef;
  box-shadow: inset 0 0 5px #fff4, 0 0 2px #0009;
  color: #777;
  display: flex;
  font-size: 12px;
  font-weight: bold;
  justify-content: space-between;
  line-height: 1;
  min-height: 23px;
  padding: 2px 10px;
  white-space: nowrap;
  z-index: 99;

  > :first-child {
    color: #aaa;
  }
`

const WindowDivision = styled.div`
  background-color: #fff;
  height: 100%;
  outline: 1px solid #0004;
  width: 5px;
  z-index: 999;
`

const StyledRefreshButton = styled.span`
  align-items: center;
  display: flex;
  gap: 5px;

  button {
    align-items: center;
    background: #fff0;
    border: none;
    border-right: 1px solid #0002;
    cursor: pointer;
    display: flex;
    justify-content: center;
    margin: 0;
    padding: 0;
    padding-right: 4px;
    width: 20px;
  }

  svg {
    height: 15px;
    stroke: #777;
    width: 15px;

    &:hover {
      stroke: #00495c;
    }
  }
`

const StyledCheckbox = styled(Checkbox)``

// eslint-disable-next-line react/prop-types
const AiPDFDesigner = ({ bookTitle, settings }) => {
  const {
    css,
    htmlSrc,
    setSelectedCtx,
    setSelectedNode,
    context,
    selectedCtx,
    passedContent,
    updateSelectionBoxPosition,
    styleSheetRef,
    setCss,
    selectedNode,
    setFeedback,
    setUserPrompt,
    addRules,
  } = useContext(CssAssistantContext)

  const previewScrollTopRef = useRef(0)
  const previewRef = useRef(null)
  const [previewSource, setPreviewSource] = useState(null)
  const [livePreview, setLivePreview] = useState(true)
  const [showEditor, setShowEditor] = useState(true)
  const [showPreview, setShowPreview] = useState(true)
  const [showChat, setShowChat] = useState(false)

  const { callOpenAi, loading, error } = useChatGpt({
    onCompleted: chatGPTContent => {
      if (chatGPTContent.startsWith('{')) {
        try {
          const response = JSON.parse(chatGPTContent)

          const {
            css: resCss,
            rules,
            feedback,
            textContent = '',
            insertHtml,
          } = response

          const ctxIsHtmlSrc = selectedCtx.node === htmlSrc

          if (rules && !ctxIsHtmlSrc) {
            addRules(selectedCtx, rules)
            setInlineStyle(selectedCtx.node, rules)
          } else if (resCss) {
            styleSheetRef.current.textContent = resCss
            setCss(styleSheetRef.current.textContent)
          }

          insertHtml && addElement(selectedNode, insertHtml)
          textContent && (selectedCtx.node.innerHTML = textContent)
          feedback && setFeedback(feedback)
          feedback &&
            selectedCtx.history.push({ role: 'assistant', content: feedback })
          updatePreview()
        } catch (err) {
          setFeedback(
            'There was an error generating the response\n Please, try again in a few seconds',
          )
        }
      } else {
        setFeedback(
          'There was an error generating the response\n Please, try again in a few seconds',
        )
      }

      setUserPrompt('')
    },
  })
  // const [callOpenAi, { loading }] = useLazyQuery(CALL_OPEN_AI, {
  //   onCompleted: ({ openAi }) => {
  //     if (openAi.startsWith('{')) {
  //       try {
  //         const response = JSON.parse(openAi)
  //         const { css, rules, feedback, textContent = '' } = response
  //         const ctxIsHtmlSrc = selectedCtx.node === htmlSrc

  //         if (rules && !ctxIsHtmlSrc) {
  //           addRules(selectedCtx, rules)
  //           setInlineStyle(selectedCtx.node, rules)
  //         } else if (css) {
  //           styleSheetRef.current.textContent = css
  //           setCss(styleSheetRef.current.textContent)
  //         }

  //         textContent && (selectedCtx.node.innerHTML = textContent)
  //         feedback && setFeedback(feedback)
  //         feedback &&
  //           selectedCtx.history.push({ role: 'assistant', content: feedback })
  //         updatePreview()
  //       } catch (err) {
  //         setFeedback(
  //           'There was an error generating the response\n Please, try again in a few seconds',
  //         )
  //       }
  //     } else {
  //       setFeedback(openAi)
  //       selectedCtx.history.push({ role: 'assistant', content: openAi })
  //     }

  //     setUserPrompt('')
  //   },
  // })

  useEffect(() => {
    showPreview && livePreview && updatePreview()
  }, [htmlSrc, css, passedContent])

  useEffect(() => {
    showPreview && updatePreview()
    !showPreview && !showEditor && setShowEditor(true)
  }, [showPreview])

  useEffect(() => {
    if (!showEditor) {
      setSelectedCtx(context.current.find(ctx => ctx.node === htmlSrc))
      setSelectedNode(htmlSrc)
      !showPreview && setShowPreview(true)
    }

    updatePreview()
  }, [showEditor])

  useEffect(() => {
    error && setFeedback(JSON.stringify(error))
  }, [error])

  const handleScroll = e => {
    const iframeElement = previewRef?.current?.contentDocument?.documentElement
    if (!iframeElement) return
    const percentage = Math.round(getScrollPercent(e.target))
    iframeElement.scrollTo(0, setScrollFromPercent(iframeElement, percentage))
  }

  const updatePreview = () => {
    previewRef?.current?.contentDocument?.documentElement &&
      previewRef?.current?.contentDocument?.documentElement?.scrollTop > 0 &&
      (previewScrollTopRef.current =
        previewRef.current.contentDocument.documentElement.scrollTop)

    css &&
      htmlSrc?.outerHTML &&
      setPreviewSource(
        srcdoc(
          htmlSrc,
          css,
          cssTemplate1 + cssTemplate3,
          previewScrollTopRef.current,
        ),
      )
    updateSelectionBoxPosition()
  }

  return (
    <Root>
      <StyledHeading>
        <CssAssistantUi>
          <ChatBubble forceHide={showChat} onRight />
          <Assistant
            callOpenAi={callOpenAi}
            enabled
            loading={loading}
            placeholder="Type here how your book should look..."
          />
        </CssAssistantUi>
        <CheckBoxes>
          <span>
            <StyledCheckbox
              checked={showEditor || (!showPreview && !showEditor)}
              handleChange={() => setShowEditor(!showEditor)}
              id="showContent"
              label="Content"
              style={{ margin: 0 }}
            />
            <StyledCheckbox
              checked={showPreview}
              handleChange={() => setShowPreview(!showPreview)}
              id="showPreview"
              label="Book Preview"
              style={{ margin: 0 }}
            />
            <StyledCheckbox
              checked={showChat}
              handleChange={() => setShowChat(!showChat)}
              id="showChatHistory"
              label="Chat History"
              style={{ margin: 0 }}
            />
          </span>
        </CheckBoxes>
      </StyledHeading>
      <WindowsContainer>
        <StyledWindow $show={showChat} style={{ maxWidth: '30%' }}>
          <WindowHeading>
            <span>CHAT HISTORY</span>
          </WindowHeading>
          <ChatHistory />
        </StyledWindow>
        {showChat && (showEditor || showPreview) && <WindowDivision />}

        <StyledWindow $show={showEditor}>
          <WindowHeading>
            <span>
              CONTENT SELECTION{bookTitle ? ` for: "${bookTitle}"` : ':'}
            </span>
            <span>
              Selection:{' '}
              {selectedCtx?.node && selectedCtx.node !== htmlSrc
                ? htmlTagNames[selectedCtx.tagName]
                : 'Book'}
            </span>
          </WindowHeading>
          <EditorContainer onScroll={handleScroll}>
            <Editor
              passedContent={passedContent}
              stylesFromSource={initialPagedJSCSS}
              updatePreview={updatePreview}
              // eslint-disable-next-line react/prop-types
              {...settings?.editor}
            />
            <SelectionBox
              // eslint-disable-next-line react/prop-types
              advancedTools={settings?.advancedTools}
              updatePreview={updatePreview}
            />
          </EditorContainer>
        </StyledWindow>
        {showEditor && showPreview && <WindowDivision />}
        <StyledWindow $show={showPreview}>
          <WindowHeading>
            <span>BOOK PREVIEW{bookTitle ? ` for: "${bookTitle}"` : ':'}</span>
            <StyledRefreshButton>
              <button
                onClick={updatePreview}
                title="Update preview"
                type="button"
              >
                <InteractionOutlined />
              </button>
              <button
                onClick={() => previewRef?.current?.contentWindow?.print()}
                title="Print"
                type="button"
              >
                <PrinterOutlined />
              </button>
              <StyledCheckbox
                checked={livePreview}
                handleChange={() => setLivePreview(!livePreview)}
                id="livePreview"
                label="Live preview"
                style={{ margin: 0 }}
              />
            </StyledRefreshButton>
          </WindowHeading>
          <PreviewIframe
            onLoad={updatePreview}
            ref={previewRef}
            srcDoc={previewSource}
            title="Book preview"
          />
        </StyledWindow>
      </WindowsContainer>
    </Root>
  )
}

export default AiPDFDesigner
