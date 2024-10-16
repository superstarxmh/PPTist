<template>
  <button
    class="button"
    :class="{
      'disabled': disabled,
      'checked': !disabled && checked,
      'default': !disabled && type === 'default',
      'primary': !disabled && type === 'primary',
      'checkbox': !disabled && type === 'checkbox',
      'radio': !disabled && type === 'radio',
      'small': size === 'small',
      'first': first,
      'last': last,
    }"
    @click="handleClick()"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  checked?: boolean
  disabled?: boolean
  type?: 'default' | 'primary' | 'checkbox' | 'radio'
  size?: 'small' | 'normal'
  first?: boolean
  last?: boolean
}>(), {
  checked: false,
  disabled: false,
  type: 'default',
  size: 'normal',
  first: false,
  last: false,
})

const emit = defineEmits<{
  (event: 'click'): void
}>()

const handleClick = () => {
  if (props.disabled) return
  emit('click')
}
</script>

<style lang="scss" scoped>
.button {
  height: 32px;
  line-height: 32px;
  outline: 0;
  font-size: 13px;
  padding: 0 15px;
  text-align: center;
  color: $textColor;
  border-radius: $border-radius-small;
  user-select: none;
  letter-spacing: 1px;
  cursor: pointer;

  &.small {
    height: 24px;
    line-height: 24px;
    padding: 0 7px;
    letter-spacing: 0;
    font-size: 12px;
  }

  &.default {
    background-color: #fff;
    border: 1px solid #d9d9d9;
    color: $textColor;

    &:hover {
      color: rgb(var(--primary-6));
      border-color: rgb(var(--primary-6));
    }
  }
  &.primary {
    background-color: rgb(var(--primary-6));
    border: 1px solid rgb(var(--primary-6));
    color: #fff;

    &:hover {
      background-color: rgb(var(--primary-6));
      border-color: rgb(var(--primary-6));
    }
  }
  &.checkbox, &.radio {
    background-color: #fff;
    border: 1px solid #d9d9d9;
    color: $textColor;

    &:not(.checked):hover {
      color: rgb(var(--primary-6));
    }
  }
  &.checked {
    color: #fff;
    background-color: rgb(var(--primary-6));
    border-color: rgb(var(--primary-6));

    &:hover {
      background-color: rgb(var(--primary-6));
      border-color: rgb(var(--primary-6));
    }
  }
  &.disabled {
    background-color: #f5f5f5;
    border: 1px solid #d9d9d9;
    color: #b7b7b7;
    cursor: default;
  }
}
</style>
