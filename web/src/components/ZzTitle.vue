<script lang="ts" setup>
import {useSlots} from "vue"

const slots = useSlots()

const {title, extra} = defineProps({
  title: {type: String, default: ""},
  extra: {type: String, default: ""},
})

</script>

<template>
  <div class="py-2 text-lg font-bold flex justify-between">
    <div v-if="!slots.title">{{ title }}</div>
    <div v-else>
      <slot name="title"></slot>
    </div>
    <div v-if="!slots.extra">{{ extra }}</div>
    <div v-else>
      <slot name="extra"></slot>
    </div>
  </div>
</template>