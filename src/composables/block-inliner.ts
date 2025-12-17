import type MarkdownIt from 'markdown-it'
import type { StateCore } from 'markdown-it/dist/index.cjs.js'
import Token from 'markdown-it/lib/token.mjs'

// Use https://markdown-it.github.io/#md3=%7B%22source%22%3A%22sometext%22%2C%22defaults%22%3A%7B%22html%22%3Atrue%2C%22xhtmlOut%22%3Afalse%2C%22breaks%22%3Afalse%2C%22langPrefix%22%3A%22language-%22%2C%22linkify%22%3Afalse%2C%22typographer%22%3Afalse%2C%22_highlight%22%3Afalse%2C%22_strict%22%3Afalse%2C%22_view%22%3A%22debug%22%7D%7D to debug markdown tokens

// Reference is https://github.com/markdown-it/markdown-it/blob/master/lib/renderer.mjs#L77

export function inlinePlugin(md: MarkdownIt) {
  function getParagraphToken(version: 'open' | 'close'): Token {
    const nesting = version === 'open' ? 1 : -1
    const type = `paragraph_${version}`
    const token = new Token(type, 'p', nesting)
    token.block = true
    return token
  }

  md.core.ruler.after('block', 'inline_tables', (state: StateCore) => {
    const tokens = state.tokens
    const indexes: number[] = []

    // Parse inlines
    for (let i = 0, l = tokens.length; i < l; i++) {
      const token = tokens[i]
      if (token.type === 'html_block' && token.content.match(/<(?:table|ul)>/)) {
        indexes.push(i)
      }
    }

    for (const idx of indexes) {
      const token = tokens[idx]

      const paragraphOpen = getParagraphToken('open')
      paragraphOpen.map = token.map

      token.type = 'inline'
      // token.content = token.content.replaceAll(/<td>\*\*(.*?)\*\*<\/td>/gs, '<th>$1</th>')
      token.content = token.content.replaceAll(/<th>(.*?)<\/th>/gs, '<td>**$1**</td>')
      token.children = []

      state.tokens = tokens.toSpliced(idx, 1, paragraphOpen, token, getParagraphToken('close'))
    }
  })
}
