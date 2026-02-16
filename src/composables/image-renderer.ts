import type MarkdownIt from 'markdown-it'
import { useActionImage } from './image-finder'

// Use https://markdown-it.github.io/#md3=%7B%22source%22%3A%22sometext%22%2C%22defaults%22%3A%7B%22html%22%3Atrue%2C%22xhtmlOut%22%3Afalse%2C%22breaks%22%3Afalse%2C%22langPrefix%22%3A%22language-%22%2C%22linkify%22%3Afalse%2C%22typographer%22%3Afalse%2C%22_highlight%22%3Afalse%2C%22_strict%22%3Afalse%2C%22_view%22%3A%22debug%22%7D%7D to debug markdown tokens

// Reference is https://github.com/markdown-it/markdown-it/blob/master/lib/renderer.mjs#L77

export function imagePlugin(md: MarkdownIt, className: string) {
  const inlineRender = md.renderer.rules.html_inline || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options)
  }

  md.renderer.rules.html_inline = function (tokens, idx, options, env, self) {
    const content = tokens[idx].content

    const actionTag = content.match(/<actions string="(.+)" \/>/s)
    if (!actionTag || !actionTag[1]) {
      return inlineRender(tokens, idx, options, env, self)
    }

    const actionName = actionTag[1]

    tokens[idx].type = 'image'
    tokens[idx].tag = 'img'
    tokens[idx].attrs = [
      ['src', useActionImage(actionName)],
      ['alt', actionName],
      ['class', className],
    ]

    tokens[idx].content = ''

    // pass token to default renderer.
    return self.renderToken(tokens, idx, options)
  }
}
