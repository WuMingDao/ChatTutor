import type { BlockResolver } from './blockParser'
import type { Action, FullizeAction, Page, PageType } from '@chat-tutor/shared'
import type { PageNoteAction } from '../'

export type MermaidPageSetAction = Action<{ content: string }, 'set-mermaid'>
export type MermaidPageAction = MermaidPageSetAction
export type MermaidPage = Page<MermaidPageAction | PageNoteAction, PageType.MERMAID>

export const mermaidBlockResolver: BlockResolver = ({ page, content }, emit) => {
  const action: FullizeAction<MermaidPageAction> = {
    type: 'set-mermaid',
    options: { content: content },
    page: page.id,
  }
  page.steps.push(action)
  emit(action)
  return action
}