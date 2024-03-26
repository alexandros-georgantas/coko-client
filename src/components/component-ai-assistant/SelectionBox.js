import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  CopyOutlined,
  DeleteOutlined,
  DiffOutlined,
  EditOutlined,
  SnippetsOutlined,
} from '@ant-design/icons'
import { keys, capitalize } from 'lodash'
import { CssAssistantContext } from './hooks/CssAssistantContext'
import { htmlTagNames, mapEntries, onKeys } from './utils'

const AbsoluteContainer = styled.span`
  background-color: ${p => p.selectionColor.bg || '#0001'};
  border: 1px dashed ${p => p.selectionColor.border || 'currentColor'};
  display: flex;
  pointer-events: none;
  position: absolute;
  transition: top 0.3s, left 0.3s, width 0.3s, height 0.3s, opacity 0.3s;
  z-index: 999;
`

const RelativeContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 5px;
  height: 35px;
  justify-content: space-between;
  margin-top: -35px;
  position: relative;
  white-space: nowrap;
  width: 100%;
  z-index: 999;

  button {
    background: var(--color-fill);
    border: none;
    border-radius: 50%;
    box-shadow: 0 0 4px #0002;
    color: #eee;
    cursor: pointer;
    outline: none;
    padding: 5px;
    pointer-events: all;
  }

  > span {
    gap: 4px;
  }

  > small.element-type {
    background-color: #fffe;
    border-radius: 5px;
    box-shadow: 0 0 4px #0002;
    color: var(--color-fill);
    line-height: 1;
    padding: 5px 8px;
  }
`

/* eslint-disable react/prop-types */
const SelectionBox = ({
  updatePreview,
  yOffset = 10,
  xOffset = 10,
  ...rest
}) => {
  const {
    selectedNode,
    selectionBoxRef,
    selectedCtx,
    updateSelectionBoxPosition,
    onHistory,
    settings,
    addSnippet,
    copiedSnippet,
    getMarkedSnippetName,
    markedSnippet,
    setMarkedSnippet,
  } = useContext(CssAssistantContext)

  const { advancedTools } = settings.editor

  useEffect(() => {
    selectedCtx?.snippets && setMarkedSnippet(getMarkedSnippetName())

    updateSelectionBoxPosition(yOffset, xOffset)
    selectionBoxRef?.current &&
      selectionBoxRef.current.parentNode.addEventListener(
        'scroll',
        updateSelectionBoxPosition,
      )
    selectionBoxRef?.current &&
      selectionBoxRef.current.parentNode.addEventListener(
        'resize',
        updateSelectionBoxPosition,
      )

    return () => {
      selectionBoxRef?.current &&
        selectionBoxRef.current.parentNode.removeEventListener(
          'scroll',
          updateSelectionBoxPosition,
        )
      selectionBoxRef?.current &&
        selectionBoxRef.current.parentNode.removeEventListener(
          'resize',
          updateSelectionBoxPosition,
        )
    }
  }, [selectedNode])

  return (
    <AbsoluteContainer
      ref={selectionBoxRef}
      selectionColor={settings.editor.selectionColor}
      {...rest}
    >
      {advancedTools && (
        <RelativeContainer>
          <small className="element-type">
            {htmlTagNames[selectedCtx.tagName] || 'Element'}
          </small>
          <span style={{ display: 'flex' }}>
            {settings.editor.enableSnippets &&
              selectedCtx.snippets &&
              mapEntries(selectedCtx.snippets, (k, v) => (
                <SnippetButton
                  $active={selectedCtx.node.classList.contains(`aid-snip-${k}`)}
                  Icon={SnippetsOutlined}
                  marked={markedSnippet === k}
                  name={k}
                  node={selectedCtx.node}
                  onHistory={onHistory}
                  title={`${k}:\n\t-- ${v.description} --`}
                  updatePreview={updatePreview}
                />
              ))}
            {copiedSnippet && (
              <button
                data-element="element-options"
                onClick={() => {
                  onHistory.addRegistry('undo')
                  addSnippet(selectedCtx.node, copiedSnippet)
                  updatePreview()
                }}
                style={{ background: '#fffe', color: 'var(--color-fill)' }}
                title={`Paste copied snippet:\n\tName: "${
                  keys(copiedSnippet)[0]
                }"\n\tDescription: ${
                  copiedSnippet[keys(copiedSnippet)[0]].description
                }`}
                type="button"
              >
                <DiffOutlined
                  data-element="element-options"
                  style={{ pointerEvents: 'none' }}
                />
              </button>
            )}
          </span>
        </RelativeContainer>
      )}
    </AbsoluteContainer>
  )
}

export default SelectionBox

const Root = styled.div`
  > :first-child {
    background: ${p => (p.$marked ? '#55a777' : 'var(--color-fill)')};
    opacity: ${p => (p.$active ? 1 : 0.4)};
    transform: scale(${p => (p.$active ? 1 : 0.9)});
    transition: all 0.3s;
  }
`

const SubMenu = styled.div`
  background: ${p => (p.$marked ? '#55a777' : 'var(--color-fill)')};
  border-radius: 5px;
  box-shadow: 0 0 5px #0001;
  display: flex;
  flex-direction: column;
  max-height: ${p => (p.$show ? '200px' : 0)};
  min-width: 150px;
  opacity: ${p => (p.$show ? 1 : 0.5)};
  overflow: hidden;
  padding: 0;
  position: absolute;
  right: -2px;
  top: 27px;
  transition: all 0.3s linear;
  width: fit-content;
  z-index: ${p => (p.$show ? 9 : 1)};

  small {
    color: #fafafa;
    font-size: 11px;
    font-weight: bold;
    padding: 2px 8px;
    pointer-events: all;
  }

  button {
    background: #fafafa;
    border: none;
    border-radius: 0;
    box-shadow: inset 0 0 5px #0001;
    color: #555;
    display: flex;
    gap: 4px;
    outline: none;
    padding: 8px 15px;
    transition: background 0.2s;
    width: 100%;

    &:hover {
      background: #f0fcffff;
    }
  }
`

const SnippetButton = ({
  onHistory,
  name,
  Icon,
  updatePreview,
  $active,
  marked,
  ...rest
}) => {
  const {
    selectedCtx,
    addSnippetsClass,
    setCopiedSnippet,
    removeSnippet,
    setMarkedSnippet,
  } = useContext(CssAssistantContext)

  const [showSubMenu, setShowSubMenu] = useState(false)

  const handleClick = e => {
    onHistory.addRegistry('undo')
    selectedCtx.snippets[name].active = !selectedCtx.snippets[name].active
    addSnippetsClass()
    updatePreview()
  }

  const handleMouseOver = e => {
    setShowSubMenu(true)
  }

  const handleMouseLeave = e => {
    setShowSubMenu(false)
  }

  // TODO: move to context
  const markSnippet = () => {
    onKeys(selectedCtx.snippets, k => {
      k !== name && (selectedCtx.snippets[k].marked = false)
    })
    selectedCtx.snippets[name].marked = !selectedCtx.snippets[name].marked
    setMarkedSnippet(selectedCtx.snippets[name].marked ? name : '')
    // console.log(selectedCtx.snippets)
  }

  return (
    <Root
      $active={$active}
      $marked={marked}
      data-element="element-options"
      onMouseLeave={handleMouseLeave}
      onMouseOver={handleMouseOver}
      style={{ position: 'relative' }}
    >
      <button
        data-element="element-options"
        onClick={handleClick}
        type="button"
        {...rest}
      >
        <Icon
          data-element="element-options"
          style={{ pointerEvents: 'none' }}
        />
      </button>
      <SubMenu
        // $show
        $marked={marked}
        $show={showSubMenu}
        data-element="element-options"
        onMouseOver={handleMouseOver}
      >
        <small>{capitalize(name).replace('-', ' ')}</small>

        <button
          data-element="element-options"
          onClick={() => {
            setCopiedSnippet({ [name]: selectedCtx.snippets[name] })
          }}
          title="Copy snippet"
          type="button"
        >
          <CopyOutlined
            data-element="element-options"
            style={{ pointerEvents: 'none' }}
          />{' '}
          Copy
        </button>
        <button
          data-element="element-options"
          onClick={markSnippet}
          title="When editing, the snippet will be modified instead of creating a new one"
          type="button"
        >
          <EditOutlined
            data-element="element-options"
            style={{ pointerEvents: 'none' }}
          />{' '}
          Edit
        </button>
        <button
          data-element="element-options"
          onClick={() => {
            onHistory.addRegistry('undo')
            removeSnippet(name, selectedCtx.node)
            updatePreview()
          }}
          title="Remove snippet"
          type="button"
        >
          <DeleteOutlined
            data-element="element-options"
            style={{ pointerEvents: 'none' }}
          />
          Remove
        </button>
        <button
          data-element="element-options"
          onClick={() => {
            onHistory.addRegistry('undo')
            removeSnippet(name)
            updatePreview()
          }}
          title="Remove snippet(from document)"
          type="button"
        >
          <DeleteOutlined
            data-element="element-options"
            style={{ pointerEvents: 'none' }}
          />
          Remove from document
        </button>
      </SubMenu>
    </Root>
  )
}
