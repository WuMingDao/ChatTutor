import {
  faStickyNote,
  faDiagramProject,
  faCalculator,
  faFile,
  faPaintbrush,
  faListCheck,
} from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import type { Message } from '#shared/types'

export const messageIcons: Record<Message['type'], IconDefinition | null> = {
  'user': null,
  'assistant': null,
  'note': faStickyNote,
  'set-mermaid': faDiagramProject,
  'ggb': faCalculator,
  'page': faFile,
  'draw': faPaintbrush,
  'plan': faListCheck,
}

