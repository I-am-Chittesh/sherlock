<script setup>
import { computed } from 'vue';
import { store } from '../store';

const emit = defineEmits(['paginate-left', 'paginate-right', 'open-modal']);

// Determine if pagination arrows and center "+" button should be active based on screen
const showNavigation = computed(() => ['hub', 'pinboard'].includes(store.currentScreen));
const showPlus = computed(() => ['hub', 'pinboard'].includes(store.currentScreen) && store.currentRole === 'INVESTIGATOR');

const handleLeft = () => emit('paginate-left');
const handleRight = () => emit('paginate-right');
const handlePlus = () => emit('open-modal');
const goHome = () => store.setScreen('hub');
const goAdmin = () => {
  store.setRole('ADMIN');
  store.setScreen('admin');
};
</script>

<template>
  <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-[#141414]/90 border border-neutral-800 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl">
    
    <!-- Home / Hub Switcher -->
    <button @click="goHome" class="text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition">
      Hub
    </button>

    <div class="h-4 w-[1px] bg-neutral-800"></div>

    <!-- Left Edge Pagination Arrow -->
    <button 
      v-if="showNavigation" 
      @click="handleLeft" 
      class="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800 transition"
      title="Previous Item"
    >
      &larr;
    </button>

    <!-- Center "+" Action Button -->
    <button 
      v-if="showPlus" 
      @click="handlePlus" 
      class="w-10 h-10 flex items-center justify-center rounded-full bg-[#F40009] text-white font-bold text-lg shadow-lg hover:bg-red-700 transition scale-105"
      title="Create New Entry"
    >
      +
    </button>

    <!-- Right Edge Pagination Arrow -->
    <button 
      v-if="showNavigation" 
      @click="handleRight" 
      class="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800 transition"
      title="Next Item"
    >
      &rarr;
    </button>

    <div class="h-4 w-[1px] bg-neutral-800"></div>

    <!-- Admin Overseer Link -->
    <button @click="goAdmin" class="text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition">
      Admin
    </button>

  </div>
</template>