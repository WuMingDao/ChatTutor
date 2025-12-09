import type { CanvasPage } from '@chat-tutor/canvas'
import type { BaseForm, FormType, FullAction } from '@chat-tutor/shared'
import type { FormCreationAction, PageCreationAction, PageNoteAction, MermaidPage, MermaidPageAction } from '@chat-tutor/agent'

import '@dsl/math'

export type Page = CanvasPage | MermaidPage

export type ActionHandler = (action: FullAction) => void


export const useBoard = () => {
  const board = ref<HTMLElement | null>(null)
  const currentPages = ref<Page[]>([])
  const page = ref<string | null>(null)
  const forms = ref<BaseForm<FormType>[]>([])

  const loadPage = (p: Page) => {
    currentPages.value.push(p)
    page.value = p.id!
  }
  
  const loadPages = (pages: Page[]) => pages.forEach(loadPage)

  const handleAction: ActionHandler = (action) => {
    if (action.type === 'page') {
      handlePageCreationAction(action as unknown as PageCreationAction)
    } else {
      if (action.type === 'text') return
      const p = currentPages.value.find(p => p.id === action.page)
      if (!p) return
      p.steps.push(action as never)
    }
  }

  const handlePageCreationAction = (action: PageCreationAction) => {
    loadPage(action.options as CanvasPage)
  }

  return {
    board,
    page,
    forms,
    currentPages,
    handleAction,
    loadPage,
    loadPages,
  }
}
