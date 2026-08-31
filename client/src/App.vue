<script setup>
import { store } from './store.js';
import ConsoleView from './components/ConsoleView.vue';
import HubView from './components/HubView.vue';
import PinboardView from './components/PinboardView.vue';
import AdminView from './components/AdminView.vue';
import Taskbar from './components/Taskbar.vue';

const handlePaginateLeft = () => window.dispatchEvent(new CustomEvent('taskbar-left'));
const handlePaginateRight = () => window.dispatchEvent(new CustomEvent('taskbar-right'));
const handleOpenModal = () => window.dispatchEvent(new CustomEvent('taskbar-plus'));
</script>

<template>
  <main class="w-screen h-screen overflow-hidden bg-[#0a0a0a] text-white relative font-sans">
    
    <ConsoleView v-if="store.currentScreen === 'console'" />
    <HubView v-if="store.currentScreen === 'hub'" />
    <PinboardView v-if="store.currentScreen === 'pinboard'" />
    <AdminView v-if="store.currentScreen === 'admin'" />

    <Taskbar 
      v-if="store.currentScreen !== 'console'" 
      @paginate-left="handlePaginateLeft"
      @paginate-right="handlePaginateRight"
      @open-modal="handleOpenModal"
    />

  </main>
</template>