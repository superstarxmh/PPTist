<template>
  <div class="theme-manager">
    <a-radio-group
        type="button"
        v-on:change="changeTheme"
        v-model="currentTheme"
    >
      <a-radio value="dark">
        <icon-moon-fill size="18"/>
      </a-radio>
      <a-radio value="light">
        <icon-sun-fill size="18"/>
      </a-radio>
    </a-radio-group>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';

const currentTheme = ref('light');

function changeTheme(theme) {
  currentTheme.value = theme;
  applyTheme();
  localStorage.setItem('theme', theme);
}

function applyTheme() {
  if (currentTheme.value === 'dark') {
    document.body.setAttribute('arco-theme', 'dark')
  } else {
    document.body.removeAttribute('arco-theme')
  }
}

// 初始化主题
if (localStorage.getItem('theme')) {
  currentTheme.value = localStorage.getItem('theme');
  changeTheme(localStorage.getItem('theme'));
} else {
  applyTheme();
}
</script>

<style lang="scss">
.theme-manager {
  position: absolute;
  right: 20px;
  top: 20px;
  z-index: 999;
  display: inline-block;
  margin-left: 16px;

  .arco-radio-group-button {
    padding: 1px 2px;

    .arco-radio-button {
      line-height: 24px;
      margin: 3px;
      height: 24px;

      .arco-radio-button-content {
        padding: 0 3px;
      }

      .arco-icon {
        display: inline-block;
        margin-top: 3px;
      }
    }
  }
}
</style>
