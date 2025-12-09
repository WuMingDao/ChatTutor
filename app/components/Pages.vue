<script setup lang="ts">
import { MarkdownRender } from 'markstream-vue'
import { PageType } from '@chat-tutor/shared'

const props = defineProps<{
  pages: Page[]
  currentPage: string
}>()

const notes = ref<string[]>([])

const _currentPage = computed(() => props.pages.find(page => page.id === props.currentPage)!)
console.log(props)

watch(_currentPage, (page) => {
  if (!page || !page.steps) return
  notes.value.length = 0
  for (const step of page.steps) {
    if (step.type === 'note') {
      notes.value.push(step.options.content)
    }
  }
}, { immediate: true, deep: true })

const areaClasses = 'size-full shadow-sm dark:text-gray-200 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg'
</script>

<template>
  <div class="size-full flex flex-row gap-2">
    <div
      v-for="page in pages"
      v-show="page.id === currentPage"
      :key="page.id"
      :class="areaClasses + ' ' + (notes.length > 0 ? 'w-5/7' : 'w-full')"
      class="h-full"
    >
      <div
        v-if="page.type === PageType.MERMAID"
        class="size-full"
      >
        <MermaidPage :page="page" />
      </div>
    </div>
    <div
      v-if="notes.length > 0"
      :class="areaClasses"
      class="w-2/7 h-full markdown p-3 text-sm overflow-y-auto"
    >
      <MarkdownRender :content="notes.join('\n\n')" />
    </div>
  </div>
</template>
