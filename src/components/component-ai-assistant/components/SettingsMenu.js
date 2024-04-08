/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { merge } from 'lodash'
import { CssAssistantContext } from '../hooks/CssAssistantContext'
import Toggle from './Toggle'

const Container = styled.div`
  --padding: 10px;
  background-color: white;
  border: 1px solid ${p => (p.$show ? '#0004' : '#0000')};
  border-radius: 0 0 10px 10px;
  border-top: none;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  gap: 5px;
  height: 100%;
  max-width: ${p => (p.$show ? '80%' : '0')};
  overflow: hidden;
  padding: ${p => (p.$show ? '10px 10px' : '10px 0')};
  position: absolute;
  right: ${p => (p.$show ? 0 : '-3px')};
  top: -1px;
  transition: all 0.2s linear;
  width: 500px;
  z-index: 9999999999;

  > * {
    opacity: ${p => (p.$show ? '1' : '0')};
    transition: opacity 0.2s linear;
  }

  button {
    background: none;
    border: 1px solid #0004;
    border-radius: 50%;
    color: #0000;
    cursor: pointer;
    height: 20px;
    width: 20px;
  }

  h4 {
    color: #00495c;
    font-size: 18px;
    margin: 0;
  }

  h3 {
    color: var(--color-blue-dark);
    font-size: 15px;
    margin: 0;
    margin-bottom: 10px;
  }

  hr {
    color: #0002;
    margin: 5px;
  }

  > span {
    align-items: center;
    width: 100%;
  }
`

const Group = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  width: 100%;

  p {
    margin: 0;
  }

  span {
    display: flex;
    gap: 2px;
  }
`

const SettingsMenu = ({
  showSettings,
  showEditor,
  showChat,
  livePreview,
  showPreview,
  setShowEditor,
  setLivePreview,
  setShowPreview,
  setShowChat,
  ...rest
}) => {
  // eslint-disable-next-line no-unused-vars
  const { setSettings, settings, saveSession } = useContext(CssAssistantContext)
  const [historyMax, setHistoryMax] = useState(settings.chat.historyMax)

  const setMessageMax = e => {
    // eslint-disable-next-line no-nested-ternary
    let { value, min, max } = e.target
    value = Math.max(Number(min), Math.min(Number(max), Number(value)))
    setHistoryMax(value)
  }

  useEffect(() => {
    historyMax &&
      setSettings(prev => ({ ...prev, chat: { historyMax: historyMax - 1 } }))
  }, [historyMax])

  const setSelectionColor = ({ target }) => {
    const { bg = '', border = '' } = target.dataset
    setSettings(prev => ({
      ...prev,
      editor: {
        ...prev.editor,
        selectionColor: {
          bg: bg || prev.editor.selectionColor.bg,
          border: border || prev.editor.selectionColor.border,
        },
      },
    }))
  }

  const backgrounds = [
    'var(--color-blue-alpha-2)',
    'var(--color-green-alpha-2)',
    'var(--color-yellow-alpha-2)',
    'var(--color-orange-alpha-2)',
    '#0000',
  ]

  const borders = [
    'var(--color-blue-alpha-1)',
    'var(--color-green-alpha-1)',
    'var(--color-yellow-alpha-1)',
    'var(--color-orange-alpha-1)',
    '#0000',
  ]

  return (
    <Container $show={showSettings} {...rest}>
      <img
        alt="AI Design Studio Settings"
        src="/assets/AI Design Studio-Logo-horizontal.svg"
        style={{ padding: '1.5rem', width: '300px' }}
      />
      <Group style={{ justifyContent: 'flex-start' }}>
        <Group
          style={{ flexDirection: 'column', justifyContent: 'flex-start' }}
        >
          <h3>Snippets Manager</h3>
          <Toggle
            checked={settings.snippetsManager.showCssByDefault}
            handleChange={() =>
              setSettings(prev =>
                merge({}, prev, {
                  snippetsManager: {
                    showCssByDefault: !prev.snippetsManager.showCssByDefault,
                  },
                }),
              )
            }
            id="show-css-by-default"
            label="Show Css by Default"
            style={{ margin: 0 }}
          />
          <Toggle
            checked={settings.snippetsManager.createNewSnippetVersions}
            handleChange={() =>
              setSettings(prev =>
                merge({}, prev, {
                  snippetsManager: {
                    createNewSnippetVersions:
                      !prev.snippetsManager.createNewSnippetVersions,
                  },
                }),
              )
            }
            id="create-new-snippet-versions"
            label="Always create new snippet"
            style={{ margin: 0 }}
          />
          <Toggle
            checked={settings.snippetsManager.markNewSnippet}
            handleChange={() =>
              setSettings(prev =>
                merge({}, prev, {
                  snippetsManager: {
                    markNewSnippet: !prev.snippetsManager.markNewSnippet,
                  },
                }),
              )
            }
            id="mark-new-snippet"
            label="Edit new snippets"
            style={{ margin: 0 }}
          />
        </Group>

        <Group
          style={{ flexDirection: 'column', justifyContent: 'flex-start' }}
        >
          <h3>Layout</h3>
          <Toggle
            checked={showEditor || (!showPreview && !showEditor)}
            handleChange={() => setShowEditor(!showEditor)}
            id="showContent"
            label="Content"
            style={{ margin: 0 }}
          />
          <Toggle
            checked={showPreview}
            handleChange={() => setShowPreview(!showPreview)}
            id="showPreview"
            label="Article Preview"
            style={{ margin: 0 }}
          />
          <Toggle
            checked={showChat}
            handleChange={() => setShowChat(!showChat)}
            id="showChatHistory"
            label="Chat History"
            style={{ margin: 0 }}
          />
          <Toggle
            checked={livePreview}
            handleChange={() => setLivePreview(!livePreview)}
            id="livePreview"
            label="Live preview"
            style={{ margin: 0 }}
          />
        </Group>
      </Group>
      <Group style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
        <h3>GUI</h3>
        <Group>
          <Group
            style={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              padding: '0',
            }}
          >
            <Toggle
              checked={settings.gui.advancedTools}
              handleChange={() =>
                setSettings(prev =>
                  merge({}, prev, {
                    gui: {
                      advancedTools: !prev.gui.advancedTools,
                    },
                  }),
                )
              }
              id="advanced-tools"
              label="Advanced Tools"
              style={{ margin: 0 }}
            />
            <Toggle
              checked={settings.editor.contentEditable}
              handleChange={() =>
                setSettings(prev => ({
                  ...prev,
                  editor: {
                    ...prev.editor,
                    contentEditable: !prev.editor.contentEditable,
                  },
                }))
              }
              id="enabled-edition"
              label="Enable editing (Ctrl + E)"
              style={{ margin: 0 }}
            />
          </Group>
          <Group
            style={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              gap: '5px',
            }}
          >
            <p>Selection border:</p>
            <span>
              {borders.map(b => (
                <button
                  data-border={b}
                  key={b}
                  label="Select border"
                  onClick={setSelectionColor}
                  style={{ background: b }}
                  type="button"
                />
              ))}
            </span>
            <p>Selection color:</p>
            <span>
              {backgrounds.map(b => (
                <button
                  data-bg={b}
                  key={b}
                  label="Select border"
                  onClick={setSelectionColor}
                  style={{ background: b }}
                  type="button"
                />
              ))}
            </span>
          </Group>
        </Group>
      </Group>

      <Group style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
        <h3>Chat</h3>
        <Group>
          History record:
          <input
            max={20}
            min={2}
            onInput={setMessageMax}
            step={2}
            type="number"
            value={historyMax}
          />
        </Group>
        <Toggle
          checked={settings.chat.showChatBubble}
          handleChange={() =>
            setSettings(prev => ({
              ...prev,
              chat: {
                ...prev.chat,
                showChatBubble: !prev.chat.showChatBubble,
              },
            }))
          }
          id="show-chat-bubble"
          label="Show chat bubble"
          style={{ margin: 0 }}
        />
      </Group>
      <Group>
        <button
          onClick={saveSession}
          style={{
            width: 'fit-content',
            height: 'fit-content',
            borderColor: 'var(--color-green)',
            color: '#fff',
            background: 'var(--color-green-dark)',
            borderRadius: '10px',
            padding: '5px 10px',
          }}
          type="button"
        >
          Save Session
        </button>
      </Group>
    </Container>
  )
}

export default SettingsMenu
