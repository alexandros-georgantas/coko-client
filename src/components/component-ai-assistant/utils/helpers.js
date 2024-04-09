import { merge } from 'lodash'
// import LanguageDetect from 'languagedetect'

// import DetectLanguage from 'detectlanguage'
import { mapEntries, onEntries, safeCall } from './utils'

// const detectlanguage = new DetectLanguage('16d59c67b2a8538c31bbd7c129fe0f2d')

// const lngDetector = new LanguageDetect()

export const srcdoc = (scope, css, template, scrollPos) => /* html */ `
    <!DOCTYPE html>
    <html>
    <head>
      <script src="https://unpkg.com/pagedjs@0.4.3/dist/paged.polyfill.js"></script>
      <style>
        ${template}
        ${css.replace('#body', 'body') || ''}
      </style>
    </head>
    <body>
      ${scope.outerHTML.replace('contenteditable="true"', '')}
      <script>
        document.addEventListener("DOMContentLoaded", () => {
          const scopeIsReady = document.getElementById("css-assistant-scope")

          try {
            scopeIsReady && PagedPolyfill.preview(scopeIsReady);
          }
          catch (e) { window.parent.console.log(e) }
          setTimeout(() => document.documentElement.scrollTo(0, ${scrollPos}), 100)
        });
          document.addEventListener("scroll", () => {
            if(document.documentElement.scrollTop < 10) {
              document.documentElement.scrollTo(0, 10)
            }
          })
      </script>
    </body>
    </html>
`

export function parseContent(htmlString, cb) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')

  doc.querySelectorAll('*').forEach(element => {
    const text = element.textContent

    if (text) {
      const isTibetan = /[\u0F00-\u0FFF]/.test(text)
      //   const lng = text && lngDetector.detect(text)[0]
      //   const lngFound = lng && lngDetector.getLanguages().includes(`${lng[0]}`)
      //   lngFound && element.classList.add(`${lng[0]}`)
      isTibetan && element.classList.add('tibetan')
    }

    // text && console.log(detectlanguage.detect(text))
    // detectlanguage.detect(text).then(function (result) {
    // 	console.log(
    // 		`${ansi("yellow")}${result[0].language} ${ansi("white")}${text}`
    // 	);
    // });
    element.removeAttribute('style')
  })

  safeCall(cb)(doc)

  const serializer = new XMLSerializer()
  const cleanedHtmlString = serializer.serializeToString(doc)

  return cleanedHtmlString
}

// can be useful for setting the inlinestyles
export const cssStringToObject = cssString => {
  const cssObject = {}

  if (cssString.includes('{')) {
    const ruleSets = cssString.split('}')

    ruleSets.forEach(ruleSet => {
      if (!ruleSet) return
      const [selector = '', rules = ''] = ruleSet.split('{')

      const trimmedSelector = selector.trim()
      const trimmedRules = rules.trim().slice(0, -1)

      const declarations = trimmedRules.split(';')

      cssObject[trimmedSelector] = {}

      declarations.forEach(declaration => {
        const [property = '', value = ''] = declaration.split(':')

        if (property && value) {
          cssObject[trimmedSelector][property.trim()] = value.trim()
        }
      })
    })
  } else {
    cssString.split(';').forEach(rule => {
      const [ruleName, value] = rule.split(':')
      if (!ruleName || !value) return
      cssObject[ruleName.trim()] = value.trim()
    })
  }

  return cssObject
}

export const setInlineStyle = (node, styles) => {
  if (typeof styles === 'object' && !Array.isArray(styles)) {
    const nodeRef = node
    onEntries(styles, (k, v) => {
      nodeRef.style[k] = v
    })
  }
}

export const setImagesDefaultStyles = node => {
  ;['picture', 'img', 'figure'].includes(node.localName) &&
    setInlineStyle(node, {
      objectFit: 'contain',
      width: '100%',
      height: 'auto',
    })
}

// #region SNIPPETS

export const snippetsToCssText = (
  snippets,
  prefix = 'div#assistant-ctx .aid-snip-',
) =>
  mapEntries(snippets, (k, { description, classBody }) =>
    k
      ? `
    /* ${description} */
    ${prefix + k} {
      ${classBody}
    }
    `
      : '',
  ).join('\n')

export const getSnippetsBy = (node, snippets) => {
  const classList = [...node.classList].map(c => c.replace('aid-snip-', ''))
  const snips = {}
  onEntries(snippets, (k, v) => classList.includes(k) && (snips[k] = v))
  //   console.log(snips)
  return snippetsToCssText(snips)
}

export const getSnippetsByElementType = (snippets, elementType = '*') =>
  Object.entries(snippets).reduce((acc, [k, v]) => {
    if (v.elementType === elementType || elementType === '*') {
      acc[k] = v
    }

    return acc
  }, {})

export const newSnippet = (snippet, name, snippetsKeys) => {
  const selector = safeId(name, snippetsKeys)
  return { [selector]: { ...snippet[name] } }
}

export const updateSnippet = (snippet, allSnippets) =>
  merge({}, allSnippets, snippet)

export const addElement = (parentElement, options) => {
  const { position = 'afterend', html } = options
  parentElement.insertAdjacentHTML(position, html)
}
// #endregion SNIPPETS

export const safeId = (prefix, existingIds) => {
  let proposedId = 1

  while (existingIds.includes(`${prefix}-${proposedId}`)) {
    proposedId += 1
  }

  return `${prefix}-${proposedId}`
}

export const toSnake = key =>
  key
    .split(/(?=[A-Z])/)
    .map(word => word.toLowerCase())
    .join('-')

export const getScrollPercent = node =>
  (node.scrollTop / (node.scrollHeight - node.offsetHeight)) * 100

export const setScrollFromPercent = (node, percentage) =>
  (percentage * node.scrollHeight) / 100

export const safeIndex = (index, direction, list, min = 0) => {
  let finalIndex
  const max = list.length - 1

  const options = {
    down: () => (index > max ? (finalIndex = min) : (finalIndex = index)),
    up: () => (index < min ? (finalIndex = max) : (finalIndex = index)),
    'up-stop': () => (index < min ? (finalIndex = min) : (finalIndex = index)),
    'down-stop': () =>
      index > max ? (finalIndex = max) : (finalIndex = index),
  }

  safeCall(options[direction])
  return finalIndex
}

export const saveToLs = (save, name) => {
  window.localStorage.setItem(name, JSON.stringify(save))
}

export const loadFromLs = name => {
  const item = window.localStorage.getItem(name)
  return JSON.parse(item)
}

export const ansi = color => {
  const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    yellow: '\x1b[33m',
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    underline: '\x1b[4m',
    blink: '\x1b[5m',
    invert: '\x1b[7m',
  }

  return typeof color === 'string'
    ? colors[color]
    : color.map(c => ansi(c)).join('')
}
