<template>
  <div class="export-pdf-dialog">
    <a-form :model="form" auto-label-width layout="vertical">
      <a-form-item field="count" label="每页数量：">
        <a-select v-model="count" :style="{width:'320px'}" placeholder="Please select ...">
          <a-option v-for="item of options" :value="item" :label="item.label" :key="item.value"></a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="padding" label="边缘留白："
                   style="display: flex; align-items: center;"
                   :label-col-style="{flex: 1, marginBottom: 0}">
        <a-switch v-model="padding" size="small"/>
      </a-form-item>
    </a-form>
    <div class="tip">
      提示：若打印预览与实际样式不一致，请在弹出的打印窗口中勾选【背景图形】选项。
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import { print } from '@/utils/print'

const { slides, currentSlide, viewportRatio } = storeToRefs(useSlidesStore())

const pdfThumbnailsRef = ref<HTMLElement>()
const rangeType = ref<'all' | 'current'>('all')
const count = ref(1)
const padding = ref(true)

const expPDF = () => {
  if (!pdfThumbnailsRef.value) return
  const pageSize = {
    width: 1600,
    height: rangeType.value === 'all' ? 1600 * viewportRatio.value * count.value : 1600 * viewportRatio.value,
    margin: padding.value ? 50 : 0,
  }
  print(pdfThumbnailsRef.value, pageSize)
}

const options = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
]

const form = ref({})
</script>

<style lang="scss" scoped>
.export-pdf-dialog {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  .arco-form-item {
    margin-bottom: 8px !important;
  }

  .tip {
    font-size: 12px;
    color: var(--color-text-3);
    line-height: 1.8;
    margin-bottom: 8px;
  }
}
</style>
