<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBars, faAdd } from '@fortawesome/free-solid-svg-icons'

const iconButton = ['hover:bg-gray-300', 'rounded-lg', 'p-2', 'hover:transition-all', 'duration-300', 'text-gray-500']

const collapsed = ref(false)

type Chat = {
  title: string
  id: string
  date: Date
}

const chats: Ref<Chat[]> = ref([
  {
    title: 'Chat 1',
    id: '1',
    date: new Date(),
  },
])
</script>

<template>
  <div class="min-h-screen w-full bg-gray-50 flex flex-row">
    <div
      class="h-screen bg-gray-200 max-h-screen flex flex-col p-5"
      :class="{ 'w-80': collapsed }"
    >
      <FontAwesomeIcon
        :icon="faBars"
        :class="iconButton"
        @click="collapsed = !collapsed"
      />
      <div class="flex h-full flex-col py-5 gap-10">
        <div
          class="flex flex-row w-full items-center gap-10 cursor-pointer select-none"
          :class="iconButton"
        >
          <FontAwesomeIcon :icon="faAdd" />
          <span v-show="collapsed">New Chat</span>
        </div>
        <div
          v-show="collapsed"
          class="flex flex-col gap-5 text-gray-600"
        >
          <h2 class="text-sm font-bold select-none">Recent</h2>
          <div
            v-for="chat in chats"
            :key="chat.id"
            class="text-sm w-full cursor-pointer select-none p-2"
            :class="iconButton"
          >
            <div class="flex flex-row items-center gap-5">
              <div class="flex flex-col">
                <h3>{{ chat.title }}</h3>
                <p>{{ chat.date.toLocaleDateString() }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex size-full">
      <slot />
    </div>
  </div>
</template>
