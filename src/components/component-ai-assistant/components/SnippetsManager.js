/* stylelint-disable no-descending-specificity */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import React, { useContext, useMemo, useState } from 'react'
import styled from 'styled-components'
import { capitalize } from 'lodash'
import {
  CodeOutlined,
  DeleteOutlined,
  EditOutlined,
  MinusOutlined,
  PlusOutlined,
  FullscreenOutlined,
} from '@ant-design/icons'
import ReactCodeMirror from '@uiw/react-codemirror'
import { css } from '@codemirror/lang-css'
import { htmlTagNames, mapEntries, mapValues } from '../utils'
import { CssAssistantContext } from '../hooks/CssAssistantContext'
import Toggle from './Toggle'

const Root = styled.div`
  background-color: #fff;
  border-left: ${p => (p.alignment === 'right' ? '1px solid #0002' : '')};
  border-right: ${p => (p.alignment === 'left' ? '1px solid #0002' : '')};
  box-shadow: 0 11px 10px #0001;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 60vh;
  min-width: 40vw;
  overflow: hidden;
  position: absolute;
  top: -1px;
  z-index: 9999999;

  > div {
    background-image: linear-gradient(45deg, #f2f5f5, #f3f8f8);
    border-top: 1px solid #0002;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
  }

  > span {
    button {
      background-color: transparent;
      border: none;
      border-radius: 0;
      color: #555;
      width: fit-content;
    }
  }
`

const ListContainer = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  list-style: none;
  margin-top: 5px;
  max-width: 900px;
  padding: 15px;
`

const ListItem = styled.li`
  --color-states: ${p =>
    p.$active
      ? 'var(--color-green)'
      : p.$marked
      ? 'var(--color-orange)'
      : 'var(--color-blue)'};
  --color-states-dark: ${p =>
    p.$active
      ? 'var(--color-green-dark)'
      : p.$marked
      ? 'var(--color-orange-dark)'
      : 'var(--color-blue-dark)'};
  --color-enabled: var(--color-states);
  --height: 10px;

  background-color: ${p => (p.$selected ? '#fff9' : '#fffd')};
  border: 1px solid #0004;
  border-left: 8px solid var(--color-states);
  border-radius: 0 1rem 1rem 0;
  box-shadow: 0 0 6px #0003;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0.5rem 0;
  pointer-events: all;
  transform: scale(${p => (p.$selected ? 1.01 : 0.98)});
  transition: all 0.2s;

  > span {
    padding: 0.2rem 0.5rem 0.2rem 1rem;
  }

  > :first-child {
    color: var(--color-states-dark);
    display: flex;
    justify-content: space-between;
    margin: 0;
    padding: 0.2rem;

    h4 {
      border-radius: 0.5rem;
      margin: 0;
      padding: 0.2rem 0.5rem;
    }

    span {
      /* display: flex;
      gap: 4px;
      padding-right: 0.2rem; */
      > svg {
        height: 12px;
        width: 12px;
      }
    }
  }

  > :last-child {
    strong {
      align-self: flex-end;
      background-color: var(--color-states);
      border-radius: 1rem;
      color: #fff;
      font-size: 12px;
      margin-top: 0.5rem;
      padding: 0.3rem 0.7rem;
      transition: background-color 0.3s;
      width: fit-content;
    }

    > span {
      border-left: 1px solid #0002;
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 0.2rem 0.5rem;
      white-space: pre-line;
    }
  }
`

const Heading = styled.span`
  align-items: center;
  background-color: var(--color-blue);
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  /* cursor: ${p => (p.$dragging ? 'grabbing' : 'grab')}; */

  > span > svg,
  .anticon svg {
    display: flex;
    height: 18px;
    width: 18px;
  }

  .anticon svg {
    color: var(--color-states-dark);
  }

  h3 {
    color: #fff;
    font-size: 14px;
    line-height: 1;
    margin: 0;
  }
`

const Group = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 10px;

  p {
    margin: 0;
  }

  span {
    display: flex;
  }
`

const SnippetOptions = styled.span`
  align-self: flex-end;
  background: #fffd;
  border: 1px solid var(--color-blue-alpha);
  border-radius: 1rem;
  box-shadow: 0 0 3px #0002;
  font-size: 12px;
  gap: 8px;
  height: fit-content;
  justify-content: space-between;
  margin-top: 0.5rem;
  padding: 0.3rem 0.5rem;
  position: fixed;
  width: fit-content;
  z-index: 99999999;

  svg {
    color: var(--color-blue);
  }
`

const SnippetsFilterButton = styled.button`
  border: none;
  margin-inline: 8px;
  padding-inline: 0;
  transition: all 0.5s ease-in-out;
`

const TypesList = styled.span`
  background-color: #f8fbfb;
  border-top: 1px solid #0001;
  padding: 0.3rem 0.5rem;
`

const CssEditor = styled(ReactCodeMirror)`
  > :first-child {
    border: 1px solid #0002;
    border-radius: 8px;
    margin-top: 5px;
    max-height: 300px;
    min-height: 200px;
  }

  > :last-child span {
    border-left: none;
    display: inline-block;
    padding: 0;
    white-space: unset;
  }
`

// eslint-disable-next-line react/prop-types
export const SnippetsManager = ({ updatePreview, alignment = 'right' }) => {
  const {
    settings,
    onHistory,
    removeSnippet,
    selectedCtx,
    htmlSrc,
    markedSnippet,
    setMarkedSnippet,
  } = useContext(CssAssistantContext)

  const [width, setWidth] = useState('50%')
  const [filter, setFilter] = useState('all')
  const [selectedSnippets, setSelectedSnippets] = useState([])

  const removeSnip = name => {
    onHistory.addRegistry('undo')
    removeSnippet(name)
    markedSnippet === name && setMarkedSnippet('')
    updatePreview()
  }

  const nodeIsHtmlSrc = selectedCtx?.node === htmlSrc

  const mapSnippets = (k, v) => (
    <SnippetsList
      filter={filter}
      key={`${k}snipmanager`}
      removeSnip={removeSnip}
      selectedSnippets={selectedSnippets}
      setSelectedSnippets={setSelectedSnippets}
      snippetName={k}
      snippetValue={v}
      updatePreview={updatePreview}
    />
  )

  const allElementTypes = [
    'all',
    ...new Set(
      mapValues(
        settings.snippetsManager.snippets,
        v => v.elementType,
      ).reverse(),
    ),
  ]

  const mappedSnippets = useMemo(
    () => mapEntries(settings.snippetsManager.snippets, mapSnippets).reverse(),
    [
      selectedCtx,
      mapSnippets,
      settings.snippetsManager.snippets,
      filter,
      selectedSnippets,
    ],
  )

  return (
    <Root
      alignment={width !== '100%' && alignment}
      onClick={() => setSelectedSnippets([])}
      style={{ [alignment]: 0, width }}
    >
      <Heading>
        <h3>SNIPPETS MANAGER</h3>
        <span>
          <FullscreenOutlined
            onClick={() => setWidth(width === '50%' ? '100%' : '50%')}
            style={{ color: '#fff' }}
          />
        </span>
      </Heading>
      <TypesList onClick={e => e.stopPropagation()}>
        {allElementTypes.map(type => (
          <SnippetsFilterButton
            key={type}
            onClick={e => {
              e.stopPropagation()
              setFilter(type)
              setSelectedSnippets([])
            }}
            style={{
              borderBottom: `2px solid ${
                filter === type ? 'var(--color-blue)' : '#fff0'
              }`,
            }}
          >
            {htmlTagNames[type] ? htmlTagNames[type] : capitalize(type)}
          </SnippetsFilterButton>
        ))}
      </TypesList>

      <Group style={{ position: 'relative', overflowY: 'scroll' }}>
        {selectedSnippets.length > 1 && (
          <SnippetOptions>
            {!nodeIsHtmlSrc && (
              <>
                <PlusOutlined
                  onClick={e => {
                    e.stopPropagation()
                    selectedSnippets.forEach(snippet => {
                      selectedCtx.node.classList.add(`aid-snip-${snippet}`)
                    })
                    updatePreview(true)
                  }}
                  title="Add selected snippets"
                />
                <MinusOutlined
                  onClick={() => {
                    selectedSnippets.forEach(snippet => {
                      selectedCtx.node.classList.remove(`aid-snip-${snippet}`)
                    })
                    updatePreview(true)
                  }}
                  title="Remove selected snippets"
                />
              </>
            )}
            <DeleteOutlined
              onClick={() => {
                selectedSnippets.forEach(snippet => {
                  removeSnip(snippet)
                })
                setSelectedSnippets([])
                updatePreview(true)
              }}
              title="Remove selected snippets (from document)"
            />
          </SnippetOptions>
        )}
        <ListContainer>{mappedSnippets}</ListContainer>
      </Group>
    </Root>
  )
}

const SnippetsList = ({
  snippetName,
  snippetValue,
  updatePreview,
  removeSnip,
  filter,
  selectedSnippets,
  setSelectedSnippets,
}) => {
  const {
    markedSnippet,
    selectedCtx,
    nodeIsHtmlSrc,
    setMarkedSnippet,
    htmlSrc,
    updateSnippetBody,
    settings,
  } = useContext(CssAssistantContext)

  const [showCss, setShowCss] = useState(
    settings.snippetsManager.showCssByDefault,
  )

  const isMarked = markedSnippet === snippetName

  const isAdded = selectedCtx?.node?.classList.contains(
    `aid-snip-${snippetName}`,
  )

  const nodeHasMarkedSnip = selectedCtx?.node?.classList.contains(
    `aid-snip-${markedSnippet}`,
  )

  const containsClass = !nodeIsHtmlSrc && isAdded

  const handleToggleSnippet = e => {
    e.preventDefault()
    e.stopPropagation()
    !nodeIsHtmlSrc &&
      snippetName &&
      selectedCtx.node.classList.toggle(`aid-snip-${snippetName}`)
    isAdded && isMarked
      ? setMarkedSnippet('')
      : !nodeHasMarkedSnip && setMarkedSnippet('')
    updatePreview()
  }

  return (
    (snippetValue.elementType === filter || filter === 'all' || !filter) && (
      <ListItem
        $active={!isMarked && isAdded}
        $marked={isMarked}
        $selected={selectedSnippets.includes(snippetName)}
        key={`${snippetName}-sn`}
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
          setSelectedSnippets(prev =>
            selectedSnippets.includes(snippetName)
              ? prev.filter(s => s !== snippetName)
              : [...prev, snippetName],
          )
        }}
      >
        <span>
          <h4>{capitalize(snippetName.replaceAll('-', ' '))}</h4>
          <span
            style={{
              alignItems: 'center',
              gap: '6px',
              height: 'fit-content',
              paddingRight: '8px',
            }}
          >
            {isAdded && isMarked && <small>editing</small>}
            {isMarked && (
              <CodeOutlined
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowCss(!showCss)
                }}
                title={`${showCss ? 'Hide' : 'Show'} CSS editor`}
              />
            )}
            {isAdded && (
              <EditOutlined
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  setMarkedSnippet(isMarked ? '' : snippetName)
                }}
                title={`Edit snippet via prompt: \nYou can update the styles, description\n name of the snippet and/or create a copy.\n Only one snippet can be edited at a time.\n`}
              />
            )}
            <DeleteOutlined
              onClick={() => removeSnip(snippetName)}
              style={{ marginRight: '8px' }}
              title="Remove snippet(from document)"
            />
            {selectedCtx?.node !== htmlSrc && (
              <Toggle
                checked={containsClass}
                handleChange={handleToggleSnippet}
                style={{ margin: 0 }}
                title="Add snippet"
              />
            )}
          </span>
        </span>
        <span style={{ flexDirection: 'column' }}>
          <span>
            <small>Description:</small>
            <p style={{ padding: '0 0.5rem' }}>{`${capitalize(
              snippetValue.description,
            )}`}</p>
          </span>
          {isMarked && showCss && (
            <CssEditor
              extensions={[css()]}
              onChange={content => {
                updateSnippetBody(snippetName, content)
                updatePreview(true)
              }}
              value={snippetValue.classBody}
            />
          )}
          <strong>
            {htmlTagNames[snippetValue.elementType] ||
              capitalize(snippetValue.elementType)}
          </strong>
        </span>
      </ListItem>
    )
  )
}

export default SnippetsManager
