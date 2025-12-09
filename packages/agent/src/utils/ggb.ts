import type { Action, FullizeAction } from '@chat-tutor/shared'
import type { BlockResolver } from './blockParser'

export type RunGGBScriptAction = Action<{ content: string }, 'run-ggbscript'>

export const ggbBlockResolver: BlockResolver = ({ page, content }, emit) => {
  const action: FullizeAction<RunGGBScriptAction> = {
    type: 'run-ggbscript',
    options: { content },
    page: page.id,
  }
  page.steps.push(action)
  emit(action)
  return action
}