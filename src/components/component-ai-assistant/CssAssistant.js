/* eslint-disable react/prop-types */
import React, { useEffect, useContext } from 'react'
import styled from 'styled-components'
import { debounce, takeRight } from 'lodash'
import { rotate360 } from '@pubsweet/ui-toolkit'
import PropTypes from 'prop-types'
// import { gql, useLazyQuery } from '@apollo/client'
import { autoResize, callOn, systemGuidelinesV2 } from './utils'
import SendIcon from './SendButton'
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

// const CALL_OPEN_AI = gql`
//   query OpenAi($input: String!, $history: [OpenAiMessage!]) {
//     openAi(input: $input, history: $history)
//   }
// `

const SendButton = styled.button`
  aspect-ratio: 1 /1;
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  padding: 0;
  width: 24px;

  > svg {
    fill: #00495c;
    transform: scale(1.35);
  }
`

const CssAssistant = ({ enabled, className, loading, callOpenAi, ...rest }) => {
  // #region HOOKS ---------------------------------------------------------------------
  const {
    styleSheetRef,
    htmlSrc,
    selectedCtx,
    selectedNode,
    setFeedback,
    history,
    userPrompt,
    setUserPrompt,
    promptRef,
    validSelectors,
    getCtxBy,
  } = useContext(CssAssistantContext)

  useEffect(() => {
    debouncedResize()
  }, [userPrompt])

  const handleChange = ({ target }) => {
    if (loading) return
    setUserPrompt(target.value)
    debouncedResize()
  }

  const handleSend = async e => {
    if (loading) return
    e.preventDefault()
    userPrompt && setFeedback('Just give me a few seconds')
    userPrompt
      ? callOpenAi({
          // variables: {
          input: `${userPrompt}. NOTE: Remember to always return the expected valid JSON, have a second thought on this before responding`,
          history: [
            {
              role: 'system',
              content: systemGuidelinesV2({
                ctx: selectedCtx || getCtxBy('node', htmlSrc),
                sheet: styleSheetRef?.current?.textContent,
                selectors: validSelectors?.current?.join(', '),
                providedText:
                  selectedNode !== htmlSrc && selectedCtx.node.innerHTML,
              }),
            },
            ...(takeRight(selectedCtx.history, 14) || []),
          ],
          // },
        })
      : setFeedback('Please, tell me what you want to do')
    selectedCtx.history.push({ role: 'user', content: userPrompt })
  }

  const handleKeydown = async e => {
    callOn(e.key, {
      Enter: () => !e.shiftKey && handleSend(e),
      ArrowDown: () => {
        const userHistory = selectedCtx.history.filter(v => v.role === 'user')
        if (userHistory.length < 1) return
        history.current.index > 0
          ? (history.current.index -= 1)
          : (history.current.index = userHistory.length - 1)

        history.current.active &&
          setUserPrompt(userHistory[history.current.index].content)
        history.current.active = true
      },
      ArrowUp: () => {},
      default: () => history.current.active && (history.current.active = false),
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
        <SendButton onClick={handleSend}>
          <SendIcon size="18" />
        </SendButton>
      )}
    </StyledForm>
  )
}

CssAssistant.propTypes = {
  enabled: PropTypes.bool,
  className: PropTypes.string,
}

CssAssistant.defaultProps = {
  enabled: true,
  className: '',
}

export default CssAssistant
