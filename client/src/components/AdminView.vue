<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { api } from '../services/api';

const stats = ref({ totalCases: 0, totalEvidence: 0, totalUsers: 0 });
const auditLogs = ref([]);
let pollingInterval = null;

const loadDashboard = async () => {
  try {
    const data = await api.getAdminDashboard();
    stats.value = data.stats || stats.value;
    auditLogs.value = data.auditLogs || [];
  } catch (err) {
    console.error('Terminal Error:', err);
  }
};

onMounted(() => {
  loadDashboard();
  // Poll the database every 5 seconds for a live-updating overseer feel
  pollingInterval = setInterval(loadDashboard, 5000);
});

onUnmounted(() => {
  clearInterval(pollingInterval);
});
</script>

<template>
  <div class="w-full h-full flex flex-col bg-[#0a0a0a] text-neutral-300 p-10 overflow-y-auto pb-40 selection:bg-[#F40009] selection:text-white">
    
    <!-- Top Navigation Row -->
    <div class="flex justify-between items-start w-full border-b border-neutral-800 pb-8 mb-10">
      <h1 class="text-4xl font-extrabold tracking-tighter lowercase text-white" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;">
        control room.
      </h1>
      
      <div class="text-right flex flex-col items-end">
        <span class="text-2xl font-extrabold tracking-tighter leading-none text-white lowercase" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;">
          admin<br>overseer
        </span>
        <span class="text-[10px] font-mono text-[#F40009] mt-2">*restricted access*</span>
      </div>
    </div>

    <!-- KPI Telemetry Blocks -->
    <div class="grid grid-cols-3 gap-6 mb-10">
      <div class="border border-neutral-800 bg-[#0f0f0f] p-8 flex flex-col">
        <span class="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-6 block">Active Cases</span>
        <div class="text-6xl font-extrabold tracking-tighter text-white" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;">{{ stats.totalCases }}</div>
      </div>
      
      <div class="border border-neutral-800 bg-[#0f0f0f] p-8 flex flex-col">
        <span class="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-6 block">Evidence Nodes</span>
        <div class="text-6xl font-extrabold tracking-tighter text-white" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;">{{ stats.totalEvidence }}</div>
      </div>
      
      <div class="border border-neutral-800 bg-[#0f0f0f] p-8 flex flex-col">
        <span class="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-6 block">System Users</span>
        <div class="text-6xl font-extrabold tracking-tighter text-white" style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;">{{ stats.totalUsers }}</div>
      </div>
    </div>

    <!-- Immutable Audit Log -->
    <div class="flex-grow border border-neutral-800 bg-[#0f0f0f] flex flex-col overflow-hidden">
      <!-- Matrix Header -->
      <div class="border-b border-neutral-800 px-6 py-4 flex items-center justify-between bg-[#0a0a0a]">
        <span class="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Live Telemetry & Audit Matrix</span>
        <span class="text-[10px] font-mono text-[#F40009] flex items-center gap-2">
          <span class="w-2 h-2 bg-[#F40009] rounded-full animate-pulse"></span> REC
        </span>
      </div>
      
      <!-- Scrolling Log Feed -->
      <div class="p-6 overflow-y-auto space-y-2 flex-grow">
        <div v-if="auditLogs.length === 0" class="text-neutral-600 font-mono text-xs lowercase">
          waiting for mutations...
        </div>
        
        <div 
          v-for="log in auditLogs" 
          :key="log.id" 
          class="font-mono text-xs flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-[#141414] p-3 transition-colors border-l-2 border-transparent hover:border-neutral-500"
        >
          <span class="text-neutral-600 min-w-[150px]">{{ new Date(log.timestamp).toLocaleString() }}</span>
          <span class="text-white font-bold min-w-[100px] uppercase tracking-widest text-[10px]">{{ log.role }}</span>
          <span class="text-neutral-400 flex-grow lowercase">{{ log.action }}</span>
          <span v-if="log.target_id" class="text-neutral-600 text-[10px] truncate max-w-[120px]">id: {{ log.target_id }}</span>
        </div>
      </div>
    </div>

  </div>
</template>