/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import Checkbox from './Checkbox'
import { CssAssistantContext } from '../hooks/CssAssistantContext'

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
  height: fit-content;
  max-height: ${p => (p.$show ? '250px' : '0')};
  overflow: hidden;
  padding: ${p => (p.$show ? '10px 10px' : '0 10px')};
  position: absolute;
  right: -3px;
  top: ${p => (p.$show ? '72px' : '71px')};
  transition: all 0.2s linear;
  width: 300px;
  z-index: 999999;

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

  p {
    margin: 0;
  }

  span {
    display: flex;
    gap: 2px;
  }
`

export const SettingsMenu = ({ showSettings }) => {
  const { setSettings, settings } = useContext(CssAssistantContext)
  const [historyMax, setHistoryMax] = useState(settings.historyMax)

  const setMessageMax = e => {
    // eslint-disable-next-line no-nested-ternary
    let { value, min, max } = e.target
    value = Math.max(Number(min), Math.min(Number(max), Number(value)))
    setHistoryMax(value)
  }

  useEffect(() => {
    historyMax && setSettings(prev => ({ ...prev, historyMax: historyMax - 1 }))
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

  const backgrounds = ['#0001', '#fff1', '#f0f1', '#0ff1']
  const borders = ['#0008', '#fffa', '#f0fa', '#0ffa']

  return (
    <Container $show={showSettings}>
      <h4>Settings</h4>
      <Checkbox
        checked={settings.editor.advancedTools}
        handleChange={() =>
          setSettings(prev => ({
            ...prev,
            editor: {
              ...prev.editor,
              advancedTools: !prev.editor.advancedTools,
            },
          }))
        }
        id="advanced-tools"
        label="Advanced Tools"
        style={{ margin: 0 }}
      />
      <Checkbox
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
        label="Enable edition"
        style={{ margin: 0 }}
      />
      <Checkbox
        checked={settings.editor.enableSnippets}
        handleChange={() =>
          setSettings(prev => ({
            ...prev,
            editor: {
              ...prev.editor,
              enableSnippets: !prev.editor.enableSnippets,
            },
          }))
        }
        id="enabled-snippets"
        label="Enable snippets"
        style={{ margin: 0 }}
      />
      <hr />
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
      <Group>
        <p>Selection border:</p>
        <span>
          {borders.map(b => (
            <button
              data-border={b}
              label="Select border"
              onClick={setSelectionColor}
              style={{ background: b }}
              type="button"
            />
          ))}
        </span>
      </Group>
      <Group>
        <p>Selection color:</p>
        <span>
          {backgrounds.map(b => (
            <button
              data-bg={b}
              label="Select border"
              onClick={setSelectionColor}
              style={{ background: b }}
              type="button"
            />
          ))}
        </span>
      </Group>
    </Container>
  )
}

export default SettingsMenu
