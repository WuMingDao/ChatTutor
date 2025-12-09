import type { PageCreationAction, PageNoteAction, TextChunkAction, MermaidPageAction } from '@chat-tutor/agent'
import type { FullizeAction } from '@chat-tutor/shared'

export type AllAction = 
  | PageCreationAction
  | TextChunkAction
  | FullizeAction<MermaidPageAction>
  | PageNoteAction