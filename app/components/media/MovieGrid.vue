<script setup lang="ts">
import type { MovieSummary } from '~~/shared/types/media'

const { movies } = defineProps<{
  movies: MovieSummary[]
}>()
</script>

<template>
  <div class="movie-grid">
    <MediaCard
      v-for="movie in movies"
      :id="movie.id"
      :key="movie.id"
      :title="movie.title"
      :poster-path="movie.posterPath"
      :vote-average="movie.voteAverage"
      :release-date="movie.releaseDate"
      media-type="movie"
    />
  </div>
</template>

<style scoped lang="scss">
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 180px);
  justify-content: space-between;
  gap: 16px;
}
</style>
