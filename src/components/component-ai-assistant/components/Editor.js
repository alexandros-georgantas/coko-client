/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { CssAssistantContext } from '../hooks/CssAssistantContext'
import { setImagesDefaultStyles } from '../utils'
import useIncrementalTarget from '../hooks/useIncrementalTarget'

const StyledEditor = styled.div`
  border: none;
  outline: none;
  position: relative;
  width: 100%;
  z-index: 1;

  section {
    background: #fff;
    box-shadow: 0 0 5px #0002;
    margin-bottom: 20px;
    min-height: 100%;
    padding: 20px;
  }

  &:hover {
    border: none;
    outline: none;
  }
`

const Editor = ({ stylesFromSource, updatePreview }) => {
  const {
    setHtmlSrc,
    htmlSrc,
    getValidSelectors,
    passedContent,
    setPassedContent,
    setSelectedCtx,
    addToCtx,
    newCtx,
    styleSheetRef,
    getCtxBy,
    setSelectedNode,
    setCss,
    promptRef,
    createStyleSheet,
    onHistory,
    settings,
  } = useContext(CssAssistantContext)

  const { contentEditable, enablePaste } = settings.editor

  const selectionHandler = useIncrementalTarget(500)
  const editorRef = useRef(null)

  const handlePaste = e => {
    e.preventDefault()

    const clipboardData = e.clipboardData || window.clipboardData
    const dataToPaste = clipboardData.getData('text/html')
    if (!dataToPaste) return
    onHistory.addRegistry('undo')
    setPassedContent(`<section>${dataToPaste}</section>`)
  }

  useEffect(() => {
    if (htmlSrc) {
      const allChilds = [...htmlSrc.children]

      styleSheetRef.current = createStyleSheet(styleTag =>
        htmlSrc.parentNode.insertBefore(styleTag, htmlSrc),
      )
      stylesFromSource && (styleSheetRef.current.textContent = stylesFromSource)

      addToCtx(newCtx(htmlSrc))
      setSelectedCtx(getCtxBy('node', htmlSrc))
      setSelectedNode(htmlSrc)
      setCss(styleSheetRef.current.textContent)
      allChilds.forEach(child => {
        child.addEventListener('click', handleSelection)
      })
      getValidSelectors(htmlSrc)

      htmlSrc.parentNode.addEventListener('click', handleSelection)
    }
  }, [htmlSrc])

  useEffect(() => {
    return () => {
      if (htmlSrc) {
        ;[...htmlSrc.children].forEach(child =>
          child.removeEventListener('click', handleSelection),
        )
        htmlSrc.parentNode.removeEventListener('click', handleSelection)
      }
    }
  }, [])

  useEffect(() => {
    !passedContent &&
      setPassedContent('<section><p>Paste the article here</p></section>')
  }, [])

  useEffect(() => {
    editorRef?.current && setHtmlSrc(editorRef.current)
    editorRef?.current && getValidSelectors(editorRef.current)
    // ;[...editorRef.current.children].forEach(removeStyleAttribute)
    setImagesDefaultStyles(editorRef.current)
  }, [passedContent])

  const handleSelection = e => {
    if (e.target.className === 'element-options') return
    e.preventDefault()
    e.stopPropagation()
    selectionHandler(e, target => {
      if (htmlSrc.contains(target)) {
        // update the node in ctx if it was recreated
        !getCtxBy('node', target) &&
          getCtxBy('dataRef', target.dataset.aidctx) &&
          (getCtxBy('dataRef', target.dataset.aidctx).node = target)

        const ctx =
          getCtxBy('node', target) ||
          getCtxBy('dataRef', target.dataset.aidctx) ||
          addToCtx(newCtx(target, null, {}, false))

        setSelectedCtx(ctx)
        setSelectedNode(target)
      } else {
        setSelectedCtx(getCtxBy('node', htmlSrc))
        setSelectedNode(htmlSrc)
      }
    })
  }

  return (
    <StyledEditor
      contentEditable={contentEditable}
      dangerouslySetInnerHTML={{ __html: passedContent }}
      id="assistant-ctx"
      onFocus={() => !contentEditable && promptRef.current.focus()}
      onInput={updatePreview}
      onPaste={enablePaste ? handlePaste : () => {}}
      ref={editorRef}
      tabIndex={0}
    />
  )
}

export default Editor
