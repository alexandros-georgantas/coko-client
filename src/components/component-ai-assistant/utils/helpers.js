import { merge } from 'lodash'
import { mapEntries, onEntries } from './utils'

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

export function removeStyleAttribute(htmlString) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')

  doc.querySelectorAll('*').forEach(element => {
    element.removeAttribute('style')
  })

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

export const snippetsToCssText = (snippets, prefix = '.aid-snip-') =>
  mapEntries(
    snippets,
    (k, { description, classBody }) => `
    /* ${description} */
    ${prefix + k} {
      ${classBody}
    }
    `,
  ).join('\n')

export const getSnippetsBy = (snippets, prop = 'active') =>
  Object.entries(snippets).reduce((acc, [k, v]) => {
    if (v[prop]) {
      acc[k] = v
    }

    return acc
  }, {})

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
