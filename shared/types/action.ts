import type {
  PageCreationAction,
  PageNoteAction,
  TextChunkAction, 
  MermaidPageAction,
  NoteStartAction,
  NoteEndAction,
  MermaidStartAction,
  MermaidEndAction,
  GGBStartAction,
  GGBEndAction,
  PlanStartAction,
  PlanEndAction,
} from '@chat-tutor/agent'
import type { FullizeAction } from '@chat-tutor/shared'

export type AllAction = 
  | PageCreationAction
  | TextChunkAction
  | FullizeAction<MermaidPageAction>
  | PageNoteAction
  | NoteStartAction
  | NoteEndAction
  | MermaidStartAction
  | MermaidEndAction
  | GGBStartAction
  | GGBEndAction
  | PlanStartAction
  | PlanEndAction