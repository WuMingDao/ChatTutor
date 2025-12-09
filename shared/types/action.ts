import type { PageCreationAction, PageNoteAction, TextChunkAction,  CanvasPageDrawStartAction, CanvasPageDrawEndAction, MermaidPageAction } from '@chat-tutor/agent'
import type { CanvasPageAction } from '@chat-tutor/canvas'
import type { FullizeAction } from '@chat-tutor/shared'

export type AllAction = 
  | PageCreationAction
  | TextChunkAction
  | CanvasPageAction
  | FullizeAction<CanvasPageDrawStartAction>
  | FullizeAction<CanvasPageDrawEndAction>
  | FullizeAction<MermaidPageAction>
  | PageNoteAction