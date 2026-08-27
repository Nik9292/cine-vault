<script lang="ts" setup>
import type { MovieDetails } from '~~/shared/types/media'
import { getTmdbImageUrl } from '~/utils/getTmdbImageUrl'

const route = useRoute()
const routeType = route.params.type as 'movie' | 'tv'
const id = route.params.id as string

const { data } = await useLazyFetch<MovieDetails>(`/api/${routeType}/${id}`)

console.log(data.value?.backdropPath)

const backdropPath = computed(() => getTmdbImageUrl(data.value?.backdropPath ?? null, 'w1280'))
</script>

<template>
  <div class="media-details">
    <div
      class="backdrop"
      :style="{ backgroundImage: `url(${backdropPath})` }"
    />
    <div class="overlay" />
    <div class="container">
      <DetailHero
        v-if="data"
        :detail-info="data"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.media-details {
  position: relative;
  min-height: 500px;
  display: flex;
  align-items: flex-end;
  .backdrop {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center top;
  }
  .overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      #16213e 0%,
      rgba(22, 33, 62, 0.95) 20%,
      rgba(22, 33, 62, 0.7) 50%,
      rgba(22, 33, 62, 0.4) 100%
    );
  }
  .container {
    position: relative;
    z-index: 1;
    display: flex;
    gap: 32px;
    padding-top: 100px;
    padding-bottom: 40px;
  }
}
</style>
