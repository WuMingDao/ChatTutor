import mermaid from 'mermaid'
import type { MermaidPageAction } from './page'

export const createMermaidRenderer = (
  id: string,
) => {
  mermaid.initialize({
    startOnLoad: true,
    theme: 'dark',
  })

  const content: string[] = []

  const load = (actions: MermaidPageAction[]) => {
    for (const action of actions) {
      if (action.type === 'set-mermaid') {
        content.length = 0
        content.push(action.options.content)
      }
      mermaid.render(id, content.join('\n\n'))
    }
  }

  return {
    load,
  }
}