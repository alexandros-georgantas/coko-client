/* stylelint-disable no-descending-specificity */
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
  setScrollFromPercent,
  getScrollPercent,
  addElement,
  finishReasons,
  systemGuidelinesV2,
  snippetsToCssText,
  callOn,
  SnippetIcon,
} from './utils'
import SelectionBox from './SelectionBox'
import { CssAssistantContext } from './hooks/CssAssistantContext'
import ChatBubble from './ChatBubble'
import ChatHistory from './ChatHistory'
import useChatGpt from './hooks/useChatGpt'
import SettingsMenu from './components/SettingsMenu'
import { SnippetsManager } from './components/SnippetsManager'
// import { convertTibetanToENphonethics } from './utils/phonetics'

// #region styleds
const Assistant = styled(PromptsInput)`
  border-bottom: none;
  border-radius: 0;
  border-top: none;
  margin: 10px 0;
  overflow: hidden;
  padding: 0 10px;
  width: 480px;

  svg {
    height: 15px;
    width: 15px;
  }
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
    align-items: baseline;
    color: #00495c;
    display: flex;
    gap: 0;

    svg {
      color: var(--color-blue);
      height: 15px;
      width: 15px;
    }

    > :last-child {
      cursor: pointer;
      margin-left: 0.3rem;
    }
  }
`

const StyledHeading = styled.div`
  --snippet-icon: var(--color-blue);
  --snippet-icon-st: #fff;

  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #0004;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 0 0 10px;
  position: relative;
  scrollbar-color: #00495c;
  scrollbar-width: thin;
  width: 100%;
  z-index: 999999999;

  button > svg {
    color: var(--color-blue);
    height: 20px;
    width: 20px;
  }
`

const Root = styled.div`
  --color-yellow: #fbcd55;
  --color-yellow-dark: #a27400;
  --color-orange: #fe7b4d;
  --color-orange-dark: #9c4b2e;
  --color-green: #6fab6a;
  --color-green-dark: #558151;
  --color-blue: #21799e;
  --color-blue-dark: #154a61;
  --color-fill: #50737c;
  --color-fill-1: #6a919b;
  --color-fill-2: #fff;
  --color-disabled: #ccc;
  --color-enabled: #21799e;
  --color-yellow-alpha-1: #fbcd55aa;
  --color-orange-alpha-1: #fe7b4daa;
  --color-green-alpha-1: #6fab6aaa;
  --color-blue-alpha-1: #21799eaa;
  --color-yellow-alpha-2: #fbcd5511;
  --color-orange-alpha-2: #fe7b4d11;
  --color-green-alpha-2: #6fab6a11;
  --color-blue-alpha-2: #21799e11;

  border: 1px solid #0002;
  border-radius: 0 8px 8px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
  width: 100%;

  * {
    ::-webkit-scrollbar {
      height: 5px;
      width: 5px;
    }

    ::-webkit-scrollbar-thumb {
      background: #004a5c48;
      border-radius: 5px;
      width: 5px;
    }

    ::-webkit-scrollbar-track {
      background: #fff0;
      padding: 5px;
    }
  }
`

const EditorContainer = styled.div`
  background: whitesmoke;
  display: flex;
  filter: ${p => (p.$loading ? 'blur(2px)' : '')};
  height: calc(100vh - 80px);
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
  height: calc(100vh - 10px);

  width: 100%;
`

const CheckBoxes = styled.div`
  align-items: center;
  border-left: 1px solid #0002;
  color: #555;
  display: flex;
  font-size: 14px;
  line-height: 1.3;
  padding: 0 0.7rem 0 0;
  position: relative;

  > span {
    height: fit-content;
    padding: 5px 10px;
  }
`

const WindowsContainer = styled.div`
  background: #eee;
  display: flex;
  height: calc(100%);
  position: relative;
  width: 100%;
`

const StyledWindow = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 58px);
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
  border: 1px solid #0004;
  border-top-color: #fff;
  height: calc(100% + 1px);
  margin-top: -1px;
  width: 8px;
  z-index: 999999;
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
    history,
    clearHistory,
    updateCtxNodes,
    userPrompt,
    getCtxBy,
    settings,
    setSettings,
    markedSnippet,
    saveSession,
  } = useContext(CssAssistantContext)

  const previewScrollTopRef = useRef(0)
  const previewRef = useRef(null)
  const [previewSource, setPreviewSource] = useState(null)
  const [livePreview, setLivePreview] = useState(true)
  const [showEditor, setShowEditor] = useState(true)
  const [showPreview, setShowPreview] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showSnippetsWindow, setShowSnippetsWindow] = useState(false)

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
            addTibetan,
          } = response

          if (resCss || insertHtml || snippet || content || addTibetan) {
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
          /* #tibetan */
          // addTibetan &&
          //   (ctxIsHtmlSrc
          //     ? htmlSrc.querySelectorAll('.tibetan').forEach(
          //         el =>
          //           ![...htmlSrc.querySelectorAll('*')]
          //             .map(e => e.textContent)
          //             .includes(convertTibetanToENphonethics(el.textContent)) &&
          //           addElement(el, {
          //             html: `<p class="aid-snip-tibetan-to-phonetics">${convertTibetanToENphonethics(
          //               el.textContent,
          //             )}</p>`,
          //           }),
          //       )
          //     : addElement(selectedNode, {
          //         html: `<p class="aid-snip-tibetan-to-phonetics">${convertTibetanToENphonethics(
          //           selectedNode.textContent,
          //         )}</p>`,
          //       }))
          /* #tibetan */

          content && (selectedCtx.node.innerHTML = content)
          feedback && setFeedback(feedback)
          feedback &&
            selectedCtx.history.push({ role: 'assistant', content: feedback })

          updatePreview(true)
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

  const keyShortcuts = e => {
    const { key, ctrlKey } = e
    callOn(key, {
      m: () => {
        if (!ctrlKey) return
        setShowSnippetsWindow(prev => !prev)
      },
      e: () => {
        if (!ctrlKey) return
        e.preventDefault()
        setSettings(prev => ({
          ...prev,
          editor: {
            ...prev.editor,
            contentEditable: !prev.editor.contentEditable,
          },
        }))
      },
      s: () => {
        if (!ctrlKey) return
        e.preventDefault()
        saveSession()
      },
      Escape: ev => {
        if (!showSnippetsWindow) return
        ev.preventDefault()
        setShowSnippetsWindow(false)
      },
    })
  }

  useEffect(() => {
    passedSettings && setSettings(merge({}, settings, passedSettings))
    window.addEventListener('keydown', keyShortcuts)

    return () => {
      window.removeEventListener('keydown', keyShortcuts)
    }
  }, [passedSettings])
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
    error && setFeedback(error.message)
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
                selectors: [...htmlSrc.querySelectorAll('*')]?.map(
                  el => el.localName,
                ),
                providedText:
                  selectedNode !== htmlSrc && selectedCtx.node.innerHTML,
                markedSnippet,
                snippets: settings.snippetsManager.snippets,
              }),
            },
            // eslint-disable-next-line react/prop-types
            ...(takeRight(selectedCtx.history, settings.chat.historyMax) || []),
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
          cssTemplate1 + snippetsToCssText(settings.snippetsManager.snippets),
          previewScrollTopRef.current,
        ),
      )
    updateCtxNodes()
    updateSelectionBoxPosition()
  }

  return (
    <Root>
      {settings.snippetsManager.snippets && (
        <style id="aid-snippets">
          {snippetsToCssText(settings.snippetsManager.snippets)}
        </style>
      )}
      <StyledHeading>
        <CssAssistantUi>
          <ChatBubble forceHide={showChat} onRight />
          <Assistant
            enabled
            loading={loading}
            onSend={handleSend}
            placeholder="Type here how your article should look..."
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
            <settings.Icons.RefreshIcon
              onClick={updatePreview}
              title="Update preview"
              type="button"
            />
            <PrinterOutlined
              as="button"
              onClick={() => previewRef?.current?.contentWindow?.print()}
              title="Print"
              type="button"
            />
          </span>
        </CssAssistantUi>
        <CheckBoxes>
          <SnippetIcon
            onClick={() => setShowSnippetsWindow(!showSnippetsWindow)}
            title={`${
              !showSnippetsWindow ? 'Open' : 'Close'
            } Snippet Manager (Ctrl + M)`}
          />
          <settings.Icons.SettingsIcon
            onMouseEnter={() => setShowSettings(!showSettings)}
            style={{
              cursor: 'pointer',
            }}
          />
        </CheckBoxes>
      </StyledHeading>
      <SettingsMenu
        livePreview={livePreview}
        onMouseLeave={() => setShowSettings(false)}
        setLivePreview={setLivePreview}
        setShowChat={setShowChat}
        setShowEditor={setShowEditor}
        setShowPreview={setShowPreview}
        showChat={showChat}
        showEditor={showEditor}
        showPreview={showPreview}
        showSettings={showSettings}
        updatePreview={updatePreview}
      />
      <WindowsContainer>
        {showSnippetsWindow && (
          <SnippetsManager
            setShow={setShowSnippetsWindow}
            updatePreview={updatePreview}
          />
        )}
        <StyledWindow
          $show={showChat}
          style={{ maxWidth: '30%', background: '#f5f5f5' }}
        >
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
                : 'Article'}
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
            <span>
              ARTICLE PREVIEW{bookTitle ? ` for: "${bookTitle}"` : ':'}
            </span>
          </WindowHeading>
          <PreviewIframe
            onLoad={updatePreview}
            ref={previewRef}
            srcDoc={previewSource}
            title="Article preview"
          />
        </StyledWindow>
      </WindowsContainer>
    </Root>
  )
}

export default AiPDFDesigner
