/* eslint-disable react/prop-types */
import React, { useEffect, useContext } from 'react'
import styled from 'styled-components'
import { debounce } from 'lodash'
import { rotate360 } from '@pubsweet/ui-toolkit'
import PropTypes from 'prop-types'
// import { gql, useLazyQuery } from '@apollo/client'
import { autoResize, callOn } from './utils'
import { CssAssistantContext } from './hooks/CssAssistantContext'

const StyledForm = styled.form`
  --color: #00495c;
  --color-border: #0004;
  --font-size: 14px;
  align-items: center;
  background-color: #fffe;
  border: 1px solid var(--color-border);
  border-radius: 5px;
  display: flex;
  font-size: var(--font-size);
  gap: 8px;
  height: fit-content;
  justify-content: center;
  margin: 0;
  overflow: auto;
  padding: 0.4rem 0.8rem;
  position: relative;
  transition: all 0.5s;
  width: 500px;

  textarea {
    --height: ${p => p.height || `24px`};
    background: none;
    border: none;
    caret-color: var(--color);
    font-size: inherit;
    height: var(--height);
    max-height: 100px;
    outline: none;
    overflow-y: auto;
    resize: none;
    width: 100%;
  }
`

const StyledSpinner = styled.div`
  display: flex;
  height: fit-content;
  width: 24px;

  &::after {
    animation: ${rotate360} 1s linear infinite;
    border: 2px solid #00495c;
    border-color: #00495c transparent;
    border-radius: 50%;
    /* stylelint-disable-next-line string-quotes */
    content: ' ';
    display: block;
    height: 18px;
    margin: 1px;
    width: 18px;
  }
`

const PromptsInput = ({ enabled, className, loading, onSend, ...rest }) => {
  // #region HOOKS ---------------------------------------------------------------------
  const {
    selectedCtx,
    history,
    userPrompt,
    setUserPrompt,
    promptRef,
    onHistory,
    settings: {
      Icons: { SendIcon },
    },
  } = useContext(CssAssistantContext)

  useEffect(() => {
    debouncedResize()
  }, [userPrompt])

  const handleChange = ({ target }) => {
    if (loading) return
    setUserPrompt(target.value)
    debouncedResize()
  }

  const handleKeydown = e => {
    callOn(e.key, {
      Enter: () => !e.shiftKey && onSend(e),
      ArrowDown: () => {
        const userHistory = selectedCtx.history.filter(v => v.role === 'user')
        if (userHistory.length < 1) return
        history.current.prompts.index > 0
          ? (history.current.prompts.index -= 1)
          : (history.current.prompts.index = userHistory.length - 1)

        history.current.prompts.active &&
          setUserPrompt(userHistory[history.current.prompts.index].content)
        history.current.prompts.active = true
      },
      ArrowUp: () => {},
      z: () => {
        e.ctrlKey && onHistory.apply('undo')
      },
      y: () => {
        e.ctrlKey && onHistory.apply('redo')
      },
      default: () =>
        history.current.prompts.active &&
        (history.current.prompts.active = false),
    })
  }

  // #endregion HANDLERS

  const debouncedResize = debounce(() => {
    autoResize(promptRef.current)
  }, 300)

  return (
    <StyledForm $enabled={enabled} className={className}>
      <textarea
        disabled={!enabled}
        onChange={handleChange}
        onKeyDown={handleKeydown}
        ref={promptRef}
        value={userPrompt}
        {...rest}
      />
      {loading ? (
        <StyledSpinner />
      ) : (
        <SendIcon onClick={onSend} style={{ transform: 'scale(1.6)' }} />
      )}
    </StyledForm>
  )
}

PromptsInput.propTypes = {
  enabled: PropTypes.bool,
  className: PropTypes.string,
}

PromptsInput.defaultProps = {
  enabled: true,
  className: '',
}

export default PromptsInput
