<script setup lang="ts">
const active = defineModel<boolean>({ default: false })
const { title, iconName, size } = defineProps<{
  title: string
  iconName: string
  size?: string
}>()
</script>

<template>
  <button
    type="button"
    :class="['action-btn', { 'action-btn--active': active }]"
    @click="active = !active"
  >
    <Icon
      :name="`lucide:${iconName}`"
      :size="size ?? '20'"
    />

    <span>{{ title }}</span>
  </button>
</template>

<style scoped lang="scss">
.action-btn {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 10px 18px;
  color: #9ca3af;
  font-family: inherit;
  font-size: 14px;
  background: rgb(255 255 255 / 6%);
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: 24px;
  cursor: pointer;
  transition:
    color 150ms ease,
    background 150ms ease,
    border-color 150ms ease;

  &:hover {
    color: #eaeaea;
    background: rgb(255 255 255 / 10%);
  }

  &--active {
    color: #e94560;
    background: rgb(233 69 96 / 10%);
    border-color: rgb(233 69 96 / 30%);
  }
}
</style>
