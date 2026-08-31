<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { store } from '../store';
import { api } from '../services/api';

const cases = ref([]);
const activeFilter = ref('');
const showModal = ref(false);
const newCaseTitle = ref('');
const newCaseDesc = ref('');

// Fetch cases from backend API
const loadCases = async () => {
  try {
    const data = await api.getCases(activeFilter.value);
    cases.value = data || [];
  } catch (err) {
    console.error('Failed to load cases:', err);
  }
};

const filterCases = (status) => {
  activeFilter.value = status;
  loadCases();
};

const openCase = (id) => {
  store.setActiveCase(id);
};

// Create Case Action
const submitCase = async () => {
  if (!newCaseTitle.value) return;
  await api.createCase({ title: newCaseTitle.value, description: newCaseDesc.value }, store.currentRole);
  newCaseTitle.value = '';
  newCaseDesc.value = '';
  showModal.value = false;
  loadCases();
};

// Listen to taskbar events
const handlePlusEvent = () => { showModal.value = true; };
const handleLeftEvent = () => { /* Hook for edge case card cycling */ };
const handleRightEvent = () => { /* Hook for edge case card cycling */ };

onMounted(() => {
  loadCases();
  window.addEventListener('taskbar-plus', handlePlusEvent);
  window.addEventListener('taskbar-left', handleLeftEvent);
  window.addEventListener('taskbar-right', handleRightEvent);
});

onUnmounted(() => {
  window.removeEventListener('taskbar-plus', handlePlusEvent);
  window.removeEventListener('taskbar-left', handleLeftEvent);
  window.removeEventListener('taskbar-right', handleRightEvent);
});
</script>

<template>
  <div class="w-full h-full flex flex-col p-10 overflow-y-auto pb-32">
    
    <!-- Top Filter & Search Bar -->
    <div class="flex justify-between items-center mb-8">
      <div class="flex gap-2">
        <button @click="filterCases('')" class="px-4 py-2 text-xs uppercase tracking-wider border border-neutral-800 rounded">All</button>
        <button @click="filterCases('OPEN')" class="px-4 py-2 text-xs uppercase tracking-wider border border-neutral-800 rounded">Open</button>
        <button @click="filterCases('ACTIVE')" class="px-4 py-2 text-xs uppercase tracking-wider border border-neutral-800 rounded">Active</button>
        <button @click="filterCases('REVIEW')" class="px-4 py-2 text-xs uppercase tracking-wider border border-neutral-800 rounded">Review</button>
        <button @click="filterCases('CLOSED')" class="px-4 py-2 text-xs uppercase tracking-wider border border-neutral-800 rounded">Closed</button>
      </div>
      <input type="text" placeholder="Search investigations..." class="bg-neutral-900 border border-neutral-800 px-4 py-2 text-sm rounded outline-none w-72" />
    </div>

    <!-- Case Cards Grid Layout -->
    <div class="grid grid-cols-3 gap-6">
      <div 
        v-for="c in cases" 
        :key="c.id"
        @click="openCase(c.id)"
        class="border border-neutral-800 bg-neutral-900/50 p-6 rounded-lg cursor-pointer hover:border-neutral-600 transition flex flex-col justify-between h-48"
      >
        <div>
          <span class="text-[10px] uppercase tracking-widest text-neutral-500 font-mono">{{ c.status }}</span>
          <h3 class="text-xl font-bold mt-2">{{ c.title }}</h3>
        </div>
        <div class="text-xs text-neutral-500 font-mono">ID: {{ c.id.slice(0,8) }}...</div>
      </div>
    </div>

    <!-- Create Case Modal Overlay -->
    <div v-if="showModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-neutral-900 border border-neutral-800 p-8 rounded-xl w-[450px]">
        <h3 class="text-lg font-bold mb-4">Initialize New Investigation</h3>
        <input v-model="newCaseTitle" type="text" placeholder="Case Title" class="w-full bg-neutral-950 border border-neutral-800 p-3 mb-4 rounded text-sm outline-none" />
        <textarea v-model="newCaseDesc" placeholder="Case Description" class="w-full bg-neutral-950 border border-neutral-800 p-3 mb-4 rounded text-sm outline-none h-24"></textarea>
        <div class="flex justify-end gap-3">
          <button @click="showModal = false" class="px-4 py-2 text-xs text-neutral-400">Cancel</button>
          <button @click="submitCase" class="px-5 py-2 text-xs bg-red-600 text-white font-bold rounded">Create Case</button>
        </div>
      </div>
    </div>

  </div>
</template>