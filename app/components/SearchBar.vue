<script setup lang="ts">
import type { MovieSummary, PaginatedResponse } from '#shared/types/media.ts'
import { getTmdbImageUrl } from '~/utils/getTmdbImageUrl'

const searchQuery = ref('')
const suggestions = ref<MovieSummary[]>([])
const showSuggestions = ref(false)
const searchRoot = ref<HTMLElement | null>(null)
const searchError = ref<string | null>(null)

async function searchMovies(query: string) {
  try {
    const { results } = await $fetch<PaginatedResponse<MovieSummary>>('/api/search', {
      method: 'GET',
      query: {
        query,
      },
    })

    suggestions.value = results
    showSuggestions.value = true
    searchError.value = null
  }
  catch (error) {
    console.error('Error searching movies:', error)
    suggestions.value = []
    searchError.value = 'Не удалось выполнить поиск'
    showSuggestions.value = true
  }
}

watch(searchQuery, (newValue, _oldValue, onCleanup) => {
  const normalizedValue = newValue.trim()

  if (!normalizedValue) {
    suggestions.value = []
    showSuggestions.value = false
    searchError.value = null
    return
  }

  const debounceId = setTimeout(() => {
    searchMovies(normalizedValue)
  }, 400)

  onCleanup(() => {
    clearTimeout(debounceId)
  })
})

function handleClickOutside(event: PointerEvent) {
  const root = searchRoot.value
  const target = event.target

  if (!root || !(target instanceof Node)) return

  if (!root.contains(target)) {
    showSuggestions.value = false
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', handleClickOutside)
})

function openDropdown() {
  if (!suggestions.value.length) return

  showSuggestions.value = true
}
</script>

<template>
  <div
    ref="searchRoot"
    class="wrapper"
  >
    <form
      class="wrapper__search"
      role="search"
      @submit.prevent
    >
      <Icon
        class="wrapper__search-icon"
        name="lucide:search"
        size="18"
      />

      <label
        class="wrapper__search-label"
        for="header-search"
      >
        Поиск фильмов
      </label>

      <input
        id="header-search"
        v-model="searchQuery"
        class="wrapper__search-input"
        type="search"
        name="query"
        placeholder="Найти фильм..."
        autocomplete="off"
        maxlength="100"
        @focus="openDropdown"
      />

      <button
        v-if="searchQuery"
        class="wrapper__search-clear"
        type="button"
        aria-label="Очистить поиск"
        title="Очистить"
        @click="searchQuery = ''"
      >
        <Icon
          name="lucide:x"
          size="17"
        />
      </button>
    </form>

    <Transition name="fade">
      <div
        v-if="showSuggestions && searchError"
        class="dropdown no-results"
      >
        <p>{{ searchError }}</p>
      </div>

      <div
        v-else-if="showSuggestions && suggestions.length > 0"
        class="dropdown"
      >
        <NuxtLink
          v-for="item in suggestions.slice(0, 5)"
          :key="item.id"
          class="suggestion"
          :to="`/media/movie/${item.id}`"
        >
          <img
            class="poster"
            :src="getTmdbImageUrl(item.posterPath) ?? undefined"
            :alt="item.title"
          />
          <div class="info">
            <span class="title">{{ item.title }}</span>
            <span class="meta">
              <span class="type">Фильм</span>
              <span v-if="item.releaseDate">{{ item.releaseDate.split('-')[0] }}</span>
            </span>
          </div>
        </NuxtLink>
        <button
          v-if="suggestions.length > 5"
          class="showAll"
        >
          Показать все результаты
        </button>
      </div>

      <div
        v-else-if="showSuggestions"
        class="dropdown no-results"
      >
        <p>По вашему запросу ничего не найдено</p>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  position: relative;
  width: min(320px, 30vw);
  &__search {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    &-label {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      overflow: hidden;
      white-space: nowrap;
      border: 0;
      clip-path: inset(50%);
    }

    &-icon {
      position: absolute;
      left: 13px;
      color: #8f8fa3;
      pointer-events: none;
    }

    &-input {
      width: 100%;
      height: 40px;
      padding: 0 40px;
      color: #f5f5f5;
      font: inherit;
      font-size: 14px;
      background: rgb(255 255 255 / 8%);
      border: 1px solid rgb(255 255 255 / 10%);
      border-radius: 20px;
      outline: none;
      transition:
        background 200ms ease,
        border-color 200ms ease,
        box-shadow 200ms ease;

      &::placeholder {
        color: #8f8fa3;
      }

      &:hover {
        background: rgb(255 255 255 / 10%);
        border-color: rgb(255 255 255 / 16%);
      }

      &:focus {
        background: rgb(255 255 255 / 10%);
        border-color: #e94560;
        box-shadow: 0 0 0 3px rgb(233 69 96 / 16%);
      }

      &::-webkit-search-cancel-button {
        display: none;
      }
    }
    &-clear {
      position: absolute;
      right: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      padding: 0;
      color: #8f8fa3;
      background: transparent;
      border: 0;
      border-radius: 50%;
      cursor: pointer;

      &:hover {
        color: #f5f5f5;
        background: rgb(255 255 255 / 8%);
      }

      &:focus-visible {
        outline: 2px solid #e94560;
        outline-offset: 1px;
      }
    }
  }
  .dropdown {
    position: absolute;
    z-index: 110;
    top: calc(100% + 10px);
    right: 0;
    left: 0;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    max-height: 430px;
    color: #f5f5f5;
    background: rgb(24 24 38 / 98%);
    border: 1px solid rgb(255 255 255 / 12%);
    border-radius: 12px;
    box-shadow: 0 16px 40px rgb(0 0 0 / 40%);
    backdrop-filter: blur(14px);
    &.no-results {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      padding: 12px;
      color: #8f8fa3;
      font-size: 14px;
      text-align: center;
    }
    .suggestion {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 10px 12px;
      color: inherit;
      font: inherit;
      text-align: left;
      background: transparent;
      border: 0;
      border-bottom: 1px solid rgb(255 255 255 / 8%);
      cursor: pointer;
      transition: background 150ms ease;

      &:hover,
      &:focus-visible {
        background: rgb(255 255 255 / 7%);
      }

      &:focus-visible {
        outline: 2px solid #e94560;
        outline-offset: -2px;
      }
      .poster {
        flex-shrink: 0;
        width: 40px;
        height: 60px;
        object-fit: cover;
        background: rgb(255 255 255 / 6%);
        border-radius: 5px;
      }

      .info {
        display: flex;
        flex-direction: column;
        gap: 5px;
        min-width: 0;
        .title {
          overflow: hidden;
          color: #f5f5f5;
          font-size: 14px;
          font-weight: 600;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .meta {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #8f8fa3;
          font-size: 12px;
          .type {
            color: #e94560;
          }
        }
      }
    }
    .showAll {
      width: 100%;
      padding: 13px 12px;
      color: #e94560;
      font: inherit;
      font-size: 13px;
      font-weight: 700;
      text-align: center;
      background: transparent;
      border: 0;
      cursor: pointer;
      transition:
        color 150ms ease,
        background 150ms ease;

      &:hover,
      &:focus-visible {
        color: #ff657d;
        background: rgb(233 69 96 / 10%);
      }

      &:focus-visible {
        outline: 2px solid #e94560;
        outline-offset: -2px;
      }
    }
  }
  .fade-enter-active,
  .fade-leave-active {
    transition:
      opacity 180ms ease,
      transform 180ms ease;
    transform-origin: top;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(-6px) scale(0.98);
  }
  @media (width <= 768px) {
    width: min(220px, 42vw);
  }
}
</style>
