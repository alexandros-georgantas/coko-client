/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable no-param-reassign */
import React, { createContext, useMemo, useRef, useState } from 'react'
import { keys, merge, takeRight } from 'lodash'
import {
  callOn,
  htmlTagNames,
  safeCall,
  safeId,
  setInlineStyle,
  Icons,
  onEntries,
  updateSnippet,
  getSnippetsBy,
  onKeys,
  newSnippet,
} from '../utils'

const defaultSettings = {
  editor: {
    advancedTools: true,
    contentEditable: false,
    enablePaste: true,
    enableSnippets: true,
    createNewSnippetVersions: false,
    selectionColor: { bg: '#0001', border: '#0008' },
    snippets: {
      exceltable: {
        borderCollapse: 'collapse',
        width: '100%',
        classBody: `\t\tborder: 1px solid #d4d4d4;
    tbody > tr > td {
      border: 1px solid #d4d4d4;
      padding: 8px;
      textAlign: left;
    }
    tbody > tr:nth-of-type(odd) {
      backgroundColor: '#f2f2f2';
    }`,
      },
      rotate: {
        description: 'rotates the element by 90 degrees',
        classBody: `
    transform: rotate(15deg);
    p {
      color: #f00;
    }
    p:nth-of-type(2) {
      color: #0f0; 
    }`,
      },
      scale: {
        description: 'scale the element',
        classBody: 'transform: scale(1.5);',
      },
      grayscale: {
        description: 'grayscale the element',
        classBody: 'filter: grayscale(100%);',
      },
    },
  },
  historyMax: 6,
  Icons,
}

export const CssAssistantContext = createContext()

// eslint-disable-next-line react/prop-types
export const CssAssistantProvider = ({ children }) => {
  // #region HOOKS ----------------------------------------------------------------
  const context = useRef([])
  const validSelectors = useRef(null)
  const styleSheetRef = useRef(null)

  const history = useRef({
    prompts: { active: true, index: 0 },
    source: { redo: [], undo: [], limit: { undo: 20, redo: 20 } },
  })

  const selectionBoxRef = useRef(null)

  const [selectedCtx, setSelectedCtx] = useState([])
  const [selectedNode, setSelectedNode] = useState(null)

  const [htmlSrc, setHtmlSrc] = useState(null)
  const [css, setCss] = useState(null)
  const [passedContent, setPassedContent] = useState('')
  const [copiedSnippet, setCopiedSnippet] = useState(null)
  const [markedSnippet, setMarkedSnippet] = useState('')

  const [feedback, setFeedback] = useState('')

  const [settings, setSettings] = useState(defaultSettings)

  const promptRef = useRef(null)
  const [userPrompt, setUserPrompt] = useState('')
  // #endregion HOOKS ----------------------------------------------------------------

  // #region CONTEXT ----------------------------------------------------------------
  const makeSelector = (node, parent) => {
    const tagName = node.localName || node.tagName.toLowerCase()

    const parentSelector = parent || ''

    const classNames =
      [...node.classList].length > 0 ? `.${[...node.classList].join('.')}` : ''

    const selector = `${
      parentSelector
        ? `${parentSelector} > ${tagName}`
        : `${tagName}${node.id ? `#${node.id}` : ''}`
    }`.trim()

    return { selector, tagName, classNames }
  }

  const makeSelectors = (node, parentSelector) => {
    const selectors = []
    const allChilds = node?.children ? [...node.children] : []

    const { selector } = makeSelector(node, parentSelector)

    selectors.push(selector)

    if (allChilds.length > 0) {
      allChilds.forEach(
        child =>
          (child.title = `${
            htmlTagNames[child.tagName.toLowerCase()]
          } : <${child.tagName.toLowerCase()}>`),
      )

      const allChildsSelectors = allChilds.flatMap(
        child => child && makeSelectors(child, selector),
      )

      allChildsSelectors && selectors.push(...allChildsSelectors)
    }

    return [...new Set(selectors)]
  }

  const getValidSelectors = (node, parentSelector = '') => {
    const selectors = makeSelectors(node, parentSelector)
    validSelectors.current = selectors
  }

  const newCtx = (node, parent, snippets = {}, addSelector = true) => {
    const { selector, tagName } = makeSelector(node, parent)

    const dataRef = safeId(
      'aid-ctx',
      context.current.map(ctx => ctx.dataRef),
    )

    node.setAttribute('data-aidctx', dataRef)
    return {
      selector: addSelector ? selector : '',
      node,
      dataRef,
      tagName,
      // rules,
      snippets,
      history: [],
    }
  }

  const addToCtx = ctx => {
    if (ctx.selector && getCtxBy('selector', ctx.selector)) return false
    context.current = [...context.current, ctx]
    return ctx
  }

  const getCtxBy = (by, prop, all) => {
    const method = all ? 'filter' : 'find'

    const ctxProps = {
      node: node => context.current[method](ctx => ctx.node === node),
      selector: selector =>
        context.current[method](ctx => ctx.selector === selector),
      tagName: tag => context.current[method](ctx => ctx.tagName === tag),
      dataRef: data => context.current[method](ctx => ctx.dataRef === data),
      snippet: snippet => context.current[method](ctx => ctx.snippets[snippet]),
      default: node => context.current[method](ctx => ctx),
    }

    return callOn(by, ctxProps, [prop])
  }

  const updateCtxNodes = () => {
    htmlSrc &&
      context.current.forEach(ctx => {
        if (ctx.node !== htmlSrc && !ctx.node) {
          const node = htmlSrc.querySelector(`[data-aidctx = ${ctx.dataRef}]`)
          ctx.node = node
          ctx.tagName = node.localName || node.tagName.toLowerCase()
        }
      })
  }

  const clearHistory = () => {
    selectedCtx.history = []
    setSelectedCtx({ ...selectedCtx })
  }

  const deleteLastMessage = () => {
    const newHistory = [...selectedCtx.history]
    newHistory.pop()
    selectedCtx.history = newHistory
    setSelectedCtx({ ...selectedCtx })
  }

  // #endregion CONTEXT -------------------------------------------------------------

  // #region HELPERS -----------------------------------------------------------------
  const createStyleSheet = onCreate => {
    if (!document.getElementById('css-assistant-scoped-styles')) {
      const styleTag = document.createElement('style')
      styleTag.id = 'css-assistant-scoped-styles'
      safeCall(onCreate)(styleTag)
      return styleTag
    }

    return document.getElementById('css-assistant-scoped-styles')
  }

  const updateSelectionBoxPosition = (yOffset = 10, xOffset = 10) => {
    if (selectedNode !== htmlSrc) {
      if (selectedNode && selectionBoxRef?.current) {
        const { top, left, height, width } =
          selectedNode.getBoundingClientRect()

        const parent = selectionBoxRef?.current?.parentNode
        const { left: pLeft, top: pTop } = parent.getBoundingClientRect()

        setInlineStyle(selectionBoxRef.current, {
          opacity: 1,
          left: `${left - pLeft - xOffset}px`,
          top: `${Math.floor(parent.scrollTop + top - pTop - yOffset)}px`,
          width: `${width + xOffset * 2}px`,
          height: `${height + yOffset * 2}px`,
          zIndex: '9',
        })
      }
    } else selectionBoxRef.current.style.opacity = 0
  }

  // TODO: add snippets to history registry
  const onHistory = {
    addRegistry: (
      regKey,
      registry = {
        css: styleSheetRef.current.textContent,
        content: htmlSrc.innerHTML,
      },
    ) => {
      if (!registry) return
      const { source } = history.current

      const newRegistry = {
        undo: takeRight(source.undo.concat(registry), source.limit.undo),
        redo: takeRight(source.redo.concat(registry), source.limit.redo),
      }

      history.current.source[regKey] = newRegistry[regKey]
    },
    apply: regKey => {
      const { source } = history.current

      if (source[regKey].length < 1) return
      const lastRegistry = source[regKey].pop()

      onHistory.addRegistry(regKey === 'undo' ? 'redo' : 'undo', {
        css: styleSheetRef.current.textContent,
        content: htmlSrc.innerHTML,
      })

      styleSheetRef.current.textContent = lastRegistry.css
      setPassedContent(lastRegistry.content)
      setCss(lastRegistry.css)
    },
  }

  // #endregion HELPERS -----------------------------------------------------------------

  // #region SNIPPETS -------------------------------------------------------------------
  const addSnippet = (node, snippet) => {
    const snippetToAdd = !settings.editor.createNewSnippetVersions
      ? { ...snippet }
      : newSnippet(snippet, keys(snippet)[0], keys(settings.editor.snippets))

    onKeys(snippetToAdd, k => (snippetToAdd[k].active = true))
    settings.editor.createNewSnippetVersions &&
      !getMarkedSnippetName() &&
      onKeys(snippetToAdd, k => (snippetToAdd[k].marked = true))
    const snippets = updateSnippet(snippetToAdd, settings.editor.snippets)
    setSettings(prev => {
      return merge({}, { ...prev }, { editor: { snippets } })
    })
    getCtxBy('node', node).snippets = merge(
      {},
      getCtxBy('node', node).snippets,
      snippetToAdd,
    )
    addSnippetsClass()
    setMarkedSnippet(getMarkedSnippetName())
  }

  const removeSnippet = (snippetName, node) => {
    if (!node) {
      const updatedSnippets = settings.editor.snippets
      delete updatedSnippets[snippetName]
      setSettings(prev => {
        return merge({}, { ...prev }, { editor: { ...updatedSnippets } })
      })
      getCtxBy('snippet', snippetName, true).forEach(ctx => {
        delete ctx.snippets[snippetName]
        ctx.node.classList.remove(`aid-snip-${snippetName}`)
      })
    } else {
      delete selectedCtx.snippets[snippetName]
      selectedNode.classList.remove(`aid-snip-${snippetName}`)
    }
  }

  const getMarkedSnippetName = () =>
    selectedCtx?.snippets
      ? keys(getSnippetsBy(selectedCtx.snippets, 'marked'))[0] ?? ''
      : ''

  const addSnippetsClass = () => {
    onEntries(selectedCtx.snippets, (snippetName, snippetValues) => {
      const className = `aid-snip-${snippetName}`

      snippetValues.active
        ? selectedCtx.node.classList.add(className)
        : selectedCtx.node.classList.remove(className)
    })
  }

  const updateSnippetDescription = (snippetName, description) => {
    const { snippets } = settings.editor
    snippets[snippetName].description = description
    setSettings(prev => {
      return merge({}, { ...prev }, { editor: { snippets } })
    })
    getCtxBy('snippet', snippetName, true).forEach(ctx => {
      ctx.snippets[snippetName].description = description
    })
  }

  // #endregion SNIPPETS -------------------------------------------------------------------

  const dom = useMemo(() => {
    return {
      promptRef,
      styleSheetRef,
      createStyleSheet,
    }
  }, [styleSheetRef, promptRef])

  const ctx = useMemo(() => {
    return {
      context,
      history,
      validSelectors,
      selectedNode,
      selectedCtx,
      setSelectedCtx,
      setSelectedNode,
    }
  }, [context, history, selectedCtx, selectedNode, validSelectors])

  const chatGpt = useMemo(() => {
    return {
      css,
      htmlSrc,
      feedback,
      userPrompt,
      setCss,
      setHtmlSrc,
      setFeedback,
      setUserPrompt,
    }
  }, [css, htmlSrc, feedback, userPrompt])

  const nodeOptions = useMemo(() => {
    return {
      copiedSnippet,
      setCopiedSnippet,
    }
  }, [copiedSnippet])

  return (
    <CssAssistantContext.Provider
      value={{
        ...dom,
        ...ctx,
        ...chatGpt,
        ...nodeOptions,
        getValidSelectors,
        makeSelector,
        addToCtx,
        getCtxBy,
        newCtx,
        clearHistory,
        updateCtxNodes,
        passedContent,
        selectionBoxRef,
        setPassedContent,
        updateSelectionBoxPosition,
        deleteLastMessage,
        onHistory,
        settings,
        setSettings,
        // TODO: memoize in a new object
        addSnippetsClass,
        addSnippet,
        removeSnippet,
        getMarkedSnippetName,
        markedSnippet,
        setMarkedSnippet,
        updateSnippetDescription,
      }}
    >
      {children}
    </CssAssistantContext.Provider>
  )
}

export const ModalContext = createContext()

// eslint-disable-next-line react/prop-types
export const ModalProvider = ({ children }) => {
  const [openModal, setOpenModal] = useState(false)
  const modalContent = useRef(null)

  const values = {
    openModal,
    modalContent,
    setOpenModal,
  }

  return (
    <ModalContext.Provider value={values}>{children}</ModalContext.Provider>
  )
}
