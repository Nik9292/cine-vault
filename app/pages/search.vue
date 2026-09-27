<script setup lang="ts">
const route = useRoute()
const query = computed(() => (typeof route.query.q === 'string' ? route.query.q.trim() : ''))
const page = computed(() => {
  const value = route.query.page ?? '1'
  return typeof value === 'string' && /^[1-9]\d*$/.test(value) ? Number(value) : 0
})
const validQuery = computed(() => query.value.length > 0 && query.value.length <= 100)
const validPage = computed(() => page.value >= 1 && page.value <= 500)
const input = ref(query.value)
watch(query, (value) => {
  input.value = value
})

// The reactive key keeps URL navigation, history and SSR on the same result set.
const { data, status, error, refresh } = await useAsyncData(
  () => `search:${query.value}:${page.value}`,
  async (_app, { signal }) => {
    if (!validQuery.value || !validPage.value)
      return { results: [], totalResults: 0, totalPages: 0, page: page.value }
    return $fetch('/api/search', { query: { query: query.value, page: page.value }, signal })
  },
)

function pageLocation(value: number) {
  return { path: '/search', query: { q: query.value, page: value } }
}
async function submitSearch() {
  await navigateTo({ path: '/search', query: { q: input.value.trim() } })
}
useSeoMeta({
  title: () => (query.value ? `Поиск: ${query.value} — CineVault` : 'Поиск — CineVault'),
})
</script>

<template>
  <div class="container search-page">
    <h1>Поиск фильмов и сериалов</h1>
    <form
      class="search-form"
      role="search"
      @submit.prevent="submitSearch"
    >
      <label for="page-search">Название фильма или сериала</label>
      <div class="search-form__controls">
        <input
          id="page-search"
          v-model="input"
          type="search"
          maxlength="100"
          placeholder="Что хотите посмотреть?"
        />
        <button type="submit">Найти</button>
      </div>
    </form>
    <p v-if="!query">Введите название фильма или сериала.</p>
    <p v-else-if="!validQuery">Запрос должен содержать не более 100 символов.</p>
    <p v-else-if="!validPage">
      Некорректный номер страницы. <NuxtLink :to="pageLocation(1)">К первой странице</NuxtLink>
    </p>
    <p
      v-else-if="status === 'pending'"
      role="status"
    >
      Поиск...
    </p>
    <div
      v-else-if="error"
      role="alert"
    >
      <p>Не удалось загрузить результаты.</p>
      <button
        type="button"
        @click="refresh()"
      >
        Попробовать снова
      </button>
    </div>
    <template v-else-if="data">
      <p>По запросу «{{ query }}» найдено: {{ data.totalResults }}</p>
      <MediaGrid
        v-if="data.results.length"
        :items="data.results"
      />
      <p v-else-if="page > 1">
        На этой странице нет результатов.
        <NuxtLink :to="pageLocation(1)">К первой странице</NuxtLink>
      </p>
      <p v-else>Ничего не найдено. Попробуйте другое название.</p>
      <nav
        v-if="data.totalPages > 1 && page <= data.totalPages"
        class="pagination"
        aria-label="Страницы поиска"
      >
        <NuxtLink
          v-if="page > 1"
          :to="pageLocation(page - 1)"
        >Назад</NuxtLink>
        <span aria-current="page">{{ page }} / {{ data.totalPages }}</span>
        <NuxtLink
          v-if="page < data.totalPages"
          :to="pageLocation(page + 1)"
        >Далее</NuxtLink>
      </nav>
    </template>
  </div>
</template>

<style scoped lang="scss">
.search-page {
  padding-block: 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  h1 {
    font-size: 28px;
  }
  a {
    color: var(--color-accent);
  }
  button {
    padding: 10px 18px;
    border: 0;
    border-radius: 8px;
    color: white;
    background: var(--color-accent);
    font: inherit;
    cursor: pointer;
  }
}
.search-form {
  display: grid;
  gap: 8px;
  max-width: 640px;
  &__controls {
    display: flex;
    gap: 12px;
  }
  input {
    flex: 1;
    min-width: 0;
    padding: 12px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-surface);
    color: var(--color-text);
    font: inherit;
  }
}
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}
</style>
