import type { Page } from '@chat-tutor/shared'
import type { Tool } from 'xsai'
import type { AgentChunker } from '../types'

export const getAgentTools = async (
  { pages, chunker }: {
    pages: Page[]
    chunker: AgentChunker
  }
) => {
  return await Promise.all([]) as Tool[]
}