import type { MarkdownIt, StateCore, Token } from 'markdown-it'
import * as MarkdownItModule from 'markdown-it'
import { actionToImage, useActionImage } from './image-finder'

const TokenBuilder = MarkdownItModule.default.Token

// Use https://markdown-it.github.io/#md3=%7B%22source%22%3A%22sometext%22%2C%22defaults%22%3A%7B%22html%22%3Atrue%2C%22xhtmlOut%22%3Afalse%2C%22breaks%22%3Afalse%2C%22langPrefix%22%3A%22language-%22%2C%22linkify%22%3Afalse%2C%22typographer%22%3Afalse%2C%22_highlight%22%3Afalse%2C%22_strict%22%3Afalse%2C%22_view%22%3A%22debug%22%7D%7D to debug markdown tokens

// Reference is https://github.com/markdown-it/markdown-it/blob/master/lib/renderer.mjs#L77

const matchGroup = Object.keys(actionToImage).join('|')
type Action = keyof typeof actionToImage

export function imagePlugin(md: MarkdownIt, className: string) {
  function getImageToken(actionName: Action, classOverride?: string): Token {
    const token = new TokenBuilder('image', 'img', 0)
    token.attrs = [
      ['src', useActionImage(actionName)],
      ['alt', actionName],
      ['class', classOverride ?? className],
    ]
    token.children = [getTextToken(actionName)]
    return token
  }
  function getTextToken(text: string): Token {
    const token = new TokenBuilder('text', '', 0)
    token.content = text
    return token
  }

  const regex = new RegExp(`<actions string="(${matchGroup})(?:( (?:or|to) )(?:(${matchGroup})|(.*?)(?: Actions)?))?"`)
  function matchActions(token: Token): [Action, Action | null, string | null] | null {
    const match = token.content.match(regex)
    if (!match) {
      return null
    }

    let secondAction: Action | null = null
    if (match[3] in actionToImage) {
      secondAction = match[3] as Action
    }

    return [match[1] as Action, secondAction, match[2] ? match[2] + (match[4] ?? '') : null]
  }

  md.core.ruler.after('inline', 'inline_actions', (state: StateCore) => {
    const tokens = state.tokens
    const env = state.env as { actionClass: string | undefined }
    const classOverride = env.actionClass

    // Parse inlines
    for (let i = 0, l = tokens.length; i < l; i++) {
      const token = tokens[i]
      if (token.type !== 'inline' || !token.content.match(/<actions string=/) || !token.children) {
        continue
      }
      for (let j = 0, cl = token.children.length; j < cl; j++) {
        const child = token.children[j]
        if (child.type !== 'html_inline') {
          continue
        }
        const match = matchActions(child)
        if (!match) {
          continue
        }

        const [first, second, text] = match
        const splitTokens = [getImageToken(first, classOverride)]
        if (text) {
          splitTokens.push(getTextToken(text))
        }
        if (second) {
          splitTokens.push(getImageToken(second, classOverride))
        }
        state.tokens[i].children = token.children.toSpliced(j, 1, ...splitTokens)
      }
    }
  })
}
