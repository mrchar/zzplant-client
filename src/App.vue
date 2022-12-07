<script lang="ts" setup></script>

<template>
  <div class="w-screen h-screen overflow-hidden flex flex-col gap-4 bg-zinc-100">
    <div class="flex-none w-full flex justify-between bg-red-400">
      <div class="bg-green-400">
        Logo
      </div>
      <div class="bg-yellow-400">
        SearchBar
      </div>
      <div class="bg-blue-400">
        Options
      </div>
    </div>
    <div class="flex-1 w-full h-96 max-w-7xl mx-auto bg-white">
      <router-view/>
    </div>
  </div>
</template>
