<script setup lang="ts">
import mermaid from 'mermaid'
import type { MermaidPage } from '@chat-tutor/agent'

onMounted(() => {
  mermaid.initialize({
    startOnLoad: true,
    theme: 'base',
  })
})

const props = defineProps<{
  page: MermaidPage
}>()

const content = ref('')
let renderId = 0
watch(() => props.page.steps, (steps) => {
  console.log('steps', steps)
  for (const step of steps) {
    if (step.type === 'set-mermaid') {
      const source = step.options.content.trim()
      const id = `mermaid-${props.page.id}-${renderId++}`
      mermaid.render(id, source).then((result) => {
        content.value = result.svg
      })
    }
  }
}, { immediate: true, deep: true })
</script>

<template>
  <div class="size-full flex items-center justify-center">
    <div v-html="content" class="size-full" />
  </div>
</template>