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
    console.error('[TERMINAL ERROR] Could not fetch overseer data', err);
  }
};

onMounted(() => {
  loadDashboard();
  // Auto-refresh the logs every 5 seconds for the live terminal feed
  pollingInterval = setInterval(loadDashboard, 5000);
});

onUnmounted(() => {
  clearInterval(pollingInterval);
});
</script>

<template>
  <div class="w-full h-full flex flex-col p-10 bg-[#0a0a0a] overflow-y-auto pb-32">
    
    <!-- Dashboard Header -->
    <div class="mb-8 border-b border-neutral-800 pb-4">
      <h1 class="text-3xl font-extrabold tracking-widest uppercase text-white">System Overseer</h1>
      <p class="text-xs font-mono text-neutral-500 uppercase mt-1">Live Telemetry & Audit Matrix</p>
    </div>

    <!-- KPI Telemetry Blocks -->
    <div class="grid grid-cols-3 gap-6 mb-10">
      <div class="border border-neutral-800 bg-[#141414] p-6 rounded-lg relative overflow-hidden group hover:border-neutral-600 transition">
        <div class="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
        <span class="text-xs font-mono uppercase tracking-widest text-neutral-500">Active Cases</span>
        <div class="text-5xl font-bold mt-2 text-white">{{ stats.totalCases }}</div>
      </div>
      
      <div class="border border-neutral-800 bg-[#141414] p-6 rounded-lg relative overflow-hidden group hover:border-neutral-600 transition">
        <div class="absolute top-0 left-0 w-1 h-full bg-emerald-600"></div>
        <span class="text-xs font-mono uppercase tracking-widest text-neutral-500">Evidence Nodes</span>
        <div class="text-5xl font-bold mt-2 text-white">{{ stats.totalEvidence }}</div>
      </div>
      
      <div class="border border-neutral-800 bg-[#141414] p-6 rounded-lg relative overflow-hidden group hover:border-neutral-600 transition">
        <div class="absolute top-0 left-0 w-1 h-full bg-purple-600"></div>
        <span class="text-xs font-mono uppercase tracking-widest text-neutral-500">System Users</span>
        <div class="text-5xl font-bold mt-2 text-white">{{ stats.totalUsers }}</div>
      </div>
    </div>

    <!-- Immutable Audit Terminal -->
    <div class="flex-grow border border-neutral-800 bg-[#0d0d0d] rounded-lg flex flex-col overflow-hidden shadow-2xl">
      <!-- Mac-style Terminal Header -->
      <div class="bg-neutral-900 border-b border-neutral-800 px-4 py-2 flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-red-500"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div class="w-3 h-3 rounded-full bg-green-500"></div>
        <span class="ml-4 text-xs font-mono text-neutral-500">root@sherlock-audit-server:~# tail -f /var/log/audit.log</span>
      </div>
      
      <!-- Scrolling Log Feed -->
      <div class="p-6 overflow-y-auto space-y-3">
        <div v-if="auditLogs.length === 0" class="text-neutral-600 font-mono text-sm">
          > No system modifications detected...
        </div>
        
        <div 
          v-for="log in auditLogs" 
          :key="log.id" 
          class="font-mono text-sm flex gap-4 hover:bg-neutral-900/50 p-1 rounded transition"
        >
          <span class="text-neutral-500 min-w-[180px]">[{{ new Date(log.timestamp).toLocaleString() }}]</span>
          <span class="text-[#F40009] font-bold min-w-[120px]">{{ log.role }}</span>
          <span class="text-emerald-400">►</span>
          <span class="text-neutral-300">{{ log.action }}</span>
          <span v-if="log.target_id" class="text-neutral-600 ml-auto text-xs truncate max-w-[100px]">ID: {{ log.target_id }}</span>
        </div>
      </div>
    </div>

  </div>
</template>