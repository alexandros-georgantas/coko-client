/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable no-param-reassign */
import React, { createContext, useMemo, useRef, useState } from 'react'
import { keys, merge, takeRight } from 'lodash'
import {
  callOn,
  safeCall,
  safeId,
  setInlineStyle,
  SendIcon,
  SettingsIcon,
  DeleteIcon,
  UndoIcon,
  RedoIcon,
  RefreshIcon,
  newSnippet,
  saveToLs,
} from '../utils'

const defaultSettings = {
  gui: {
    showChatBubble: false,
    advancedTools: true,
  },
  editor: {
    contentEditable: true,
    enablePaste: true,
    selectionColor: {
      bg: 'var(--color-blue-alpha-2)',
      border: 'var(--color-blue-alpha-1)',
    },
  },
  snippetsManager: {
    enableSnippets: true,
    showCssByDefault: true,
    createNewSnippetVersions: false,
    markNewSnippet: true,
    snippets: {
      'excel-table': {
        elementType: 'table',
        description:
          'Styles the table to resemble an Excel spreadsheet with professional styling.',
        classBody:
          "border-collapse: collapse; width: 100%;\n  th, td {\n    border: 1px solid #dddddd;\n    text-align: left;\n    padding: 8px;\n  }\n  th {\n    background-color: #f2f2f2;\n    color: #333;\n  }\n  tr:nth-child(even) {\n    background-color: #f9f9f9;\n  }\n  tr:hover {\n    background-color: #f1f1f1;\n  }\n  td {\n    font-family: Arial, sans-serif;\n  }\n  th {\n    font-family: 'Calibri', sans-serif;\n    font-weight: bold;\n  }\n",
      },
      'text-flow-around-image': {
        elementType: 'any',
        description: 'Makes the text flow around the images',
        classBody: `img, figure, picture, svg {\n\tfloat: left;\n\tmargin-right: 2ch;\n}\np {\n\ttext-align: justify;\n}`,
      },
      scale: {
        elementType: 'any',
        description: 'scales the element',
        classBody: 'transform: scale(1.1);',
      },
      grayscale: {
        elementType: 'any',
        description: 'grayscale the element',
        classBody: 'filter: grayscale(100%);',
      },
      'tibetan-to-phonetics': {
        description:
          'this is the snippet applied to all tibetan to phonetics translations',
        classBody: 'color: red;\nfont-style: italic;',
        elementType: 'any',
      },
    },
  },
  Icons: {
    SendIcon,
    SettingsIcon,
    DeleteIcon,
    UndoIcon,
    RedoIcon,
    RefreshIcon,
  },
  chat: {
    historyMax: 6,
  },
}

export const CssAssistantContext = createContext()

// eslint-disable-next-line react/prop-types
export const CssAssistantProvider = ({ children }) => {
  // #region HOOKS ----------------------------------------------------------------
  const context = useRef([])
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
      default: () => context.current[method](ctx => ctx),
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

  const saveSession = () => {
    saveToLs(
      {
        settings,
        css,
        content: htmlSrc.innerHtml,
      },
      'storedsession',
    )
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
    const snippetToAdd = !settings.snippetsManager.createNewSnippetVersions
      ? { ...snippet }
      : newSnippet(
          snippet,
          keys(snippet)[0],
          keys(settings.snippetsManager.snippets),
        )

    node.classList.add(`aid-snip-${keys(snippetToAdd)[0]}`)
    const snippets = merge({}, settings.snippetsManager.snippets, snippetToAdd)
    setSettings(prev => {
      return merge({}, { ...prev }, { snippetsManager: { snippets } })
    })
    settings.snippetsManager.markNewSnippet &&
      !markedSnippet &&
      setMarkedSnippet(keys(snippetToAdd)[0])
  }

  const removeSnippet = (snippetName, node) => {
    if (!node) {
      const updatedSnippets = settings.snippetsManager.snippets
      typeof snippetName === 'string'
        ? delete updatedSnippets[snippetName]
        : snippetName.forEach(sn => delete updatedSnippets[sn])
      setSettings(prev => {
        return merge({}, { ...prev }, { editor: { ...updatedSnippets } })
      })
      document.querySelectorAll(`aid-snip-${snippetName}`).forEach(n => {
        n.classList.remove(`aid-snip-${snippetName}`)
      })
    } else {
      selectedNode.classList.remove(`aid-snip-${snippetName}`)
    }
  }

  // const getMarkedSnippetName = () =>
  //   selectedCtx?.snippets
  //     ? keys(getSnippetsBy(selectedCtx.snippets, 'marked'))[0] ?? ''
  //     : ''

  // const addSnippetsClass = (snipName) => {
  //   if (snipName) {
  //     selectedCtx.node.classList.toggle(`aid-snip-${snipName}`)
  //   } else {
  //     onEntries(selectedCtx.snippets, (snippetName, snippetValues) => {
  //       const className = `aid-snip-${snippetName}`
  //       snippetValues.active
  //         ? selectedCtx.node.classList.add(className)
  //         : selectedCtx.node.classList.remove(className)
  //     })
  //   }
  // }

  const updateSnippetDescription = (snippetName, description) => {
    const { snippets } = settings.snippetsManager
    snippets[snippetName].description = description
    setSettings(prev => {
      return merge({}, { ...prev }, { snippetsManager: { snippets } })
    })
  }

  const updateSnippetBody = (snippetName, body) => {
    const { snippets } = settings.snippetsManager
    snippets[snippetName].classBody = body
    setSettings(prev => {
      return merge({}, { ...prev }, { snippetsManager: { snippets } })
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
      selectedNode,
      selectedCtx,
      setSelectedCtx,
      setSelectedNode,
    }
  }, [context, history, selectedCtx, selectedNode])

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

  return (
    <CssAssistantContext.Provider
      value={{
        ...dom,
        ...ctx,
        ...chatGpt,
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
        addSnippet,
        removeSnippet,
        // getMarkedSnippetName,
        markedSnippet,
        setMarkedSnippet,
        updateSnippetDescription,
        updateSnippetBody,
        saveSession,
      }}
    >
      {children}
    </CssAssistantContext.Provider>
  )
}
