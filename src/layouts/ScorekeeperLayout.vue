<script setup lang="ts">
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
</script>

<template>
  <ResizablePanelGroup direction="horizontal">
    <ResizablePanel>
      <slot name="left">left</slot>
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel>
      <slot name="right">right</slot>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>

<style scoped>

</style>