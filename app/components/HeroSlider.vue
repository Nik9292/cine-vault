<script setup lang="ts">
import type { MovieSummary } from '~~/shared/types/media'
import { getTmdbImageUrl } from '~/utils/getTmdbImageUrl'

const { items } = defineProps<{
  items: MovieSummary[]
}>()

const currentIndex = ref(0)
const isMounted = ref(false)

let interval: ReturnType<typeof setInterval> | null = null

function getBackdropUrl(item: MovieSummary): string | null {
  return getTmdbImageUrl(item.backdropPath, 'original')
}

function stopAutoplay(): void {
  if (!interval) return

  clearInterval(interval)
  interval = null
}

function startAutoplay(): void {
  stopAutoplay()

  if (items.length <= 1) return

  interval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % items.length
  }, 6000)
}

function goToSlide(index: number): void {
  currentIndex.value = index
  startAutoplay()
}

watch(
  () => items.length,
  (length) => {
    if (currentIndex.value >= length) {
      currentIndex.value = 0
    }

    if (isMounted.value) {
      startAutoplay()
    }
  },
)

onMounted(() => {
  isMounted.value = true
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<template>
  <section
    v-if="items.length"
    class="hero-slider"
    aria-label="Популярные фильмы"
  >
    <article
      v-for="(item, index) in items"
      :key="item.id"
      class="hero-slider__slide"
      :class="{ 'hero-slider__slide--active': index === currentIndex }"
      :aria-hidden="index !== currentIndex"
    >
      <div
        class="hero-slider__backdrop"
        :style="{
          backgroundImage: `url(${getBackdropUrl(item)})`,
        }"
      />

      <div class="hero-slider__gradient" />

      <div class="container hero-slider__content">
        <h1 class="hero-slider__title">
          {{ item.title }}
        </h1>

        <div class="hero-slider__rating">
          <Icon
            name="lucide:star"
            size="18"
          />

          <span>{{ item.voteAverage.toFixed(1) }}</span>
        </div>

        <p class="hero-slider__overview">
          {{ item.overview }}
        </p>

        <NuxtLink
          class="hero-slider__button"
          :to="`/media/movie/${item.id}`"
          :tabindex="index === currentIndex ? undefined : -1"
        >
          Подробнее
        </NuxtLink>
      </div>
    </article>

    <div class="hero-slider__dots">
      <button
        v-for="(item, index) in items"
        :key="item.id"
        class="hero-slider__dot"
        :class="{ 'hero-slider__dot--active': index === currentIndex }"
        type="button"
        :aria-label="`Перейти к слайду ${index + 1}`"
        :aria-current="index === currentIndex ? 'true' : undefined"
        @click="goToSlide(index)"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.hero-slider {
  position: relative;
  overflow: hidden;
  height: 650px;
  background: var(--color-page-background);

  &__slide {
    position: absolute;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity 800ms ease;

    &--active {
      z-index: 1;
      opacity: 1;
      pointer-events: auto;
    }
  }

  &__backdrop,
  &__gradient {
    position: absolute;
    inset: 0;
  }

  &__backdrop {
    background-position: center;
    background-size: cover;
  }

  &__gradient {
    background:
      linear-gradient(
        to top,
        var(--color-page-background) 0%,
        rgb(22 33 62 / 90%) 12%,
        rgb(22 33 62 / 45%) 35%,
        transparent 60%
      ),
      linear-gradient(to right, rgb(15 15 26 / 92%) 0%, rgb(15 15 26 / 45%) 55%, transparent 80%);
  }

  &__content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 100%;
    padding-bottom: 72px;
  }

  &__title {
    max-width: 650px;
    margin-bottom: 12px;
    color: var(--color-text);
    font-size: clamp(32px, 5vw, 56px);
    font-weight: 700;
    line-height: 1.1;
  }

  &__rating {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 14px;
    color: var(--color-text);
    font-size: 16px;
    font-weight: 700;

    :deep(svg) {
      color: #ffc107;
      fill: #ffc107;
    }
  }

  &__overview {
    display: -webkit-box;
    overflow: hidden;
    max-width: 600px;
    margin-bottom: 24px;
    color: #c4c4cf;
    font-size: 14px;
    line-height: 1.6;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }

  &__button {
    width: fit-content;
    padding: 12px 28px;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    background: var(--color-accent);
    border-radius: 24px;
    transition:
      background-color 150ms ease,
      transform 150ms ease;

    &:hover,
    &:focus-visible {
      background: #d13050;
      transform: translateY(-2px);
    }
  }

  &__dots {
    position: absolute;
    z-index: 2;
    bottom: 24px;
    left: 50%;
    display: flex;
    gap: 8px;
    transform: translateX(-50%);
  }

  &__dot {
    width: 10px;
    height: 10px;
    padding: 0;
    background: rgb(255 255 255 / 35%);
    border: 0;
    border-radius: 5px;
    cursor: pointer;
    transition:
      width 150ms ease,
      background-color 150ms ease;

    &:hover,
    &:focus-visible {
      background: rgb(255 255 255 / 60%);
    }

    &--active {
      width: 28px;
      background: var(--color-accent);
    }
  }
}

@media (max-width: 720px) {
  .hero-slider {
    height: 430px;

    &__gradient {
      background:
        linear-gradient(
          to top,
          var(--color-page-background) 0%,
          rgb(22 33 62 / 88%) 15%,
          rgb(22 33 62 / 40%) 45%,
          transparent 70%
        ),
        linear-gradient(to right, rgb(15 15 26 / 82%) 0%, rgb(15 15 26 / 30%) 100%);
    }

    &__content {
      padding-bottom: 64px;
    }

    &__overview {
      -webkit-line-clamp: 2;
    }
  }
}
</style>
