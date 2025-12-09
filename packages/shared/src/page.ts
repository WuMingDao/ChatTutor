import type { Action, FullAction } from './action'

export enum PageType {
  TEXT = 'text',
  PAGE = 'page',
  MERMAID = 'mermaid',
  GGB = 'ggb',
}

export interface Page<T extends Action = FullAction, A extends string = string> {
  type: A
  title: string
  id?: string
  steps: T[]
  notes: string[]
}
