<script setup>
import { store } from '../store';

const selectRole = (role) => {
  store.setRole(role);
  store.setScreen('hub');
};
</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center relative bg-[#0a0a0a]">
    
    <!-- Title Header -->
    <div class="absolute top-16 text-center">
      <h1 class="text-4xl font-extrabold tracking-widest uppercase">Sherlocked</h1>
      <p class="text-xs text-neutral-500 mt-1 uppercase tracking-widest">Digital Evidence & Hypothesis Engine</p>
    </div>

    <!-- Split-Screen Hitboxes -->
    <div class="grid grid-cols-2 w-full h-3/5 border-t border-b border-neutral-800">
      
      <!-- Investigator Portal -->
      <div 
        @click="selectRole('INVESTIGATOR')"
        class="flex flex-col items-center justify-center border-r border-neutral-800 cursor-pointer hover:bg-neutral-900/40 transition group p-8 text-center"
      >
        <span class="text-xs uppercase tracking-widest text-neutral-500 mb-2">Access Level 01</span>
        <h2 class="text-3xl font-bold tracking-wide group-hover:text-white transition">Investigator Console</h2>
        <p class="text-sm text-neutral-400 mt-3 max-w-sm">Create cases, map evidence nodes on the war room canvas, and track dynamic hypothesis probability scores.</p>
      </div>

      <!-- Admin Overseer Portal -->
      <div 
        @click="selectRole('ADMIN')"
        class="flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-900/40 transition group p-8 text-center"
      >
        <span class="text-xs uppercase tracking-widest text-neutral-500 mb-2">Access Level 02</span>
        <h2 class="text-3xl font-bold tracking-wide group-hover:text-white transition">Admin Overseer</h2>
        <p class="text-sm text-neutral-400 mt-3 max-w-sm">Monitor system usage metrics, inspect KPI blocks, and audit immutable transaction logs.</p>
      </div>

    </div>

  </div>
</template>