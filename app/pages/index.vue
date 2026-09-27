<script setup lang="ts">
const {
  data: popularData,
  status: popularStatus,
  error: popularError,
} = await useLazyFetch('/api/movies/popular')

const {
  data: nowPlayingData,
  status: nowPlayingStatus,
  error: nowPlayingError,
} = await useLazyFetch('/api/movies/now-playing')

const {
  data: popularTvData,
  status: popularTvStatus,
  error: popularTvError,
} = await useLazyFetch('/api/tv/popular')
const popularSeries = computed(() => popularTvData.value?.results ?? [])

const popularMovies = computed(() => popularData.value?.results ?? [])

const nowPlayingMovies = computed(() => nowPlayingData.value?.results ?? [])

const heroItems = computed(() =>
  popularMovies.value.filter(movie => movie.backdropPath && movie.overview).slice(0, 5),
)
</script>

<template>
  <div class="home">
    <HeroSlider :items="heroItems" />

    <div class="container">
      <MediaSection
        title="Популярные фильмы"
        :items="popularMovies"
        :status="popularStatus"
        :error="popularError"
      />

      <MediaSection
        title="Сейчас в кино"
        :items="nowPlayingMovies"
        :status="nowPlayingStatus"
        :error="nowPlayingError"
      />
      <MediaSection
        title="Популярные сериалы"
        :items="popularSeries"
        :status="popularTvStatus"
        :error="popularTvError"
      />
    </div>
  </div>
</template>
