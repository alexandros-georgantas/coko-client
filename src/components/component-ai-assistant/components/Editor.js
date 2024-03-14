import React, { useContext, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { CssAssistantContext } from '../hooks/CssAssistantContext'
import { removeStyleAttribute, setImagesDefaultStyles } from '../utils'

const StyledEditor = styled.div`
  border: none;
  outline: none;
  width: 100%;
  z-index: 1;

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
      const tempScope = htmlSrc
      !tempScope.id && (tempScope.id = 'assistant-ctx')
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

      htmlSrc.parentNode.parentNode.addEventListener('click', handleSelection)
    }
  }, [htmlSrc])

  useEffect(() => {
    return () => {
      if (htmlSrc) {
        ;[...htmlSrc.children].forEach(child =>
          child.removeEventListener('click', handleSelection),
        )
        htmlSrc.parentNode.parentNode.removeEventListener(
          'click',
          handleSelection,
        )
      }
    }
  }, [])

  useEffect(() => {
    !passedContent &&
      setPassedContent(
        '<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:3rem;color:#555;"><p>Paste the article here</p></div>',
      )
  }, [])

  useEffect(() => {
    editorRef?.current && setHtmlSrc(editorRef.current)
    editorRef?.current && getValidSelectors(editorRef.current)
    ;[...editorRef.current.children].forEach(removeStyleAttribute)
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
      const ctx =
        getCtxBy('node', e.target) ||
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
      onPaste={enablePaste ? handlePaste : () => {}}
      ref={editorRef}
    />
  )
}

export default Editor
