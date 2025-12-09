import { describe, it, expect } from 'vitest'
import { createAgent } from '..'
import type { Message } from 'xsai'
import type { Page } from '@chat-tutor/shared'

describe('agent', () => {
  it('should create an agent', async () => {
    const messages: Message[] = []
    const pages: Page[] = []
    const agent = createAgent({
      apiKey: process.env.API_KEY!,
      baseURL: process.env.BASE_URL!,
      model: process.env.AGENT_MODEL!,
      messages,
      pages,
    })
    const result = await agent('我想学习二次函数', (chunk) => {
      console.log(chunk)
    })
    expect(result.success).toBe(true)
    const snapshot = {
      messages,
      pages,
    }
    expect(JSON.stringify(snapshot, null, 2)).toMatchFileSnapshot(`__snapshots__/agent.test.json`)
  })
})