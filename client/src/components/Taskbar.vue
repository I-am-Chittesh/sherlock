<script setup>
import { computed } from 'vue';
import { store } from '../store';

const emit = defineEmits(['paginate-left', 'paginate-right', 'open-modal']);

const showNavigation = computed(() => store.currentScreen !== 'console');

const handleLeft = () => emit('paginate-left');
const handleRight = () => emit('paginate-right');
const handlePlus = () => emit('open-modal');

const goHome = () => store.setScreen('hub');
const goWarRoom = () => {
  if (store.activeCaseId) store.setScreen('pinboard');
  else alert('Access Denied: Select a case from the hub first.');
};
const goAdmin = () => store.setScreen('admin');
const goConsole = () => store.setScreen('console');
</script>

<template>
  <div v-if="showNavigation" class="fixed bottom-8 left-0 w-full flex justify-center items-center gap-6 z-40 pointer-events-none">
    
    <!-- Left Pagination -->
    <button @click="handleLeft" class="pointer-events-auto text-neutral-600 hover:text-white transition-colors">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 18l-6-6 6-6"/></svg>
    </button>

    <!-- Main Pill Dock -->
    <div class="pointer-events-auto relative flex items-center bg-[#0f0f0f] border border-neutral-800 rounded-full px-8 h-16 gap-8 shadow-2xl">
      
      <!-- Left Side Buttons -->
      <button @click="goHome" class="flex flex-col items-center gap-1 group w-12 text-neutral-500 hover:text-white transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span class="text-[9px] uppercase tracking-widest">Home</span>
      </button>

      <button @click="goWarRoom" class="flex flex-col items-center gap-1 group w-12 text-neutral-500 hover:text-white transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        <span class="text-[9px] uppercase tracking-widest">War Room</span>
      </button>

      <!-- Center Floating Add Button (Inspired by image_11ea41.png) -->
      <div class="relative w-12 h-full flex justify-center">
        <button 
          @click="handlePlus" 
          class="absolute -top-6 w-14 h-14 bg-[#F40009] rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors border-4 border-[#0a0a0a]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>

      <!-- Right Side Buttons -->
      <button @click="goAdmin" class="flex flex-col items-center gap-1 group w-12 text-neutral-500 hover:text-white transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <span class="text-[9px] uppercase tracking-widest">Admin</span>
      </button>

      <button @click="goConsole" class="flex flex-col items-center gap-1 group w-12 text-neutral-500 hover:text-[#F40009] transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        <span class="text-[9px] uppercase tracking-widest">Exit</span>
      </button>

    </div>

    <!-- Right Pagination -->
    <button @click="handleRight" class="pointer-events-auto text-neutral-600 hover:text-white transition-colors">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 18l6-6-6-6"/></svg>
    </button>
    
  </div>
</template>