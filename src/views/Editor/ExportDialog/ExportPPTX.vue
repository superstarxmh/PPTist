<template>
  <div class="export-pptx">
    <a-form :model="form" auto-label-width>
      <a-form-item field="ignoreMedia" label="忽略音频/视频：">
        <a-switch v-model="ignoreMedia" size="small"/>
      </a-form-item>
      <a-form-item field="masterOverwrite" label="覆盖默认母版：">
        <a-switch v-model="masterOverwrite" size="small"/>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import useExport from '@/hooks/useExport'
import {ref} from 'vue'

const masterOverwrite = ref(true)
const ignoreMedia = ref(true)

const form = ref({})
const { exportPPTX } = useExport()

const exportAction = (selectedSlides) => {
  exportPPTX(selectedSlides, masterOverwrite, ignoreMedia)
}

// 暴露方法给父组件调用
defineExpose({
  exportAction
})
</script>

<style lang="scss" scoped>
.export-pptx {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  .arco-form-item {
    margin-bottom: 8px!important;
  }
}
.configs {
  width: 350px;
  height: calc(100% - 100px);
  display: flex;
  flex-direction: column;
  justify-content: center;

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

  .tip {
    font-size: 12px;
    color: #aaa;
    line-height: 1.8;
    margin-top: 10px;
  }
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
</style>
