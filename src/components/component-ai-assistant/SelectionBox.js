import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'
import {
  CopyOutlined,
  DeleteOutlined,
  DiffOutlined,
  RotateRightOutlined,
} from '@ant-design/icons'
import { CssAssistantContext } from './hooks/CssAssistantContext'
import {
  cssStringToObject,
  htmlTagNames,
  removeStyleAttribute,
  setInlineStyle,
} from './utils'

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
  justify-content: flex-start;
  margin-top: -35px;
  position: relative;
  white-space: nowrap;
  width: 100%;
  z-index: 999;

  > button {
    background: #00495c;
    border: 1px solid currentColor;
    border-radius: 50%;
    box-shadow: 0 0 5px #0002, inset 0 0 8px #fff4;
    color: #eee;
    cursor: pointer;
    outline: none;
    padding: 5px;
    pointer-events: all;
  }

  > small {
    background: #00495cb9;
    border: 1px solid currentColor;
    border-radius: 5px;
    color: #eee;
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
    setCopiedStyles,
    copiedStyles,
    updateSelectionBoxPosition,
    onHistory,
    settings,
  } = useContext(CssAssistantContext)

  const { advancedTools } = settings.editor

  useEffect(() => {
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
          <small>{htmlTagNames[selectedCtx.tagName] || 'Element'}</small>
          {selectedCtx?.node?.hasAttribute('style') ? (
            <>
              <button
                className="element-options"
                onClick={() => {
                  onHistory.addRegistry('undo')
                  removeStyleAttribute(selectedNode)
                  updatePreview()
                }}
                title="remove individual styles"
                type="button"
              >
                <DeleteOutlined
                  className="element-options"
                  style={{ pointerEvents: 'none' }}
                />
              </button>
              <button
                className="element-options"
                onClick={() => {
                  const nodeStyles = selectedCtx.node.getAttribute('style')
                  setCopiedStyles(cssStringToObject(nodeStyles))
                }}
                title="copy element styles"
                type="button"
              >
                <CopyOutlined
                  className="element-options"
                  style={{ pointerEvents: 'none' }}
                />
              </button>
            </>
          ) : (
            <small>no individual styles</small>
          )}
          {copiedStyles && (
            <button
              className="element-options"
              onClick={() => {
                onHistory.addRegistry('undo')
                setInlineStyle(selectedCtx.node, copiedStyles)
                updatePreview()
              }}
              title="paste copied styles"
              type="button"
            >
              <DiffOutlined
                className="element-options"
                style={{ pointerEvents: 'none' }}
              />
            </button>
          )}
          {settings.editor.enableSnippets && (
            <>
              <SnippetButton
                Icon={RotateRightOutlined}
                name="rotate"
                node={selectedCtx.node}
                onHistory={onHistory}
                title="rotate 90deg"
                updatePreview={updatePreview}
              />
              <SnippetButton
                Icon={RotateRightOutlined}
                name="scale"
                node={selectedCtx.node}
                onHistory={onHistory}
                title="scale 150%"
                updatePreview={updatePreview}
              />
              <SnippetButton
                Icon={RotateRightOutlined}
                name="grayscale"
                node={selectedCtx.node}
                onHistory={onHistory}
                title="turn to grayscale"
                updatePreview={updatePreview}
              />
            </>
          )}
        </RelativeContainer>
      )}
    </AbsoluteContainer>
  )
}

export default SelectionBox

const SnippetButton = ({
  onHistory,
  node,
  name,
  Icon,
  updatePreview,
  ...rest
}) => {
  const className = `aid-snip-${name}`
  return (
    <button
      className="element-options"
      onClick={e => {
        onHistory.addRegistry('undo')
        const action = node.classList.contains(className) ? 'remove' : 'add'

        node.classList[action](className)
        updatePreview()
      }}
      type="button"
      {...rest}
    >
      <Icon className="element-options" style={{ pointerEvents: 'none' }} />
    </button>
  )
}
