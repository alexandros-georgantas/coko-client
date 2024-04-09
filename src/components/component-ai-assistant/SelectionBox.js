/* stylelint-disable no-descending-specificity */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { capitalize } from 'lodash'
import { CssAssistantContext } from './hooks/CssAssistantContext'
import { htmlTagNames, mapEntries, onKeys, toSnake } from './utils'

const AbsoluteContainer = styled.span`
  background-color: ${p => p.selectionColor.bg || 'var(--color-blue-alpha-2)'};
  border: 1px dashed
    ${p => p.selectionColor.border || 'var(--color-blue-alpha-1)'};
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
    background: var(--color-blue);
    border: none;
    border-radius: 50%;
    box-shadow: 0 0 4px #0002;
    color: #eee;
    cursor: pointer;
    outline: none;
    padding: 5px;
    pointer-events: all;
  }

  > span,
  > span > span {
    display: flex;
    gap: 4px;
  }

  > small.element-type {
    background-color: #fffe;
    border-radius: 5px;
    box-shadow: 0 0 4px #0002;
    color: var(--color-blue);
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
    settings,
  } = useContext(CssAssistantContext)

  const { advancedTools } = settings.gui

  useEffect(() => {
    const selectionBox = selectionBoxRef?.current
    updateSelectionBoxPosition(yOffset, xOffset)
    selectionBox?.parentNode?.addEventListener(
      'scroll',
      updateSelectionBoxPosition,
    )
    selectionBox?.parentNode?.addEventListener(
      'resize',
      updateSelectionBoxPosition,
    )

    return () => {
      selectionBox?.parentNode?.removeEventListener(
        'scroll',
        updateSelectionBoxPosition,
      )

      selectionBox?.parentNode?.removeEventListener(
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
          <span>
            <AddSnippetButton
              data-element="element-options"
              updatePreview={updatePreview}
            />
          </span>
        </RelativeContainer>
      )}
    </AbsoluteContainer>
  )
}

export default SelectionBox

const Root = styled.div`
  > :first-child {
    background: ${p =>
      p.$marked ? 'var(--color-green)' : 'var(--color-blue)'};
    opacity: ${p => (p.$active ? 1 : 0.4)};
    transform: scale(${p => (p.$active ? 1 : 0.9)});
    transition: all 0.3s;
  }
`

const SubMenu = styled.div`
  background: ${p => (p.$marked ? 'var(--color-green)' : 'var(--color-blue)')};
  border-radius: 5px;
  box-shadow: 0 0 5px #0001;
  display: flex;
  flex-direction: column;
  max-height: ${p => (p.$show ? '220px' : 0)};
  max-width: ${p => (p.$show ? '300px' : 0)};
  min-width: ${p => (p.$show ? '200px' : 0)};
  opacity: ${p => (p.$show ? 1 : 0.5)};
  overflow: hidden;
  padding: 0;
  position: absolute;
  right: -2px;
  top: 27px;
  transition: all 0.3s linear, z-index 0s;
  width: fit-content;
  z-index: ${p => (p.$show ? 9 : 1)};

  > :first-child {
    background: #0002;
    padding: 0.3rem 0;

    button {
      border-radius: 0;
      color: #fffb;
      font-size: 9px;
      padding: 0 0.3rem;
      text-transform: uppercase;
    }

    small {
      color: #fffb;
    }
  }

  small,
  > span {
    color: #fafafa;
    font-size: 11px;
    font-weight: bold;
    padding: 8px;
    pointer-events: all;

    > button {
      background: none;
    }

    > input {
      background: none;
      border: none;
      border-bottom: 1px solid #fff9;
      color: #fffb;
      margin-left: 5px;
      outline: none;
      padding: 5px 0;
      width: 100%;

      ::placeholder {
        color: #fff9;
      }
    }
  }

  > button {
    background: #fafafa;
    border: none;
    border-radius: 0;
    box-shadow: inset 0 0 5px #0001;
    color: #555;
    display: flex;
    gap: 4px;
    outline: none;
    padding: 8px 5px;
    pointer-events: all;
    transition: all 0.2s;
    width: 100%;
  }
`

const Snippet = styled.span`
  --color-states: ${p =>
    p.$active
      ? 'var(--color-green)'
      : p.$marked
      ? 'var(--color-orange)'
      : '#fff0'};
  --color-states-dark: ${p =>
    p.$active
      ? 'var(--color-green-dark)'
      : p.$marked
      ? 'var(--color-orange-dark)'
      : 'var(--color-blue-dark)'};

  background: #fafafa;
  border: none;
  border-left: 3px solid var(--color-states);
  border-radius: 0;
  box-shadow: inset 0 0 5px #0001;
  color: #555;
  display: flex;
  gap: 4px;
  outline: none;
  padding: 8px 5px;
  pointer-events: all;
  transition: all 0.2s;
  width: 100%;

  > button {
    background: #0000;
    border: none;
    border-radius: 0;
    box-shadow: none;
    color: var(--color-states-dark);
    text-align: left;
    width: 100%;
  }

  &:hover {
    background: #f5fdfd;
  }
`

const AddSnippetButton = ({ updatePreview }) => {
  const {
    settings,
    onHistory,
    selectedCtx,
    selectedNode,
    setMarkedSnippet,
    markedSnippet,
  } = useContext(CssAssistantContext)

  const searchSnippetRef = useRef(null)
  const [showSnippets, setShowSnippets] = useState(false)
  const [search, setSearch] = useState('')
  const [searchByName, setSearchByName] = useState(false)

  const handleSearch = e => {
    setSearch(e.target.value)
  }

  useEffect(() => {
    setShowSnippets(false)
  }, [selectedNode])
  const isAdded = name => selectedNode?.classList?.contains(`aid-snip-${name}`)
  const isMarked = name => name === markedSnippet

  const sortedSnippets = useMemo(() => {
    const sorted = [
      ...mapEntries(
        settings.snippetsManager.snippets,
        (k, v) => isAdded(k) && [k, v],
      ).filter(Boolean),
      ...mapEntries(
        settings.snippetsManager.snippets,
        (k, v) =>
          !isAdded(k) && v.elementType === selectedNode?.localName && [k, v],
      ).filter(Boolean),
      ...mapEntries(
        settings.snippetsManager.snippets,
        (k, v) =>
          !isAdded(k) && v.elementType !== selectedNode?.localName && [k, v],
      ).filter(Boolean),
    ]

    const markedSnip = sorted.find(([k, v]) => k === markedSnippet)

    if (markedSnip) {
      sorted.splice(
        sorted.findIndex(([k, v]) => k === markedSnippet),
        1,
      )
      sorted.unshift(markedSnip)
    }

    return sorted
  }, [showSnippets, markedSnippet])

  return (
    <Root $active data-element="element-options">
      <button
        data-element="element-options"
        onClick={() => setShowSnippets(!showSnippets)}
        style={{ background: '#fffe', color: 'var(--color-blue)' }}
        title="Add snippet"
        type="button"
      >
        <PlusOutlined
          data-element="element-options"
          style={{ pointerEvents: 'none' }}
        />
      </button>
      <SubMenu
        $show={showSnippets}
        data-element="element-options"
        onMouseLeave={() => setShowSnippets(false)}
        style={{ marginTop: '7px' }}
        // $show
      >
        <span data-element="element-options">
          <small>Filter by:</small>
          <button
            data-element="element-options"
            onClick={() => setSearchByName(false)}
            style={{ border: `1px solid ${searchByName ? '#fff0' : '#fff5'}` }}
            type="button"
          >
            type
          </button>
          <button
            data-element="element-options"
            onClick={() => setSearchByName(true)}
            style={{ border: `1px solid ${searchByName ? '#fff5' : '#fff0'}` }}
            type="button"
          >
            name
          </button>
        </span>
        <span style={{ width: '100%', padding: '3px 0.7rem 3px 0.7rem' }}>
          <SearchOutlined />
          <input
            data-element="element-options"
            onChange={handleSearch}
            placeholder="Search snippet"
            ref={searchSnippetRef}
            value={search}
          />
        </span>
        <div
          style={{
            flexDirection: 'column',
            overflowY: 'auto',
            overflowX: 'hidden',
            background: '#fff',
          }}
        >
          {sortedSnippets.map(([k, v]) => {
            const searchMatch = searchByName
              ? k
              : htmlTagNames[v.elementType]?.toLowerCase() || v.elementType

            const filterBasedSearch = searchByName
              ? search.toLowerCase().replaceAll(' ', '-')
              : search.toLowerCase()

            return (
              (search.length <= 1 ||
                (search?.length > 1 &&
                  searchMatch.startsWith(filterBasedSearch))) && (
                <Snippet
                  $active={!isMarked(k) && isAdded(k)}
                  $marked={isMarked(k)}
                  data-element="element-options"
                  key={`${k}boxmenu`}
                  // style={isAdded(k) ? {borderLeft: '3px solid #00b0a7', color:'#00666d'} : {borderLeft: '3px solid #fff0'}
                >
                  <button
                    data-element="element-options"
                    onClick={() => {
                      onHistory.addRegistry('undo')
                      selectedCtx.node.classList.toggle(`aid-snip-${k}`)
                      updatePreview()
                      isMarked(k) && setMarkedSnippet('')
                    }}
                    title={v.description}
                    type="button"
                  >
                    {capitalize(k.replaceAll('-', ' '))}
                  </button>
                  <button
                    data-element="element-options"
                    onClick={e => {
                      e.preventDefault()
                      e.stopPropagation()
                      setMarkedSnippet(isMarked(k) ? '' : k)
                    }}
                    style={{ width: 'fit-content' }}
                    title={`Edit snippet via prompt: \nYou can change the styles, description\n name of the snippet and/or create a copy.\n Only one snippet can be edited at a time.\n`}
                    type="button"
                  >
                    {isAdded(k) && (
                      <EditOutlined style={{ pointerEvents: 'none' }} />
                    )}
                  </button>
                </Snippet>
              )
            )
          })}
        </div>
      </SubMenu>
    </Root>
  )
}
