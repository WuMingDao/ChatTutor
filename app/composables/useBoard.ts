import type { FullAction } from '@chat-tutor/shared'
import type { PageCreationAction, MermaidPage, GGBPage } from '@chat-tutor/agent'

export type Page = MermaidPage | GGBPage

export type ActionHandler = (action: FullAction) => void


export const useBoard = () => {
  const board = ref<HTMLElement | null>(null)
  const currentPages = ref<Page[]>([])
  const page = ref<string | null>(null)

  const loadPage = (p: Page) => {
    console.log('loadPage', p)
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
    loadPage(action.options as Page)
  }

  return {
    board,
    page,
    currentPages,
    handleAction,
    loadPage,
    loadPages,
  }
}
