<script setup>
import { store } from '../store';

const selectRole = (role) => {
  store.setRole(role);
  store.setScreen('hub');
};
</script>

<template>
  <div class="w-full h-full flex flex-col bg-[#0a0a0a] text-neutral-300 p-10 selection:bg-[#F40009] selection:text-white">
    
    <!-- Top Navigation / Header -->
    <header class="flex justify-between items-start w-full border-b border-neutral-800 pb-8 mb-10">
      <div class="flex items-baseline gap-6">
        <span class="text-2xl font-bold tracking-tight text-white lowercase">console.</span>
      </div>
      
      <!-- Right-Aligned Title & Tagline -->
      <div class="text-right flex flex-col items-end">
        <h1 
          class="text-4xl font-extrabold tracking-tighter leading-none text-white lowercase" 
          style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;"
        >
          sher<br>locked
        </h1>
        <span class="text-[12px] font-mono text-neutral-500 mt-2">no sh#t sherlock</span>
      </div>
    </header>

    <!-- Split-Screen Hitboxes -->
    <div class="flex-1 grid grid-cols-2 gap-10 w-full max-w-screen-2xl mx-auto pb-10">
      
      <!-- Investigator Portal -->
      <button 
        @click="selectRole('INVESTIGATOR')"
        class="h-full flex flex-col justify-between text-left border border-neutral-800 bg-[#0f0f0f] p-12 hover:bg-[#171717] transition-colors duration-150 group"
      >
        <div class="w-full">
          <div class="flex justify-between items-center text-xs font-mono text-neutral-500 mb-6">
            <span>01</span>
            <span class="tracking-widest">AVAILABLE</span>
          </div>
          <hr class="border-neutral-800 mb-16" />
          
          <span class="text-xs tracking-widest uppercase text-neutral-500 block mb-3 group-hover:text-neutral-400 transition-colors">Field Desk</span>
          <h2 
            class="text-5xl font-extrabold tracking-tighter text-white lowercase" 
            style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;"
          >
            investigate.
          </h2>
        </div>
        
        <hr class="border-neutral-800 w-1/4" />
      </button>

      <!-- Admin Overseer Portal -->
      <button 
        @click="selectRole('ADMIN')"
        class="h-full flex flex-col justify-between text-left border border-neutral-800 bg-[#0f0f0f] p-12 hover:bg-[#171717] transition-colors duration-150 group"
      >
        <div class="w-full">
          <div class="flex justify-between items-center text-xs font-mono text-neutral-500 mb-6">
            <span>02</span>
            <span class="tracking-widest text-[#F40009]">RESTRICTED</span>
          </div>
          <hr class="border-neutral-800 mb-16" />
          
          <span class="text-xs tracking-widest uppercase text-neutral-500 block mb-3 group-hover:text-neutral-400 transition-colors">Control Room</span>
          <h2 
            class="text-5xl font-extrabold tracking-tighter text-white lowercase" 
            style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;"
          >
            admin.
          </h2>
        </div>
        
        <hr class="border-neutral-800 w-1/4" />
      </button>

    </div>
  </div>
</template>