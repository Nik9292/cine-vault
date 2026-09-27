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
      :release-date="item.releaseDate"
      :media-type="item.mediaType"
    />
  </div>
</template>

<style scoped lang="scss">
.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 180px);
  justify-content: space-between;
  gap: 16px;
}
</style>
