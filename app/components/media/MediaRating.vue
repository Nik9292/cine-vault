<script setup lang="ts">
const { userRating } = defineProps<{
  userRating: number | null
}>()

const emit = defineEmits<{
  handleRate: [rating: number]
}>()
</script>

<template>
  <div class="stars">
    <button
      v-for="n in 10"
      :key="n"
      type="button"
      :class="['star', { 'star--active': userRating !== null && n <= userRating }]"
      @click="emit('handleRate', n)"
    >
      <Icon name="lucide:star" />
    </button>
  </div>
</template>

<style scoped lang="scss">
.stars {
  display: flex;
  gap: 2px;
  .star {
    padding: 0;
    color: rgb(255 255 255 / 15%);
    font-family: inherit;
    font-size: 22px;
    background: none;
    border: 0;
    cursor: pointer;
    transition:
      color 150ms ease,
      transform 150ms ease;

    &:hover {
      color: #ffc107;
      transform: scale(1.2);
    }

    &--active {
      color: #ffc107;
    }
  }
}
</style>
