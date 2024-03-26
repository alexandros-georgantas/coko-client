import React, { useContext, useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { DeleteOutlined, PrinterOutlined } from '@ant-design/icons'

import { merge, takeRight } from 'lodash'
import Editor from './components/Editor'
import PromptsInput from './PromptsInput'
import {
  srcdoc,
  initialPagedJSCSS,
  htmlTagNames,
  cssTemplate1,
  cssTemplate3,
  setScrollFromPercent,
  getScrollPercent,
  addElement,
  finishReasons,
  systemGuidelinesV2,
  snippetsToCssText,
  removeStyleAttribute,
} from './utils'
import SelectionBox from './SelectionBox'
import { CssAssistantContext } from './hooks/CssAssistantContext'
import ChatBubble from './ChatBubble'
import ChatHistory from './ChatHistory'
import Checkbox from './components/Checkbox'
import useChatGpt from './hooks/useChatGpt'
import { SettingsMenu } from './components/SettingsMenu'

// #region styleds
const Assistant = styled(PromptsInput)`
  margin: 10px 0;
  width: 480px;
`

const editorLoadingAnim = keyframes`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 1;
  }
`

const CssAssistantUi = styled.div`
  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  padding: 0 5px;

  > :last-child {
    color: #00495c;
    display: flex;
    gap: 0;
  }
`

const StyledHeading = styled.div`
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #0004;
  display: flex;
  flex-direction: row;
  height: 80px;
  justify-content: space-between;
  padding: 0 0 0 10px;
  position: relative;
  scrollbar-color: #00495c;
  scrollbar-width: thin;
  width: 100%;
  z-index: 999999;
`

const Root = styled.div`
  --color-fill: #50737c;
  --color-fill-1: #6a919b;
  --color-fill-2: #fff;

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
  filter: ${p => (p.$loading ? 'blur(2px)' : '')};
  height: calc(100vh - 130px);
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
  height: calc(100vh - 130px);

  width: 100%;
`

const CheckBoxes = styled.div`
  align-items: center;
  border-left: 1px solid #0002;
  color: #555;
  display: flex;
  font-size: 14px;
  line-height: 1.3;
  min-width: 150px;
  padding: 0;

  > span {
    height: fit-content;
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
  position: relative;
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

  svg {
    fill: #00495c;
    stroke: #00495c;
  }

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

const LoadingOverlay = styled.div`
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: 9999;
`

const OverlayAnimated = styled(LoadingOverlay)`
  align-items: center;
  background: #fff6;
  display: flex;
  justify-content: center;
  opacity: ${p => (p.$loading ? 1 : 0)};
  pointer-events: none;
  transition: opacity 1.5s;

  > span {
    animation: ${p => (p.$loading ? editorLoadingAnim : 'none')} 1.5s infinite;
    color: #00495c;
    font-size: 40px;
  }
`

const StyledCheckbox = styled(Checkbox)``

// #endregion styleds

// eslint-disable-next-line react/prop-types
const AiPDFDesigner = ({ bookTitle, passedSettings }) => {
  const {
    css,
    htmlSrc,
    setSelectedCtx,
    setSelectedNode,
    selectedCtx,
    passedContent,
    updateSelectionBoxPosition,
    styleSheetRef,
    setCss,
    selectedNode,
    setFeedback,
    setUserPrompt,
    addSnippet,
    onHistory,
    getValidSelectors,
    history,
    clearHistory,
    updateCtxNodes,
    userPrompt,
    getCtxBy,
    validSelectors,
    settings,
    setSettings,
    markedSnippet,
  } = useContext(CssAssistantContext)

  const previewScrollTopRef = useRef(0)
  const previewRef = useRef(null)
  const [previewSource, setPreviewSource] = useState(null)
  const [livePreview, setLivePreview] = useState(true)
  const [showEditor, setShowEditor] = useState(true)
  const [showPreview, setShowPreview] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  // eslint-disable-next-line no-unused-vars
  // To be replaced by the lazyQuery
  const { callOpenAi, loading, error } = useChatGpt({
    onCompleted: ({ message, finishReason }) => {
      if (message.startsWith('{')) {
        try {
          const response = JSON.parse(message)

          const {
            css: resCss,
            snippet,
            feedback,
            content = '',
            insertHtml,
          } = response

          if (resCss || insertHtml || snippet || content) {
            onHistory.addRegistry('undo')
            history.current.source.redo = []
          }

          const ctxIsHtmlSrc = selectedCtx.node === htmlSrc

          if (snippet && !ctxIsHtmlSrc) {
            addSnippet(selectedCtx.node, snippet)
          } else if (resCss) {
            styleSheetRef.current.textContent = resCss
            setCss(styleSheetRef.current.textContent)
          }

          insertHtml && addElement(selectedNode, insertHtml)
          content && (selectedCtx.node.innerHTML = content)
          feedback && setFeedback(feedback)
          feedback &&
            selectedCtx.history.push({ role: 'assistant', content: feedback })

          updatePreview()
        } catch (err) {
          if (finishReasons[finishReason]) {
            setFeedback(finishReasons[finishReason])
            selectedCtx.history.push({
              role: 'assistant',
              content: finishReasons[finishReason],
            })
          }
        }
      } else {
        setFeedback(
          'There was an error generating the response\n Please, try again in a few seconds',
        )
      }

      setUserPrompt('')
    },
  })

  useEffect(() => {
    passedSettings && setSettings(merge({}, settings, passedSettings))
  }, [])
  useEffect(() => {
    showPreview && livePreview && updatePreview()
  }, [htmlSrc, css, passedContent])

  useEffect(() => {
    showPreview && updatePreview()
    !showPreview && !showEditor && setShowEditor(true)
  }, [showPreview])

  useEffect(() => {
    if (!showEditor) {
      setSelectedCtx(getCtxBy('node', htmlSrc))
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

  const handleSend = async e => {
    if (loading) return
    e.preventDefault()
    userPrompt && setFeedback('Just give me a few seconds')
    userPrompt
      ? callOpenAi({
          // variables: {
          input: `${userPrompt}.\nNOTE: Remember to always return the expected valid JSON, have a second thought on this before responding`,
          history: [
            {
              role: 'system',
              content: systemGuidelinesV2({
                ctx: selectedCtx || getCtxBy('node', htmlSrc),
                sheet: styleSheetRef?.current?.textContent,
                selectors: validSelectors?.current?.join(', '),
                providedText:
                  selectedNode !== htmlSrc && selectedCtx.node.innerHTML,
                markedSnippet,
              }),
            },
            // eslint-disable-next-line react/prop-types
            ...(takeRight(selectedCtx.history, settings.historyMax) || []),
          ],
          // },
        })
      : setFeedback('Please, tell me what you want to do')
    selectedCtx.history.push({ role: 'user', content: userPrompt })
  }

  const updatePreview = manualUpdate => {
    const previewDoc = previewRef?.current?.contentDocument?.documentElement

    previewDoc &&
      previewDoc.scrollTop > 0 &&
      (previewScrollTopRef.current = previewDoc.scrollTop)

    css &&
      htmlSrc?.outerHTML &&
      (livePreview || manualUpdate) &&
      setPreviewSource(
        srcdoc(
          htmlSrc,
          css,
          cssTemplate1 +
            cssTemplate3 +
            snippetsToCssText(settings.editor.snippets),
          previewScrollTopRef.current,
        ),
      )
    updateCtxNodes()
    updateSelectionBoxPosition()
    htmlSrc && removeStyleAttribute(htmlSrc)
    htmlSrc && getValidSelectors(htmlSrc)
  }

  return (
    <Root>
      {settings.editor.enableSnippets && (
        <style id="aid-snippets">
          {snippetsToCssText(settings.editor.snippets)}
        </style>
      )}
      <StyledHeading>
        <CssAssistantUi>
          <ChatBubble forceHide={showChat} onRight />
          <Assistant
            enabled
            loading={loading}
            onSend={handleSend}
            placeholder="Type here how your book should look..."
          />
          <span>
            <settings.Icons.UndoIcon
              onClick={() => onHistory.apply('undo')}
              title="Undo (Ctrl + z)"
            />
            <settings.Icons.RedoIcon
              onClick={() => onHistory.apply('redo')}
              title="Redo (Ctrl + y)"
            />
          </span>
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
          <span>
            <settings.Icons.SettingsIcon
              onClick={() => setShowSettings(!showSettings)}
              style={{
                cursor: 'pointer',
              }}
            />
          </span>
        </CheckBoxes>
        <SettingsMenu showSettings={showSettings} />
      </StyledHeading>
      <WindowsContainer>
        <StyledWindow $show={showChat} style={{ maxWidth: '30%' }}>
          <WindowHeading>
            <span>CHAT HISTORY</span>
            <DeleteOutlined
              onClick={clearHistory}
              title="Clear history (not undoable)"
            />
          </WindowHeading>
          <ChatHistory />
        </StyledWindow>

        {showChat && (showEditor || showPreview) && <WindowDivision />}

        <StyledWindow $show={showEditor}>
          <WindowHeading>
            <span>
              CONTENT SELECTION{bookTitle ? `for: "${bookTitle}"` : ':'}
            </span>
            <span>
              Selection:{' '}
              {selectedCtx?.node && selectedCtx.node !== htmlSrc
                ? htmlTagNames[selectedCtx.tagName]
                : 'Book'}
            </span>
          </WindowHeading>
          {loading && <LoadingOverlay />}
          <OverlayAnimated $loading={loading}>
            <span>Processing...</span>
          </OverlayAnimated>
          <EditorContainer $loading={loading} onScroll={handleScroll}>
            <Editor
              stylesFromSource={initialPagedJSCSS}
              updatePreview={updatePreview}
            />
            <SelectionBox updatePreview={updatePreview} />
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
                <settings.Icons.RefreshIcon />
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
