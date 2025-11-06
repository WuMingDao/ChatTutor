import { createAgent } from '@chat-tutor/agent'
import { db } from '#shared/db'
import { chat } from '#shared/db/chat'
import { eq } from 'drizzle-orm'
import type { Message } from 'xsai'
import type { Page } from '@chat-tutor/shared'
import type { Message as DisplayMessage } from '#shared/types'

export default defineEventHandler(async (event) => {
  const apiKey = process.env.API_KEY!
  const baseURL = process.env.BASE_URL!
  const model = process.env.MODELS!.split(',')[0]!
  const { input } = getQuery(event) as { input: string }
  const { id } = getRouterParams(event)

  const [{ pages, context, status, messages }]
    = await db.select().from(chat).where(eq(chat.id, id)) as { pages: Page[], context: Message[], status: Status, messages: DisplayMessage[] }[]
  const updateStatus = async (status: Status) => await db.update(chat).set({ status }).where(eq(chat.id, id))

  if (status === Status.RUNNING) {
    return createError({
      statusCode: 400,
      statusMessage: 'Chat is running',
    })
  }

  updateStatus(Status.RUNNING)
  messages.push({
    type: 'user',
    content: input,
    id: crypto.randomUUID(),
  })

  const agent = createAgent({
    apiKey,
    baseURL,
    model,
    messages: context,
    pages,
  })
  const stream = createEventStream(event)
  event.waitUntil((async () => {
    messages.push({
      type: 'assistant',
      content: '',
      id: crypto.randomUUID(),
    })
    for await (const chunk of agent(input)) {
      stream.push(JSON.stringify(chunk))
      if (chunk.type === 'text') {
        messages.at(-1)!.content += chunk.options.chunk
      }
    }
  })().then(async () => {
    await db.update(chat).set({
      context: <Message[]>context,
      status: Status.COMPLETED,
    }).where(eq(chat.id, id))
    stream.close()
  }).catch(async (_error) => {
    await updateStatus(Status.FAILED)
  }))
  return stream.send()
})