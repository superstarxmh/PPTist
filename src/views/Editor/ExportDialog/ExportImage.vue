<template>
  <div class="export-img-dialog">
    <div class="thumbnails-view">
      <div class="thumbnails" ref="imageThumbnailsRef">
        <ThumbnailSlide
            class="thumbnail"
            v-for="slide in selectedSlides"
            :key="slide.id"
            :slide="slide"
            :size="1600"
        />
      </div>
    </div>
    <a-form :model="form" auto-label-width layout="vertical">
      <a-form-item field="format" label="导出格式：">
        <a-radio-group type="button" v-model="format">
          <a-radio value="jpeg" style="width: 50%; text-align: center;">JPEG</a-radio>
          <a-radio value="png" style="width: 50%; text-align: center;">PNG</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item field="quality" label="图片质量：">
        <a-slider
            style="padding: 0 8px;"
            :min="0"
            :max="1"
            :step="0.1"
            v-model:value="quality"
        />
      </a-form-item>
      <a-form-item field="ignoreWebfont" label="忽略在线字体："
                   style="display: flex; align-items: center;"
                   :label-col-style="{flex: 1, marginBottom: 0}">
        <a-switch v-model="ignoreWebfont" size="small"/>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref, defineProps} from 'vue'
import useExport from '@/hooks/useExport'

import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'

const imageThumbnailsRef = ref<HTMLElement>()
const format = ref<'jpeg' | 'png'>('jpeg')
const quality = ref(1)
const ignoreWebfont = ref(true)
const {exportImage} = useExport()

// 定义 Props 类型
interface Props {
  selectedSlides: [];
}
const props = defineProps<Props>()

const exportAction = () => {
  if (!imageThumbnailsRef.value) return
  exportImage(imageThumbnailsRef.value, format.value, quality.value, ignoreWebfont.value)
}

const form = reactive({})

// 暴露方法给父组件调用
defineExpose({
  exportAction
})
</script>

<style lang="scss" scoped>
.export-img-dialog {
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
}

.thumbnails-view {
  @include absolute-0();
  z-index: -1;
}

.configs {
  width: 350px;
  height: calc(100% - 100px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 1;

  .row {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 25px;
  }

  .title {
    width: 100px;
    position: relative;

    &::after {
      content: attr(data-range);
      position: absolute;
      top: 20px;
      left: 0;
    }
  }

  .config-item {
    flex: 1;
  }
}

.btns {
  width: 300px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;

  .export {
    flex: 1;
  }

  .close {
    width: 100px;
    margin-left: 10px;
  }
}
</style>
