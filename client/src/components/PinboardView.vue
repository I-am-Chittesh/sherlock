<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { store } from '../store';
import { api } from '../services/api';
import { VueFlow } from '@vue-flow/core';

const caseData = ref(null);
const nodes = ref([]);
const edges = ref([]);

// Modal State
const showEvModal = ref(false);
const evName = ref('');
const evWeight = ref(5);
const evParent = ref('');

// Theory Injection State
const newTheoryName = ref('');

const loadWarRoom = async () => {
  if (!store.activeCaseId) return;
  try {
    const data = await api.getWarRoom(store.activeCaseId);
    caseData.value = data;

    nodes.value = (data.evidence || []).map((ev, index) => {
      let bg = '#171717';
      let border = '#404040';
      if (ev.status === 'VERIFIED') {
        bg = '#064e3b'; border = '#10b981';
      } else if (ev.status === 'DEBUNKED') {
        bg = '#450a0a'; border = '#F40009'; 
      }

      return {
        id: ev.id,
        data: { ...ev }, 
        label: `${ev.name}\n[${ev.status}]`,
        position: { x: 150 + (index % 3) * 250, y: 100 + Math.floor(index / 3) * 150 },
        style: {
          background: bg, color: '#ffffff', border: `2px solid ${border}`,
          borderRadius: '0px', padding: '12px', width: '180px',
          textAlign: 'center', fontSize: '10px', fontWeight: 'bold',
          textTransform: 'lowercase', fontFamily: 'monospace'
        }
      };
    });

    edges.value = (data.evidence || [])
      .filter(ev => ev.parent_id)
      .map(ev => ({
        id: `edge-${ev.parent_id}-${ev.id}`,
        source: ev.parent_id, target: ev.id,
        animated: true, style: { stroke: '#404040', strokeWidth: 2 }
      }));

  } catch (err) {
    console.error('Failed to load war room:', err);
  }
};

const handleNodeClick = async (event) => {
  if (store.currentRole !== 'INVESTIGATOR') return; 
  
  const node = event.node.data;
  let nextStatus = 'PENDING';
  if (node.status === 'PENDING') nextStatus = 'VERIFIED';
  else if (node.status === 'VERIFIED') nextStatus = 'DEBUNKED';

  await api.updateEvidenceStatus(node.id, nextStatus, store.currentRole);
  loadWarRoom(); 
};

const submitEvidence = async () => {
  if (!evName.value) return;
  await api.createEvidence({
    case_id: store.activeCaseId,
    name: evName.value,
    weight: evWeight.value,
    parent_id: evParent.value || null
  }, store.currentRole);
  
  evName.value = '';
  evWeight.value = 5;
  evParent.value = '';
  showEvModal.value = false;
  loadWarRoom();
};

const submitTheory = async () => {
  if (!newTheoryName.value) return;
  await api.createHypothesis({
    case_id: store.activeCaseId,
    theory_name: newTheoryName.value,
    score: 0
  }, store.currentRole);
  
  newTheoryName.value = '';
  loadWarRoom(); 
};

const handlePlusEvent = () => { 
  if (store.currentScreen === 'pinboard') showEvModal.value = true; 
};

onMounted(() => {
  loadWarRoom();
  window.addEventListener('taskbar-plus', handlePlusEvent);
});

onUnmounted(() => {
  window.removeEventListener('taskbar-plus', handlePlusEvent);
});
</script>

<template>
  <div class="w-full h-full grid grid-cols-12 overflow-hidden bg-[#0a0a0a]">
    
    <!-- Left Hemisphere: Interactive Evidence Canvas -->
    <div class="col-span-8 h-full border-r border-neutral-800 relative">
      <VueFlow 
        :nodes="nodes" 
        :edges="edges" 
        :default-zoom="1" 
        :min-zoom="0.2" 
        :max-zoom="4"
        fit-view-on-init
        @node-click="handleNodeClick"
        class="w-full h-full"
      />
    </div>

    <!-- Right Hemisphere: Partitioned Flex Layout -->
    <div class="col-span-4 h-full flex flex-col bg-[#0f0f0f] text-neutral-300">
      
      <!-- Top Partition: Scrollable Details & Engine -->
      <div class="flex-1 overflow-y-auto p-10 pb-10">
        <h2 class="text-3xl font-extrabold tracking-tighter lowercase text-white mb-2" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;">
          {{ caseData?.title || 'loading...' }}
        </h2>
        <p class="text-xs text-neutral-500 lowercase font-mono mb-10">{{ caseData?.description }}</p>
        
        <h3 class="text-[10px] font-mono uppercase tracking-widest text-neutral-600 mb-6 border-b border-neutral-800 pb-2">Probability Engine</h3>
        
        <div class="space-y-6">
          <div v-for="hyp in caseData?.hypotheses" :key="hyp.id" class="bg-[#141414] border border-neutral-800 p-6">
            <div class="flex justify-between items-end mb-4">
              <span class="text-sm font-bold lowercase w-3/4 tracking-tight">{{ hyp.theory_name }}</span>
              <span class="font-mono text-xl font-bold" :class="{'text-emerald-500': hyp.score > 50, 'text-[#F40009]': hyp.score === 0, 'text-white': hyp.score > 0 && hyp.score <= 50}">
                {{ hyp.score }}%
              </span>
            </div>
            
            <div class="w-full bg-[#0a0a0a] h-1 overflow-hidden border border-neutral-800">
              <div 
                class="h-full transition-all duration-700 ease-out" 
                :class="hyp.score > 50 ? 'bg-emerald-600' : (hyp.score === 0 ? 'bg-[#F40009]' : 'bg-neutral-500')"
                :style="{ width: `${hyp.score}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Partition: Fixed Theory Injector -->
      <div class="flex-none p-8 border-t border-neutral-800 bg-[#0a0a0a] pb-32">
        <span class="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-4 block">Inject New Theory</span>
        <div class="flex gap-0 border border-neutral-800">
          <input 
            v-model="newTheoryName" 
            type="text" 
            placeholder="e.g. insider syndicate..." 
            class="flex-1 bg-[#0f0f0f] px-4 py-3 text-xs outline-none lowercase focus:bg-[#141414] text-white placeholder:text-neutral-700 transition-colors"
            @keyup.enter="submitTheory"
          />
          <button 
            @click="submitTheory" 
            class="px-6 py-3 bg-white text-black text-[10px] uppercase tracking-widest font-bold hover:bg-neutral-300 transition-colors border-l border-neutral-800"
          >
            Add
          </button>
        </div>
      </div>

    </div>

    <!-- Create Evidence Modal -->
    <div v-if="showEvModal" class="fixed inset-0 bg-[#0a0a0a]/90 flex items-center justify-center z-50">
      <div class="bg-[#0f0f0f] border border-neutral-800 p-8 w-[450px]">
        <h3 class="text-2xl font-bold lowercase mb-6 tracking-tight text-white" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;">inject node.</h3>
        
        <input v-model="evName" type="text" placeholder="evidence name" class="w-full bg-[#0a0a0a] border border-neutral-800 p-3 mb-4 text-sm outline-none lowercase focus:border-neutral-500 text-white" />
        
        <div class="flex justify-between items-center mb-4 border border-neutral-800 bg-[#0a0a0a] p-3">
          <span class="text-xs font-mono text-neutral-500 uppercase tracking-widest">Weight (1-10)</span>
          <input v-model="evWeight" type="number" min="1" max="10" class="bg-transparent text-right outline-none text-white font-mono w-12" />
        </div>

        <select v-model="evParent" class="w-full bg-[#0a0a0a] border border-neutral-800 p-3 mb-6 text-sm outline-none lowercase text-neutral-400 focus:border-neutral-500">
          <option value="">No Parent (Root Node)</option>
          <option v-for="node in caseData?.evidence" :key="node.id" :value="node.id">
            Link to: {{ node.name }}
          </option>
        </select>

        <div class="flex justify-end gap-4">
          <button @click="showEvModal = false" class="text-xs uppercase tracking-widest text-neutral-500 hover:text-white transition-colors">Cancel</button>
          <button @click="submitEvidence" class="px-6 py-2 bg-white text-black text-xs uppercase tracking-widest font-bold hover:bg-neutral-300 transition-colors">Inject</button>
        </div>
      </div>
    </div>

  </div>
</template>