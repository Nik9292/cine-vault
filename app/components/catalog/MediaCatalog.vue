<script setup lang="ts">
import type { MediaSummary, PaginatedResponse } from '~~/shared/types/media'
import type { CatalogType, CatalogFilters } from '~~/shared/utils/catalog'
import { parseCatalogQuery, catalogLocationQuery } from '~~/shared/utils/catalog'
import Pagination from '~/components/ui/Pagination.vue'
import CatalogFiltersForm from './CatalogFilters.vue'

const props = defineProps<{ mediaType: CatalogType }>()
const route = useRoute()
const parsed = computed(() => {
  try {
    return { filters: parseCatalogQuery(route.query), error: '' }
  }
  catch (error) {
    return {
      filters: parseCatalogQuery({}),
      error: error instanceof Error ? error.message : 'Некорректные фильтры',
    }
  }
})
const filters = computed(() => parsed.value.filters)
const page = computed(() => filters.value.page)
const title = computed(() => (props.mediaType === 'movie' ? 'Фильмы' : 'Сериалы'))
const resultsRoot = ref<HTMLElement | null>(null)
const {
  data: genres,
  status: genresStatus,
  error: genresError,
  refresh: refreshGenres,
} = await useFetch(() => `/api/genres/${props.mediaType}`)
const {
  data: countries,
  status: countriesStatus,
  error: countriesError,
  refresh: refreshCountries,
} = await useFetch('/api/countries')
const { data, status, error, refresh } = await useAsyncData(
  () => `catalog:${props.mediaType}:${JSON.stringify(route.query)}`,
  async (_app, { signal }) => {
    if (parsed.value.error) return { page: 1, results: [], totalPages: 0, totalResults: 0 }
    return $fetch<PaginatedResponse<MediaSummary>>(`/api/catalog/${props.mediaType}`, {
      query: catalogLocationQuery(filters.value),
      signal,
    })
  },
)
useResultsScroll(page, status, resultsRoot)
useSeoMeta({ title: () => `${title.value} — CineVault` })
function pageLocation(value: number) {
  return {
    path: route.path,
    query: { ...catalogLocationQuery(filters.value), page: String(value) },
  }
}
async function apply(next: CatalogFilters) {
  await navigateTo({ path: route.path, query: catalogLocationQuery({ ...next, page: 1 }) })
}
async function reset() {
  await navigateTo({ path: route.path })
  formKey.value++
}
const formKey = ref(0)
</script>

<template>
  <div class="container catalog">
    <header>
      <h1>{{ title }}</h1>
      <p>Выберите жанр, страну, годы и рейтинг — найдите, что посмотреть.</p>
    </header>
    <CatalogFiltersForm
      :key="formKey"
      :filters="filters"
      :media-type="mediaType"
      :genres="genres?.genres ?? []"
      :genres-pending="genresStatus === 'pending'"
      :countries="countries ?? []"
      :countries-pending="countriesStatus === 'pending'"
      @apply="apply"
      @reset="reset"
    />
    <div
      v-if="genresError"
      role="alert"
    >
      Не удалось загрузить жанры.
      <button
        type="button"
        @click="refreshGenres()"
      >
        Повторить
      </button>
    </div>
    <div
      v-if="countriesError"
      role="alert"
    >
      Не удалось загрузить страны.
      <button
        type="button"
        @click="refreshCountries()"
      >
        Повторить
      </button>
    </div>
    <section
      ref="resultsRoot"
      class="catalog__results"
      aria-label="Результаты каталога"
      :aria-busy="status === 'pending'"
    >
      <div
        v-if="parsed.error"
        role="alert"
      >
        <p>{{ parsed.error }}</p>
        <button
          type="button"
          @click="reset"
        >
          Сбросить фильтры
        </button>
      </div>
      <template v-else-if="status === 'pending'">
        <p role="status">Загрузка...</p>
        <div class="catalog__skeletons">
          <MediaCardSkeleton
            v-for="item in 20"
            :key="item"
          />
        </div>
      </template>
      <div
        v-else-if="error"
        role="alert"
      >
        <p>Не удалось загрузить каталог.</p>
        <button
          type="button"
          @click="refresh()"
        >
          Попробовать снова
        </button>
      </div>
      <template v-else-if="data">
        <p>Найдено: {{ data.totalResults }}</p>
        <p
          v-if="filters.sort === 'rating'"
          class="catalog__explanation"
        >
          По среднему рейтингу TMDB ·
          {{
            Number(filters.votesFrom) > 0
              ? `Оценок не меньше: ${filters.votesFrom}`
              : 'Количество оценок не ограничено'
          }}
        </p>
        <MediaGrid
          v-if="data.results.length"
          :items="data.results"
        />
        <div v-else-if="page > 1">
          <p>На этой странице нет результатов.</p>
          <NuxtLink :to="pageLocation(Math.max(1, data.totalPages))">{{
            data.totalPages > 0 ? 'К последней доступной странице' : 'К первой странице'
          }}</NuxtLink>
        </div>
        <div v-else>
          <p>По выбранным фильтрам ничего не найдено.</p>
          <button
            type="button"
            @click="reset"
          >
            Сбросить фильтры
          </button>
        </div>
        <Pagination
          v-if="page <= data.totalPages"
          :page="page"
          :total-pages="data.totalPages"
          :to="pageLocation"
        />
      </template>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/styles/media-grid' as grid;

.catalog {
  padding-block: 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  h1 {
    font-size: 32px;
    margin-bottom: 12px;
  }
  header p {
    color: var(--color-text-muted);
  }
  &__explanation {
    color: var(--color-text-muted);
    font-size: 14px;
  }
  &__results {
    display: flex;
    flex-direction: column;
    gap: 24px;
    scroll-margin-top: 100px;
  }
  &__skeletons {
    @include grid.media-grid;
  }
  button {
    cursor: pointer;
    font: inherit;
    color: var(--color-text);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 10px 16px;
  }
}
</style>
