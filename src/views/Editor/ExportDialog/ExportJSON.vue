<template>
  <div class="export-json-dialog">
    <div class="preview">
      <pre>{{slides}}</pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'

const { slides } = storeToRefs(useSlidesStore())
</script>

<style lang="scss" scoped>
.export-json-dialog {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
.preview {
  width: 100%;
  margin-bottom: 8px;
  max-height: 400px;
  background-color: var(--color-bg-1);
  color: var(--color-text-1);
  overflow: auto;
}
pre {
  font-family: SFMono-Regular, Consolas, 'Liberation Mono', Menlo, Courier, monospace;
}
.btns {
  width: 300px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;

  .export {
    flex: 1;
  }
  .close {
    width: 100px;
    margin-left: 10px;
  }
}
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: #e1e1e1;
  border-radius: 5px;
}
</style>
