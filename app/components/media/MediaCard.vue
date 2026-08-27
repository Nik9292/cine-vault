<script setup lang="ts">
import { getTmdbImageUrl } from '~/utils/getTmdbImageUrl'

const { id, title, posterPath, voteAverage, releaseDate, mediaType } = defineProps<{
  id: number
  title: string
  posterPath: string | null
  voteAverage: number
  releaseDate: string
  mediaType: 'movie' | 'tv'
}>()

const posterUrl = computed(() => getTmdbImageUrl(posterPath))
const releaseYear = computed(() => releaseDate.split('-')[0])
const voteAverageFixed = computed(() => voteAverage.toFixed(1))
const ratingClass = computed(() => {
  if (voteAverage >= 7) return 'rating--high'
  if (voteAverage >= 5) return 'rating--medium'

  return 'rating--low'
})
const mediaTypeLabel = computed(() => (mediaType === 'movie' ? 'Фильм' : 'Сериал'))
</script>

<template>
  <NuxtLink :to="`/media/movies/${id}`">
    <article class="media-card">
      <div class="media-card__poster-wrapper">
        <img
          v-if="posterUrl"
          class="media-card__poster"
          :src="posterUrl"
          :alt="title"
        />

        <span :class="['media-card__rating', ratingClass]">
          {{ voteAverageFixed }}
        </span>

        <div class="media-card__overlay">
          <div class="media-card__actions">
            <button
              class="media-card__action"
              type="button"
              title="Нравится"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path
                  d="M12 21.35 10.55 20.03C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3 9.24 3 10.91 3.81 12 5.09 13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54Z"
                />
              </svg>
            </button>

            <button
              class="media-card__action"
              type="button"
              title="В избранное"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="media-card__content">
        <h3 class="media-card__title">
          {{ title }}
        </h3>

        <div class="media-card__meta">
          <span>{{ releaseYear }}</span>
          <span>{{ mediaTypeLabel }}</span>
        </div>
      </div>
    </article>
  </NuxtLink>
</template>

<style scoped lang="scss">
.media-card {
  overflow: hidden;
  width: 180px;
  color: var(--color-text);
  background: #1a1a2e;
  border-radius: 12px;
  cursor: pointer;
  transition:
    transform 200ms ease,
    box-shadow 200ms ease;
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 14px 32px rgb(0 0 0 / 35%);
    .media-card__poster {
      transform: scale(1.05);
    }
    .media-card__overlay {
      opacity: 1;
    }
  }
  &__poster-wrapper {
    position: relative;
    overflow: hidden;
    aspect-ratio: 2 / 3;
    background: #24243d;
  }
  &__poster {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 300ms ease;
  }
  &__rating {
    position: absolute;
    z-index: 2;
    top: 10px;
    right: 10px;
    padding: 4px 8px;
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    border-radius: 6px;
    &.rating--high {
      background: var(--color-success);
    }
    &.rating--medium {
      background: var(--color-warning);
    }
    &.rating--low {
      background: var(--color-danger);
    }
  }
  &__overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 18px;
    background: rgb(0 0 0 / 65%);
    opacity: 0;
    transition: opacity 200ms ease;
  }
  &__actions {
    display: flex;
    gap: 12px;
  }
  &__action {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    padding: 0;
    color: #fff;
    background: rgb(255 255 255 / 16%);
    border: 0;
    border-radius: 50%;
    cursor: pointer;
    transition:
      color 200ms ease,
      background 200ms ease,
      transform 200ms ease;
  }
  &__action:hover {
    color: #e94560;
    background: rgb(255 255 255 / 25%);
    transform: scale(1.1);
  }
  &__content {
    padding: 12px;
  }
  &__title {
    overflow: hidden;
    margin: 0 0 6px;
    font-size: 15px;
    font-weight: 600;
    line-height: 1.35;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &__meta {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    color: #8f8fa3;
    font-size: 12px;
  }
}
</style>
