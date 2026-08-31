<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { store } from '../store';
import { api } from '../services/api';

const cases = ref([]);
const searchQuery = ref('');
const showModal = ref(false);
const newCaseTitle = ref('');
const newCaseDesc = ref('');

const loadCases = async () => {
  try {
    const data = await api.getCases('');
    cases.value = data || [];
  } catch (err) {
    console.error('Failed to load cases:', err);
  }
};

const openCase = (id) => {
  store.setActiveCase(id);
};

const submitCase = async () => {
  if (!newCaseTitle.value) return;
  await api.createCase({ title: newCaseTitle.value, description: newCaseDesc.value }, store.currentRole);
  newCaseTitle.value = '';
  newCaseDesc.value = '';
  showModal.value = false;
  loadCases();
};

const handlePlusEvent = () => { showModal.value = true; };

onMounted(() => {
  loadCases();
  window.addEventListener('taskbar-plus', handlePlusEvent);
});

onUnmounted(() => {
  window.removeEventListener('taskbar-plus', handlePlusEvent);
});
</script>

<template>
  <div class="w-full h-full flex flex-col bg-[#0a0a0a] text-white p-10 overflow-y-auto pb-40">
    
    <!-- Top Navigation Row (Matches Sketch) -->
    <div class="flex items-end gap-6 mb-4">
      <h1 class="text-4xl font-extrabold tracking-tighter lowercase" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;">
        home.
      </h1>
      
      <div class="flex-1 flex gap-2">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="search..." 
          class="w-full bg-[#0f0f0f] border border-neutral-800 px-4 py-2 text-sm lowercase outline-none focus:border-neutral-500 transition-colors placeholder:text-neutral-600"
        />
        <button class="px-6 py-2 bg-[#0f0f0f] border border-neutral-800 text-sm lowercase hover:bg-[#171717] transition-colors">
          filter
        </button>
      </div>
    </div>

    <!-- Case Details Subheader (Matches Sketch) -->
    <div class="w-full border border-neutral-800 bg-[#0f0f0f] px-4 py-2 mb-10 flex justify-between items-center text-xs font-mono text-neutral-500 uppercase tracking-widest">
      <span>Details about current cases</span>
      <span>{{ cases.length }} Active</span>
    </div>

    <!-- Tall Case Cards Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div 
        v-for="c in cases" 
        :key="c.id"
        @click="openCase(c.id)"
        class="border border-neutral-800 bg-[#0f0f0f] p-6 cursor-pointer hover:bg-[#171717] transition-colors flex flex-col justify-between h-72 group"
      >
        <div>
          <span class="text-[10px] uppercase tracking-widest text-neutral-600 font-mono block mb-4 group-hover:text-[#F40009] transition-colors">
            {{ c.status }}
          </span>
          <h3 class="text-xl font-bold lowercase tracking-tight leading-snug" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;">
            {{ c.title }}
          </h3>
        </div>
        <div class="text-[10px] text-neutral-600 font-mono truncate">id: {{ c.id }}</div>
      </div>
    </div>

    <!-- Create Case Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-[#0a0a0a]/90 flex items-center justify-center z-50">
      <div class="bg-[#0f0f0f] border border-neutral-800 p-8 w-[450px]">
        <h3 class="text-2xl font-bold lowercase mb-6 tracking-tight" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;">new case.</h3>
        <input v-model="newCaseTitle" type="text" placeholder="title" class="w-full bg-[#0a0a0a] border border-neutral-800 p-3 mb-4 text-sm outline-none lowercase focus:border-neutral-500" />
        <textarea v-model="newCaseDesc" placeholder="description" class="w-full bg-[#0a0a0a] border border-neutral-800 p-3 mb-6 text-sm outline-none lowercase focus:border-neutral-500 h-24"></textarea>
        <div class="flex justify-end gap-4">
          <button @click="showModal = false" class="text-xs uppercase tracking-widest text-neutral-500 hover:text-white">Cancel</button>
          <button @click="submitCase" class="px-6 py-2 bg-[#F40009] text-white text-xs uppercase tracking-widest font-bold hover:bg-red-700 transition-colors">Deploy</button>
        </div>
      </div>
    </div>

  </div>
</template>