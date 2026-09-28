<script setup lang="ts">
import type { CatalogFilters, CatalogType } from '~~/shared/utils/catalog'
import { catalogSortOptions, parseCatalogQuery, ratingMinVotes } from '~~/shared/utils/catalog'

const props = defineProps<{
  filters: CatalogFilters
  mediaType: CatalogType
  genres: { id: number, name: string }[]
  genresPending: boolean
  countries: { code: string, name: string }[]
  countriesPending: boolean
}>()
const emit = defineEmits<{ apply: [filters: CatalogFilters], reset: [] }>()
const draft = ref({ ...props.filters })
const formError = ref('')
watch(
  () => props.filters,
  (filters) => {
    draft.value = { ...filters }
    formError.value = ''
  },
  { deep: true },
)
watch(
  () => draft.value.sort,
  (sort) => {
    if (sort === 'rating' && !draft.value.votesFrom) draft.value.votesFrom = ratingMinVotes
  },
)
function apply() {
  try {
    const filters = parseCatalogQuery({ ...draft.value, page: '1' })
    formError.value = ''
    emit('apply', filters)
  }
  catch (error) {
    formError.value = error instanceof Error ? error.message : 'Проверьте фильтры'
  }
}
</script>

<template>
  <form
    class="filters"
    @submit.prevent="apply"
  >
    <div class="filters__fields">
      <label>
        Жанр
        <select
          v-model="draft.genre"
          :disabled="genresPending"
        >
          <option value="">Все жанры</option>
          <option
            v-if="draft.genre && !genres.some(genre => String(genre.id) === draft.genre)"
            :value="draft.genre"
          >
            Жанр {{ draft.genre }}
          </option>
          <option
            v-for="genre in genres"
            :key="genre.id"
            :value="String(genre.id)"
          >
            {{ genre.name }}
          </option>
        </select>
      </label>
      <label>
        Страна производства
        <select
          v-model="draft.country"
          :disabled="countriesPending"
        >
          <option value="">Все страны</option>
          <option
            v-if="draft.country && !countries.some(country => country.code === draft.country)"
            :value="draft.country"
          >
            {{ draft.country }}
          </option>
          <option
            v-for="country in countries"
            :key="country.code"
            :value="country.code"
          >
            {{ country.name }}
          </option>
        </select>
      </label>
      <fieldset>
        <legend>{{ mediaType === 'tv' ? 'Год начала сериала' : 'Год выхода' }}</legend>
        <div class="filters__years">
          <input
            v-model="draft.yearFrom"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="4"
            aria-label="Год от"
            placeholder="От"
          />
          <span>—</span>
          <input
            v-model="draft.yearTo"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="4"
            aria-label="Год до"
            placeholder="До"
          />
        </div>
      </fieldset>
      <label>
        Рейтинг от
        <select v-model="draft.ratingFrom">
          <option value="">Любой</option>
          <option
            v-if="draft.ratingFrom && !['5', '6', '7', '8', '9'].includes(draft.ratingFrom)"
            :value="draft.ratingFrom"
          >
            {{ draft.ratingFrom }}
          </option>
          <option
            v-for="rating in [5, 6, 7, 8, 9]"
            :key="rating"
            :value="String(rating)"
          >
            {{ rating }}
          </option>
        </select>
      </label>
      <label>
        Оценок не меньше
        <select v-model="draft.votesFrom">
          <option value="">
            {{ draft.sort === 'rating' ? `По умолчанию: ${ratingMinVotes}` : 'Без ограничения' }}
          </option>
          <option value="0">Без ограничения (включая единичные оценки)</option>
          <option
            v-if="draft.votesFrom && !['0', '50', '100', '500', '1000'].includes(draft.votesFrom)"
            :value="draft.votesFrom"
          >
            {{ draft.votesFrom }}
          </option>
          <option
            v-for="votes in [50, 100, 500, 1000]"
            :key="votes"
            :value="String(votes)"
          >
            {{ votes }}
          </option>
        </select>
      </label>
      <label>
        Сортировка
        <select v-model="draft.sort">
          <option
            v-for="option in catalogSortOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </label>
    </div>
    <p
      v-if="draft.sort === 'rating'"
      class="filters__hint"
    >
      Сначала высокий средний балл TMDB. По умолчанию — от {{ ratingMinVotes }} оценок, чтобы
      единичные десятки не занимали весь список. Порог можно изменить.
    </p>
    <p
      v-if="formError"
      role="alert"
    >
      {{ formError }}
    </p>
    <div class="filters__actions">
      <button type="submit">Применить</button>
      <button
        class="filters__reset"
        type="button"
        @click="emit('reset')"
      >
        Сбросить фильтры
      </button>
    </div>
  </form>
</template>

<style scoped lang="scss">
.filters {
  padding: 24px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  display: grid;
  gap: 20px;
  &__fields {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(175px, 1fr));
    gap: 16px;
  }
  label {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 14px;
  }
  fieldset {
    padding: 0;
    margin: 0;
    border: 0;
    min-width: 0;
  }
  legend {
    font-size: 14px;
    margin-bottom: 8px;
  }
  &__years {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  select,
  input {
    width: 100%;
    min-width: 0;
    height: 42px;
    padding: 8px;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background: var(--color-background);
    color: var(--color-text);
    font: inherit;
  }
  &__hint {
    color: var(--color-text-muted);
    font-size: 14px;
    line-height: 1.5;
  }
  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  button {
    padding: 10px 18px;
    border-radius: 8px;
    border: 1px solid transparent;
    background: var(--color-accent);
    color: white;
    cursor: pointer;
    font: inherit;
  }
  button.filters__reset {
    background: transparent;
    border-color: var(--color-border);
  }
  :is(button, input, select):focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 3px;
  }
}
</style>
