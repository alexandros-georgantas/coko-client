import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'
import { CopyOutlined, DeleteOutlined, DiffOutlined } from '@ant-design/icons'
import { CssAssistantContext } from './hooks/CssAssistantContext'
import {
  cssStringToObject,
  htmlTagNames,
  removeStyleAttribute,
  setInlineStyle,
} from './utils'

const backgrounds = {
  dark: '#0001',
  light: '#fff1',
  magenta: '#f0f1',
}

const borders = {
  dark: '#0008',
  light: '#fffa',
  magenta: '#f0fa',
}

const AbsoluteContainer = styled.span`
  background-color: ${p => backgrounds[p.selectionColor.bg] || '#0001'};
  border: 1px dashed ${p => borders[p.selectionColor.border] || 'currentColor'};
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
  advancedTools,
  selectionColor,
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
  } = useContext(CssAssistantContext)

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
      selectionColor={selectionColor}
      {...rest}
    >
      {advancedTools && (
        <RelativeContainer>
          <small>{htmlTagNames[selectedCtx.tagName] || 'element'}</small>
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
        </RelativeContainer>
      )}
    </AbsoluteContainer>
  )
}

export default SelectionBox
