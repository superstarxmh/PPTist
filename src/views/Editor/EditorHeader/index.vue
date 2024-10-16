<template>
  <div class="editor-header">
    <div class="left">
      <a-dropdown trigger="click" position="bl"
                  :hide-on-select="false"
                  :popup-max-height="false">
        <a-button type="text">
          <IconHamburgerButton class="icon"/>
        </a-button>
        <template #content>
          <div class="save-title-warp">
            <div class="save-title">
              <span>{{ title }}</span>
              <i class="iconfont v-icon-svg11"></i>
            </div>
          </div>
          <a-divider margin="4px"/>
          <FileInput accept=".pptist" @change="files => {
            importSpecificFile(files)
            mainMenuVisible = false
          }">
            <a-doption>导入 pptist 文件</a-doption>
          </FileInput>
          <FileInput accept="application/vnd.openxmlformats-officedocument.presentationml.presentation" @change="files => {
            importPPTXFile(files)
            mainMenuVisible = false
          }">
            <a-doption>导入 pptx 文件（测试版）</a-doption>
          </FileInput>
          <a-doption @click="resetSlides(); mainMenuVisible = false">重置幻灯片</a-doption>
          <a-divider margin="4px"/>
          <a-doption value="saveLog">保存记录</a-doption>
          <a-doption value="createACopy">创建副本</a-doption>
          <a-doption value="viewHistorical">查看历史版本</a-doption>
        </template>
      </a-dropdown>

      <div class="title">
        <Input
            class="title-input"
            ref="titleInputRef"
            v-model:value="titleValue"
            @blur="handleUpdateTitle()"
            v-if="editingTitle"
        ></Input>
        <div
            class="title-text"
            @click="startEditTitle()"
            :title="title"
            v-else
        >{{ title }}
        </div>
      </div>

      <a-button style="margin-left: 8px;cursor: unset;" disabled>演示文稿</a-button>

      <a-divider direction="vertical" margin="20px" style="margin-right: 8px;"/>
      <a-button :class="canUndo ? '' : 'his-disabled'" :disabled="!canUndo" type="text" @click="undo"><i
          class="iconfont v-icon-svg13"></i></a-button>
      <a-button :class="canRedo ? '' : 'his-disabled'" :disabled="!canRedo" type="text" @click="redo"><i
          class="iconfont v-icon-svg12"></i></a-button>
    </div>


    <div class="right">
      <themeManager style="position: unset;margin-right: 8px;"></themeManager>
      <a-dropdown trigger="click" :hide-on-select="false">
        <a-button type="text"><i class="iconfont v-icon-view"></i></a-button>
        <template #content>
          <div class="save-title-warp">
            <div class="save-title">
              <span>面板控制</span>
            </div>
          </div>
          <a-divider margin="0"/>
          <a-doption
              v-for="item in options" :key="item.value"
              @click="onClick(item)"
              :value="item.value"
              :class="{'is-current': showViews.includes(item.value), 'current-view-doption': true}"
          >
            <i :class="`iconfont ${item.icon}`"></i> {{ item.label }}
            <icon-check size="16"/>
          </a-doption>
        </template>
      </a-dropdown>

      <a-dropdown trigger="click" :hide-on-select="false" :popup-max-height="false">
        <a-button type="text"><i class="iconfont v-icon-search"></i></a-button>
        <template #content>
          <SearchPanel1 :key="searchType"></SearchPanel1>
        </template>
      </a-dropdown>

      <a-button-group>
        <a-button type="text" style="padding-right: 8px;" @click="enterScreening()">
          <i class="iconfont v-icon-svg19"></i>
        </a-button>
        <a-divider direction="vertical" margin="0"/>
        <a-dropdown trigger="click" :hide-on-select="false">
          <a-button type="text">
            <template #icon>
              <icon-down/>
            </template>
          </a-button>
          <template #content>
            <a-doption value="enterScreeningFromStart" @click="enterScreeningFromStart()">从头开始</a-doption>
            <a-doption value="enterScreening" @click="enterScreening()">从当前页开始</a-doption>
          </template>
        </a-dropdown>
      </a-button-group>
      <a-dropdown trigger="click" :hide-on-select="false">
        <a-button type="primary" style="margin-left: 8px;"><i class="iconfont v-icon-svg15"></i> 导出</a-button>
        <template #content>
          <div class="save-title-warp">
            <div class="save-title">
              <span>导出文件</span>
            </div>
          </div>
<!--          <a-form  :model="form" :style="{width:'600px'}" auto-label-width @submit="handleSubmit">
            <a-form-item field="name" label="Username">
              <a-input v-model="form.name" placeholder="please enter your username..." />
            </a-form-item>
            <a-form-item field="post" label="Post">
              <a-input v-model="form.post" placeholder="please enter your post..." />
            </a-form-item>
            <a-form-item field="isRead">
              <a-checkbox v-model="form.isRead">
                I have read the manual
              </a-checkbox>
            </a-form-item>
            <a-form-item>
              <a-button html-type="submit">Submit</a-button>
            </a-form-item>
          </a-form>-->
        </template>
      </a-dropdown>
      <!--      <a class="github-link" v-tooltip="'Copyright © 2020-PRESENT pipipi-pikachu'" href="https://github.com/pipipi-pikachu/PPTist" target="_blank">
              <div class="menu-item"><IconGithub class="icon" /></div>
            </a>-->
    </div>

    <Drawer
        :width="320"
        v-model:visible="hotkeyDrawerVisible"
        placement="right"
    >
      <HotkeyDoc/>
      <template v-slot:title>快捷操作</template>
    </Drawer>

    <FullscreenSpin :loading="exporting" tip="正在导入..."/>
  </div>
</template>

<script lang="ts" setup>
import {nextTick, reactive, ref} from 'vue'
import {storeToRefs} from 'pinia'
import {useMainStore, useSlidesStore, useSnapshotStore} from '@/store'
import useScreening from '@/hooks/useScreening'
import useImport from '@/hooks/useImport'
import useSlideHandler from '@/hooks/useSlideHandler'
import type {DialogForExportTypes} from '@/types/export'

import themeManager from '@/views/components/themeManager/index.vue'
import HotkeyDoc from './HotkeyDoc.vue'
import FileInput from '@/components/FileInput.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'
import Drawer from '@/components/Drawer.vue'
import Input from '@/components/Input.vue'
import SearchPanel1 from '../SearchPanel1.vue'
import useHistorySnapshot from "@/hooks/useHistorySnapshot";

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const {title} = storeToRefs(slidesStore)
const {enterScreening, enterScreeningFromStart} = useScreening()
const {importSpecificFile, importPPTXFile, exporting} = useImport()
const {resetSlides} = useSlideHandler()

const mainMenuVisible = ref(false)
const hotkeyDrawerVisible = ref(false)
const editingTitle = ref(false)
const titleInputRef = ref<InstanceType<typeof Input>>()
const titleValue = ref('')

const {canUndo, canRedo} = storeToRefs(useSnapshotStore())

const {redo, undo} = useHistorySnapshot()

const startEditTitle = () => {
  titleValue.value = title.value
  editingTitle.value = true
  nextTick(() => titleInputRef.value?.focus())
}

const handleUpdateTitle = () => {
  slidesStore.setTitle(titleValue.value)
  editingTitle.value = false
}

const goLink = (url: string) => {
  window.open(url)
  mainMenuVisible.value = false
}

const setDialogForExport = (type: DialogForExportTypes) => {
  mainStore.setDialogForExport(type)
  mainMenuVisible.value = false
}

const options = [
  {
    label: '图层',
    value: 'layer',
    icon: 'v-icon-layer head-btn-icon',
  },
  {
    label: '组件列表',
    value: 'com',
    icon: 'v-icon-svg2 com-list-icon',
  },
  {
    label: '工具箱',
    value: 'toolbox',
    icon: 'v-icon-svg1 head-btn-icon',
  },
  {
    label: '右侧配置',
    value: 'config',
    icon: 'v-icon-svg3 head-btn-icon',
  },
]

const showViews = reactive(['layer', 'com', 'toolbox', 'config'])

const onClick = (item: typeof options[number]) => {
  if (showViews.value.includes(item.value)) {
    showViews.value = showViews.value.filter(v => v !== item.value)
  } else {
    showViews.value.push(item.value)
  }
}

const handleSubmit = () => {

}

const form = ref({
  name: '',
  post: '',
  isRead: false
})

const searchType = ref('search')
</script>

<style lang="scss" scoped>
.editor-header {
  height: 57px;
  display: flex;
  background: var(--color-bg-1);
  border-bottom: 1px solid var(--color-border-2);
  user-select: none;
  justify-content: space-between;
  padding: 0 5px;
}

.left, .right {
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu-item {
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  padding: 0 10px;
  border-radius: $border-radius-small;
  cursor: pointer;

  .icon {
    font-size: 18px;
    color: var(--color-text-2);
  }

  &:hover {
    background-color: var(--color-bg-3);
  }
}

.group-menu-item {
  height: 30px;
  display: flex;
  margin: 0 8px;
  padding: 0 2px;
  border-radius: $border-radius-small;

  &:hover {
    background-color: var(--color-bg-3);
  }

  .menu-item {
    padding: 0 3px;
  }

  .arrow-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
}

.title {
  height: 30px;
  margin-left: 2px;
  font-size: 13px;

  .title-input {
    width: 200px;
    height: 100%;
    padding-left: 0;
    padding-right: 0;

    ::v-deep(input) {
      height: 28px;
      line-height: 28px;
    }
  }

  .title-text {
    min-width: 20px;
    max-width: 400px;
    line-height: 30px;
    padding: 0 6px;
    border-radius: $border-radius-small;
    cursor: pointer;
    color: var(--color-text-2);

    @include ellipsis-oneline();

    &:hover {
      background-color: var(--color-bg-2);
    }
  }
}

.github-link {
  display: inline-block;
  height: 30px;
}

.is-current.current-view-doption,
.is-current.current-mode-doption {
  color: rgb(var(--primary-6));

  .arco-icon {
    display: inline-block;
  }
}

.current-view-doption {
  width: 149px;
  padding: 0 20px;

  .iconfont {
    display: inline-block;
    margin-right: 4px;
  }

  .arco-icon {
    display: none;
    margin-left: 4px;
  }
}
</style>

<style lang="scss">
.editor-header {

  .arco-btn-text {
    color: var(--color-text-2) !important;

    &:hover {
      color: var(--color-text-2);
    }
  }

  .left {
    .arco-btn {
      padding: 0 7px;
      height: 28px;
      line-height: 28px;

      &:hover {
        color: var(--color-text-2);
      }
    }

    .arco-btn-disabled {
      color: var(--color-text-4);
    }

    .his-disabled {
      //cursor: unset!important;
      color: var(--color-text-4) !important;
    }
  }
}

.save-title-warp {
  padding: 8px 16px;

  .save-title {
    margin-bottom: 8px;
    font-size: $font-size-title-1;
    font-weight: $font-weight-700;
    color: var(--color-text-1);

    .iconfont {
      display: inline-block;
      margin-left: 4px;
      cursor: pointer;
    }
  }

  .save-title-desc {
    font-size: 14px;
    color: var(--color-text-4);

    span {
      display: inline-block;
      margin-left: 20px;
    }
  }
}
</style>
