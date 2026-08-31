<script setup>
import { ref, onMounted, watch } from 'vue';
import { store } from '../store';
import { api } from '../services/api';
import { VueFlow } from '@vue-flow/core';

const caseData = ref(null);
const nodes = ref([]);
const edges = ref([]);

const loadWarRoom = async () => {
  if (!store.activeCaseId) return;
  try {
    const data = await api.getWarRoom(store.activeCaseId);
    caseData.value = data;

    // 1. Map Evidence to Canvas Nodes
    nodes.value = (data.evidence || []).map((ev, index) => {
      // Dynamic node coloring
      let bg = '#171717'; // PENDING
      let border = '#404040';
      
      if (ev.status === 'VERIFIED') {
        bg = '#064e3b';
        border = '#10b981';
      } else if (ev.status === 'DEBUNKED') {
        bg = '#450a0a';
        border = '#F40009'; // Diet Coke red aesthetic 
      }

      return {
        id: ev.id,
        label: `${ev.name}\n[${ev.status}]`,
        position: { x: 150 + (index % 3) * 250, y: 100 + Math.floor(index / 3) * 150 },
        style: {
          background: bg,
          color: '#ffffff',
          border: `2px solid ${border}`,
          borderRadius: '8px',
          padding: '12px',
          width: '180px',
          textAlign: 'center',
          fontSize: '12px',
          fontWeight: 'bold',
          boxShadow: `0 0 15px ${border}40`
        }
      };
    });

    // 2. Map Parent-Child Relationships to Canvas Edges
    edges.value = (data.evidence || [])
      .filter(ev => ev.parent_id)
      .map(ev => ({
        id: `edge-${ev.parent_id}-${ev.id}`,
        source: ev.parent_id,
        target: ev.id,
        animated: true,
        style: { stroke: '#a3a3a3', strokeWidth: 2 }
      }));

  } catch (err) {
    console.error('Failed to load war room:', err);
  }
};

onMounted(() => {
  loadWarRoom();
});
</script>

<template>
  <div class="w-full h-full grid grid-cols-12 overflow-hidden">
    
    <!-- Left Hemisphere: Interactive Evidence Canvas -->
    <div class="col-span-8 h-full border-r border-neutral-800 bg-[#0a0a0a] relative">
      <VueFlow 
        :nodes="nodes" 
        :edges="edges" 
        :default-zoom="1" 
        :min-zoom="0.2" 
        :max-zoom="4"
        fit-view-on-init
        class="w-full h-full"
      />
    </div>

    <!-- Right Hemisphere: Hypothesis Math Engine -->
    <div class="col-span-4 h-full flex flex-col bg-[#141414] p-8 overflow-y-auto pb-32">
      <h2 class="text-2xl font-bold mb-2">{{ caseData?.title || 'Loading Case Data...' }}</h2>
      <p class="text-sm text-neutral-400 mb-8">{{ caseData?.description }}</p>
      
      <!-- Live Probability Bars -->
      <h3 class="text-xs font-mono uppercase tracking-wider text-neutral-500 mb-4">Probability Engine</h3>
      
      <div class="space-y-6">
        <div v-for="hyp in caseData?.hypotheses" :key="hyp.id" class="bg-neutral-900 border border-neutral-800 p-5 rounded-xl">
          <div class="flex justify-between items-end mb-3">
            <span class="text-sm font-bold w-3/4">{{ hyp.theory_name }}</span>
            <span class="font-mono text-lg font-bold" :class="{'text-green-500': hyp.score > 50, 'text-[#F40009]': hyp.score === 0}">
              {{ hyp.score }}%
            </span>
          </div>
          
          <!-- Progress Track -->
          <div class="w-full bg-neutral-950 h-3 rounded-full overflow-hidden border border-neutral-800 shadow-inner">
            <div 
              class="h-full transition-all duration-700 ease-out" 
              :class="hyp.score > 50 ? 'bg-green-600' : 'bg-[#F40009]'"
              :style="{ width: `${hyp.score}%` }"
            ></div>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>