<script setup lang="ts">
import type { Message, GGBMessage } from '#shared/types'
import { messageIcons } from '../utils/message-icons'

const { message } = defineProps<{
  message: Message
}>()

const page = inject<Ref<string | null>>('page')!

const content = computed(() => {
  if (['assistant', 'user'].includes(message.type)) {
    return (message as AssistantMessage).content
  } else if (message.type === 'draw') {
    return `Painted on ${message.page}`
  } else if (message.type === 'set-mermaid') {
    return message.running ? `Setting mermaid on ${message.page}...` : `Mermaid set on ${message.page}`
  } else if (message.type === 'note') {
    return message.running ? `Adding note to ${message.page}...` : `Note added to ${message.page}`
  } else if (message.type === 'ggb') {
    return message.running ? `Running GeoGebra script on ${message.page}...` : `GeoGebra script executed on ${message.page}`
  } else if (message.type === 'page') {
    return `Created ${message.pageType.toUpperCase()} page: ${message.page}`
  } else if (message.type === 'plan') {
    return message.running ? 'Planning...' : 'Planning completed'
  }
  return ''
})

const isMarkdown = computed(() => {
  return ['assistant', 'user'].includes(message.type)
})

const running = computed(() => {
  if (['user', 'assistant'].includes(message.type)) return false
  return message.running ?? false
})

const icon = computed(() => {
  return messageIcons[message.type]
})

const handleClick = () => {
  if (['page', 'draw', 'set-mermaid', 'note', 'ggb'].includes(message.type)) {
    page.value = (message as PageMessage | NoteMessage | SetMermaidMessage | DrawMessage | GGBMessage).page
  }
}
</script>

<template>
  <MessageBox :content="content" :icon="icon" :running="running" :images="message.type === 'user' ? message.images : []"
    :clickable="['page', 'draw', 'set-mermaid', 'note', 'ggb'].includes(message.type)" :is-markdown="isMarkdown"
    :show-border="message.type === 'user'" @click="handleClick" />
</template>
