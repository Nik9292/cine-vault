<script lang="ts" setup>
import type { MediaDetails } from '~~/shared/types/media'
import { getTmdbImageUrl } from '~/utils/getTmdbImageUrl'

definePageMeta({
  validate: route =>
    (route.params.type === 'movie' || route.params.type === 'tv')
    && typeof route.params.id === 'string'
    && /^[1-9]\d*$/.test(route.params.id),
})
const route = useRoute()
const { data, status, error, refresh } = await useLazyFetch<MediaDetails>(
  () => `/api/${route.params.type}/${route.params.id}`,
)
useSeoMeta({ title: () => (data.value ? `${data.value.title} — CineVault` : 'CineVault') })

const backdropPath = computed(() => getTmdbImageUrl(data.value?.backdropPath ?? null, 'w1280'))
</script>

<template>
  <div class="media-details">
    <div
      class="backdrop"
      :style="{ backgroundImage: backdropPath ? `url(${backdropPath})` : undefined }"
    />
    <div class="overlay" />
    <div class="container">
      <p v-if="status === 'pending'">Загрузка...</p>
      <div
        v-else-if="error"
        role="alert"
      >
        <p>
          {{
            error.statusCode === 404 ? 'Фильм или сериал не найден' : 'Не удалось загрузить данные'
          }}
        </p>
        <button
          type="button"
          @click="refresh()"
        >
          Попробовать снова
        </button>
      </div>
      <DetailHero
        v-else-if="data"
        :key="`${data.mediaType}-${data.id}`"
        :detail-info="data"
      />
      <p v-else>Нет данных</p>
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
