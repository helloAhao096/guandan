<script setup lang="ts">
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
</script>

<template>
  <ResizablePanelGroup direction="vertical">

    <ResizablePanel>
      <slot name="fraction">
        计分器
      </slot>
    </ResizablePanel>
    <ResizableHandle :disabled="true"/>

    <ResizablePanel>
      <slot name="ranking">
        排名
      </slot>
    </ResizablePanel>

    <ResizableHandle :disabled="true"/>

    <ResizablePanel>
      <slot name="operation">
        操作
      </slot>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
<style scoped>

</style>