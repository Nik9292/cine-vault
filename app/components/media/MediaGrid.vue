<script setup lang="ts">
import type { MediaSummary } from '~~/shared/types/media'

const { items } = defineProps<{
  items: MediaSummary[]
}>()
</script>

<template>
  <div class="media-grid">
    <MediaCard
      v-for="item in items"
      :id="item.id"
      :key="`${item.mediaType}-${item.id}`"
      :title="item.title"
      :poster-path="item.posterPath"
      :vote-average="item.voteAverage"
      :vote-count="item.voteCount"
      :release-date="item.releaseDate"
      :media-type="item.mediaType"
    />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/media-grid' as grid;

.media-grid {
  @include grid.media-grid;
}
</style>
