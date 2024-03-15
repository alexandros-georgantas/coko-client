import React, { useContext, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { CssAssistantContext } from '../hooks/CssAssistantContext'
import { setImagesDefaultStyles } from '../utils'

const StyledEditor = styled.div`
  border: none;
  outline: none;
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

// eslint-disable-next-line react/prop-types
const Editor = ({ stylesFromSource, contentEditable, enablePaste }) => {
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
  } = useContext(CssAssistantContext)

  const editorRef = useRef(null)

  const handlePaste = e => {
    e.preventDefault()

    const clipboardData = e.clipboardData || window.clipboardData
    const pastedData = clipboardData.getData('text/html')

    setPassedContent(pastedData)
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
    if (
      e.target.className === 'element-options' ||
      (contentEditable && e.detail === 3)
    )
      return
    e.preventDefault()
    e.stopPropagation()

    if (htmlSrc.contains(e.target)) {
      // update the node in ctx as it was recreated
      !getCtxBy('node', e.target) &&
        getCtxBy('dataRef', e.target.dataset.ref) &&
        (getCtxBy('dataRef', e.target.dataset.ref).node = e.target)

      const ctx =
        getCtxBy('node', e.target) ||
        getCtxBy('dataRef', e.target.dataset.ref) ||
        addToCtx(newCtx(e.target, null, {}, false))

      setSelectedCtx(ctx)
      setSelectedNode(e.target)
    } else {
      setSelectedCtx(getCtxBy('node', htmlSrc))
      setSelectedNode(htmlSrc)
    }

    promptRef.current.focus()
  }

  return (
    <StyledEditor
      contentEditable={contentEditable}
      dangerouslySetInnerHTML={{ __html: passedContent }}
      id="assistant-ctx"
      onPaste={enablePaste ? handlePaste : () => {}}
      ref={editorRef}
    />
  )
}

export default Editor
