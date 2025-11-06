<script setup lang="ts">
const input = ref('')

const create = async () => {
  const { id } = await $fetch<{ id: string }>('/api/chat/create', {
    method: 'POST',
  })
  navigateTo(`/chat/${id}?input=${input.value}`)
}
</script>

<template>
  <div class="size-full h-screen flex flex-col gap-10 items-center justify-center">
    <h1 class="text-4xl font-mono text-gray-600">
      Welcome to ChatTutor!
    </h1>
    <div class="w-full max-w-200 h-35">
      <PromptArea
        v-model:input="input"
        @keydown.enter="create"
        @send="create"
      />
    </div>
  </div>
</template>