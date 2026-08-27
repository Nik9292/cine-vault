<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    itemWidth?: number
    gap?: number
  }>(),
  {
    itemWidth: 180,
    gap: 16,
  },
)

const scrollContainer = ref<HTMLElement | null>(null)

const canScrollLeft = ref(false)
const canScrollRight = ref(false)

const updateScrollState = () => {
  const container = scrollContainer.value

  if (!container) return

  canScrollLeft.value = container.scrollLeft > 0

  canScrollRight.value = container.scrollLeft + container.clientWidth < container.scrollWidth
}

const scrollStep = computed(() => props.itemWidth + props.gap)

const scrollLeft = () => {
  scrollContainer.value?.scrollBy({
    left: -scrollStep.value,
    behavior: 'smooth',
  })
}

const scrollRight = () => {
  scrollContainer.value?.scrollBy({
    left: scrollStep.value,
    behavior: 'smooth',
  })
}

onMounted(() => {
  updateScrollState()
})
</script>

<template>
  <div
    class="slider"
    :style="{
      '--item-width': `${props.itemWidth}px`,
      '--gap': `${props.gap}px`,
    }"
  >
    <div class="slider__controls">
      <button
        class="slider__button"
        type="button"
        :disabled="!canScrollLeft"
        @click="scrollLeft"
      >
        ←
      </button>

      <button
        class="slider__button"
        type="button"
        :disabled="!canScrollRight"
        @click="scrollRight"
      >
        →
      </button>
    </div>

    <div
      ref="scrollContainer"
      class="slider__track"
      @scroll="updateScrollState"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.slider {
  width: 100%;

  &__controls {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-bottom: 16px;
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 30px;
    height: 30px;

    color: #fff;
    font-size: 10px;

    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 50%;

    cursor: pointer;

    transition:
      background-color 0.2s,
      opacity 0.2s;

    &:hover:not(:disabled) {
      background: #2a2a2a;
    }

    &:disabled {
      opacity: 0.3;
      cursor: default;
    }
  }

  &__track {
    display: flex;
    gap: var(--gap);

    overflow-x: auto;

    scroll-snap-type: x proximity;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    :deep(> *) {
      flex: 0 0 var(--item-width);
      scroll-snap-align: start;
    }
  }
}
</style>
