<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { paginationItems } from '~~/shared/utils/pagination'

const props = defineProps<{
  page: number
  totalPages: number
  to: (page: number) => RouteLocationRaw
}>()
const variants = computed(() => [
  { name: 'desktop', items: paginationItems(props.page, props.totalPages, 2) },
  { name: 'mobile', items: paginationItems(props.page, props.totalPages, 1) },
])
</script>

<template>
  <nav
    v-if="totalPages > 1"
    class="pagination"
    aria-label="Переход по страницам"
  >
    <NuxtLink
      v-if="page > 1"
      :to="to(page - 1)"
      class="pagination__control"
      aria-label="Предыдущая страница"
    >‹</NuxtLink>
    <span
      v-else
      class="pagination__control pagination__disabled"
      aria-disabled="true"
      aria-label="Предыдущая страница"
    >‹</span>
    <div
      v-for="variant in variants"
      :key="variant.name"
      :class="['pagination__pages', `pagination__pages--${variant.name}`]"
    >
      <template
        v-for="item in variant.items"
        :key="item"
      >
        <span
          v-if="typeof item === 'string'"
          class="pagination__gap"
          aria-hidden="true"
        >…</span>
        <span
          v-else-if="item === page"
          class="pagination__current"
          aria-current="page"
          :aria-label="`Страница ${item}, текущая`"
        >{{ item }}</span>
        <NuxtLink
          v-else
          :to="to(item)"
          :aria-label="
            item === totalPages
              ? `Последняя страница, ${item}`
              : item === 1
                ? 'Первая страница'
                : `Страница ${item}`
          "
        >{{ item }}</NuxtLink>
      </template>
    </div>
    <NuxtLink
      v-if="page < totalPages"
      :to="to(page + 1)"
      class="pagination__control"
      aria-label="Следующая страница"
    >›</NuxtLink>
    <span
      v-else
      class="pagination__control pagination__disabled"
      aria-disabled="true"
      aria-label="Следующая страница"
    >›</span>
  </nav>
</template>

<style scoped lang="scss">
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  &__pages {
    display: flex;
    gap: 6px;
    align-items: center;
  }
  &__pages--mobile {
    display: none;
  }
  a,
  &__current,
  &__control,
  &__gap {
    display: inline-flex;
    min-width: 40px;
    height: 40px;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    padding-inline: 8px;
  }
  a {
    color: var(--color-text);
    background: var(--color-surface);
    text-decoration: none;
  }
  a:hover {
    background: #34344f;
  }
  a:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
  &__current {
    background: var(--color-accent);
    color: white;
    font-weight: 700;
  }
  &__disabled {
    opacity: 0.35;
  }
  &__gap {
    min-width: 16px;
    padding: 0;
  }
}
@media (width <= 600px) {
  .pagination {
    gap: 3px;
    &__pages {
      gap: 3px;
    }
    &__pages--desktop {
      display: none;
    }
    &__pages--mobile {
      display: flex;
    }
    a,
    &__current,
    &__control {
      min-width: 30px;
      padding-inline: 5px;
    }
    &__gap {
      min-width: 12px;
    }
  }
}
</style>
