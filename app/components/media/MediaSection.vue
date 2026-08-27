<script setup lang="ts">
import type { NuxtError } from '#app'
import type { MovieSummary } from '~~/shared/types/media'

const { title, items, status, error } = defineProps<{
  title: string
  items: MovieSummary[]
  status: 'idle' | 'pending' | 'success' | 'error'
  error?: NuxtError
}>()
</script>

<template>
  <div
    v-if="status === 'pending'"
    class="media-skeleton-list"
  >
    <MediaCardSkeleton
      v-for="i in 8"
      :key="i"
    />
  </div>

  <p v-else-if="error">Не удалось загрузить фильмы</p>

  <section
    v-else
    class="media-section"
  >
    <h2>{{ title }}</h2>

    <MediaRail>
      <MediaCard
        v-for="movie in items"
        :id="movie.id"
        :key="movie.id"
        :title="movie.title"
        :poster-path="movie.posterPath"
        :vote-average="movie.voteAverage"
        :release-date="movie.releaseDate"
        media-type="movie"
      />
    </MediaRail>
  </section>
</template>

<style lang="scss" scoped>
.media-skeleton-list {
  display: flex;
  gap: 16px;
  overflow: hidden;
}
.media-section {
  padding-top: 30px;
}
</style>
