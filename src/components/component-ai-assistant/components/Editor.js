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
const Editor = ({ updatePreview }) => {
  const { setHtmlSrc, getValidSelectors, passedContent, setPassedContent } =
    useContext(CssAssistantContext)

  const editorRef = useRef(null)

  const handlePaste = e => {
    e.preventDefault()

    const clipboardData = e.clipboardData || window.clipboardData
    const pastedData = clipboardData.getData('text/html')

    setPassedContent(pastedData)
  }

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

  return (
    <StyledEditor
      contentEditable
      dangerouslySetInnerHTML={{ __html: passedContent }}
      onPaste={handlePaste}
      ref={editorRef}
    />
  )
}

export default Editor
