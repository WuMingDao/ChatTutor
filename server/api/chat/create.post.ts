import { db } from '#shared/db'
import { chat } from '#shared/db/chat'

export default defineEventHandler(async () => {
  const [{ id }] = await db
    .insert(chat)
    .values({
      title: '',
      messages: [],
      context: [],
    })
    .returning({ id: chat.id })
  return {
    id,
  }
})