import { message, streamText, type Message, type StreamTextEvent } from 'xsai'
import * as prompts from './prompts'
import { getPageTools, getActionTools } from './tools'
import type { Action, FullAction, Page } from '@chat-tutor/shared'
import type { ReadableStream } from 'node:stream/web'

export type TextChunkAction = Action<{ chunk: string }>

export interface AgentOptions {
  apiKey: string
  baseURL: string
  model: string
  messages: Message[]
  pages: Page[]
}

export const createAgent = (options: AgentOptions) => {
  if (options.messages.length === 0 || options.messages[0].role !== 'system') {
    options.messages.unshift(
      message.system(prompts.system())
    )
  }

  // eslint-disable-next-line require-yield
  return async function* (input: string): AsyncGenerator<FullAction> {
    const tools = (await Promise.all([
      getPageTools(options.pages),
      getActionTools(options.pages)
    ])).flat()
    options.messages.push(message.user(input))
    const { fullStream, messages } = streamText({
      model: options.model,
      apiKey: options.apiKey,
      baseURL: options.baseURL,
      messages: options.messages,
      tools,
      maxSteps: 15,
    })
    messages.then(ms => {
      options.messages.length = 0
      options.messages.push(...ms)
    })
    for await (const chunk of <ReadableStream<StreamTextEvent>>fullStream) {
      if (chunk.type === 'text-delta') {
        yield { type: 'text', options: { chunk: chunk.text } } satisfies TextChunkAction
      }
      if (chunk.type === 'tool-call') {
        if (chunk.toolName === 'act') {
          const { actions } = JSON.parse(chunk.args) as { page: string, actions: FullAction[] }
          for (const action of actions) {
            yield action
          }
        }
      }
    }
  }
}