<template>
  <div class="content" @mousedown.stop>
    <a-tabs v-model="type" default-active-key="search" @change="typeChange">
      <a-tab-pane key="search" title="查找"></a-tab-pane>
      <a-tab-pane key="replace" title="替换"></a-tab-pane>
    </a-tabs>
    <a-form layout="vertical" :model="form">
      <a-form-item field="searchWord">
        <template #label>
          <div style="display: flex; align-items: center;justify-content: space-between;width: 100%;">
            <span>查找</span>
            <div>
              <IconLeft class="next-btn left" @click="searchPrev()" v-tooltip="'上一个'"/>
              <IconRight class="next-btn right" @click="searchNext()" v-tooltip="'下一个'"/>
            </div>
          </div>
        </template>
        <a-input v-model="searchWord" ref="searchInpRef" placeholder="输入查找内容" @enter="searchNext()"/>
      </a-form-item>
      <a-form-item field="replaceWord" label="替换" v-if="type === 'replace'">
        <a-input v-model="replaceWord" placeholder="输入替换内容" @enter="replace()"/>
      </a-form-item>
<!--      <a-form-item field="modifiers" label="忽略大小写">
        <a-switch v-model="modifiers" checked-value="g" unchecked-value="gi" @change="toggleModifiers"/>
      </a-form-item>-->
      <a-form-item v-if="type === 'replace'">
        <a-button :disabled="!searchWord" style="margin-left: 5px;" @click="replace()">替换</a-button>
        <a-button :disabled="!searchWord" type="primary" style="margin-left: 5px;" @click="replaceAll()">全部替换
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import {nextTick, onMounted, ref, watch,} from 'vue'
import {useMainStore} from '@/store'
import useSearch from '@/hooks/useSearch'
import Input from '@/components/Input.vue'

type TypeKey = 'search' | 'replace'

interface TabItem {
  key: TypeKey
  label: string
}

const mainStore = useMainStore()

const {
  searchWord,
  replaceWord,
  modifiers,
  searchNext,
  searchPrev,
  replace,
  replaceAll,
  toggleModifiers
} = useSearch()

const type = ref<TypeKey>('search')
const tabs: TabItem[] = [
  {key: 'search', label: '查找'},
  {key: 'replace', label: '替换'},
]

const typeChange = (key: TypeKey) => {
  type.value = key
}

const close = () => {
  mainStore.setSearchPanelState(false)
}

const searchInpRef = ref<InstanceType<typeof Input>>()
onMounted(() => {
  searchInpRef.value!.focus()
})

const form = ref({})

watch(type, () => {
  nextTick(() => {
    searchInpRef.value!.focus()
  })
})
</script>

<style lang="scss" scoped>
.search-panel {
  font-size: 13px;
}

.content {

  .arco-tabs-content {
    padding: 0!important;
  }

  .arco-form {
    padding: 0 16px;
  }
}

.input {
  margin-top: 10px;
}

.count {
  font-size: 12px;
  margin-right: 8px;
  user-select: none;
}

.ignore-case {
  font-size: 12px;
  user-select: none;
  cursor: pointer;

  &.active {
    color: rgb(var(--primary-6));
  }
}

.next-btn {
  width: 22px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 !important;
  user-select: none;
  cursor: pointer;

  &:hover {
    color: rgb(var(--primary-6));
  }
}

.footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 10px;
}

.close-btn {
  width: 32px;
  height: 32px;
  position: absolute;
  top: 8px;
  right: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
  font-size: 13px;
  cursor: pointer;
}
</style>
