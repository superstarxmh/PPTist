<template>
  <div class="export-wrap">
    <a-form :model="form" layout="vertical">
      <a-form-item field="exportType" label="文件类型：">
        <a-select
            v-model="form.exportType"
            @change="setDialogForExport"
            placeholder="请选择文件类型">
          <a-option v-for="item in tabs" :key="item.key" :value="item.key">{{ item.label }}</a-option>
        </a-select>
      </a-form-item>
      <template v-if="form.exportType !== 'json'">
        <a-form-item field="range" label="导出范围：">
          <a-radio-group type="button" v-model="form.range">
            <a-radio value="all">全部</a-radio>
            <a-radio value="current">当前页</a-radio>
            <a-radio value="custom">自定义</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item field="customRange" label="自定义范围：" v-if="form.range === 'custom'">
          <a-slider
              :default-value="[1,slides.length]"
              :max="slides.length" :min="1"
              v-model:value="form.customRange"
              range show-input/>
        </a-form-item>
      </template>
      <component ref="itemExport" :is="currentDialogComponent" @close="setDialogForExport('')" :selectedSlides="selectedSlides"></component>
    </a-form>
    <a-button class="export-btn" type="primary" @click="exportStart">点击导出</a-button>

    <FullscreenSpin :loading="exporting" tip="正在导出..."/>
  </div>
</template>

<script lang="ts" setup>
import {computed, reactive, ref} from 'vue'
import {storeToRefs} from 'pinia'
import {useMainStore, useSlidesStore} from '@/store'
import type {DialogForExportTypes} from '@/types/export'

import ExportImage from './ExportImage.vue'
import ExportJSON from './ExportJSON.vue'
import ExportPDF from './ExportPDF.vue'
import ExportPPTX from './ExportPPTX.vue'
import ExportSpecificFile from './ExportSpecificFile.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'
import useExport from '@/hooks/useExport'

interface TabItem {
  key: DialogForExportTypes
  label: string
}

interface ExportForm {
  exportType: DialogForExportTypes,
  range: 'all' | 'current' | 'custom',
  customRange: [number, number]
}

const mainStore = useMainStore()
const {dialogForExport} = storeToRefs(mainStore)

const setDialogForExport = mainStore.setDialogForExport

const tabs: TabItem[] = [
  {key: 'pptist', label: '导出 pptist 文件'},
  {key: 'pptx', label: '导出 PPTX'},
  {key: 'image', label: '导出图片'},
  {key: 'json', label: '导出 JSON'},
  {key: 'pdf', label: '打印 / 导出 PDF'},
]

const currentDialogComponent = computed<unknown>(() => {
  const dialogMap = {
    'image': ExportImage,
    'json': ExportJSON,
    'pdf': ExportPDF,
    'pptx': ExportPPTX,
    'pptist': ExportSpecificFile,
  }
  if (dialogForExport.value) return dialogMap[dialogForExport.value] || null
  return null
})

const { slides, currentSlide } = storeToRefs(useSlidesStore())
const form: ExportForm = reactive({
  exportType: 'pptx',
  range: 'all',
  customRange: [1, slides.value.length],
})

const selectedSlides = computed(() => {
  if (form.range === 'all') return slides.value
  if (form.range === 'current') return [currentSlide.value]
  return slides.value.filter((item, index) => {
    const [min, max] = form.customRange
    return index >= min - 1 && index <= max - 1
  })
})

const {exporting} = useExport()
const itemExport = ref(null)
const exportStart = () => {
  if (itemExport.value) {
    itemExport.value.exportAction(selectedSlides)
  }
}

</script>

<style lang="scss" scoped>
.export-wrap {
  padding: 16px 20px;
  max-height: 600px;

  .export-btn {
    width: 100%;
  }

  .arco-form-item {
    margin-bottom: 8px !important;
  }
}

//.content {
//  height: 460px;
//  padding: 12px;
//  font-size: 13px;
//
//  @include overflow-overlay();
//}
</style>
