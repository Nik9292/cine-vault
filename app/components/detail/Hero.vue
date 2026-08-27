<script lang="ts" setup>
import type { MovieDetails, Tab } from '~~/shared/types/media'
import { getTmdbImageUrl } from '~/utils/getTmdbImageUrl.ts'
import ToggleButton from '~/components/ui/ToggleButton.vue'
import MediaRating from '~/components/media/MediaRating.vue'
import CastCard from '~/components/media/CastCard.vue'
import MovieGrid from '~/components/media/MovieGrid.vue'

const { detailInfo } = defineProps<{
  detailInfo: MovieDetails
}>()

const posterPath = computed(() => getTmdbImageUrl(detailInfo.posterPath ?? null, 'w500'))
const year = computed(() => detailInfo.releaseDate?.split('-')[0])
const countries = computed(() =>
  detailInfo.productionCountries?.map(country => country.name).join(', '),
)
const runtime = computed(
  () => `${Math.floor(detailInfo.runtime / 60)}ч ${detailInfo.runtime % 60}мин`,
)
const cast = computed(() => detailInfo.credits?.cast?.slice(0, 20) ?? [])
const voteAverage = computed(() => detailInfo.voteAverage.toFixed(1))

// Ratings
const isLiked = ref(false)
const isFavorite = ref(false)
const isWatched = ref(false)
const userRating = ref<number | null>(null)

const handleRate = (rating: number) => {
  userRating.value = rating
}

// Tabs
const activeTab = ref<Tab['key']>('cast')
const trailerVisible = ref(false)

const tabs: Tab[] = [
  { key: 'trailer', label: 'Трейлер' },
  { key: 'cast', label: 'Актёры' },
  { key: 'similar', label: 'Похожие' },
]
function setActiveTab(key: Tab['key']): void {
  if (key === 'trailer') {
    trailerVisible.value = true
    return
  }

  activeTab.value = key
}

const similar = computed(() => detailInfo.similar?.results ?? [])
</script>

<template>
  <div class="hero">
    <div class="content">
      <img
        v-if="posterPath"
        :src="posterPath"
        alt="Poster"
        class="hero__poster"
      />

      <div class="hero__info">
        <h1 class="title">{{ detailInfo.title }}</h1>
        <p class="original-title">{{ detailInfo.originalTitle }}</p>
        <div class="rating-row">
          <div class="tmdb-rating">
            <Icon
              name="lucide:star"
              size="20"
              class="tmdb-rating__icon"
            />
            <span class="rating-value">{{ voteAverage }}</span>
            <span class="rating-label">TMDB</span>
          </div>
        </div>
        <div class="meta">
          <span v-if="year">{{ year }}</span>
          <span v-if="countries">{{ countries }}</span>
          <span v-if="runtime">{{ runtime }}</span>
        </div>
        <div class="genres">
          <button
            v-for="genre in detailInfo.genres"
            :key="genre.id"
            class="genre-chip"
          >
            {{ genre.name }}
          </button>
        </div>
        <p
          v-if="detailInfo.overview"
          class="overview"
        >
          {{ detailInfo.overview }}
        </p>

        <div class="actions-row">
          <ToggleButton
            v-model="isLiked"
            title="Нравится"
            icon-name="heart"
            size="16"
          />

          <ToggleButton
            v-model="isFavorite"
            title="В избранное"
            icon-name="bookmark"
            size="16"
          />

          <ToggleButton
            v-model="isWatched"
            title="Просмотрено"
            icon-name="eye"
            size="16"
          />
        </div>

        <div class="stars-row">
          <span class="stars-label">Оценить:</span>

          <MediaRating
            :user-rating="userRating"
            @handle-rate="handleRate"
          />
        </div>
      </div>
    </div>

    <div class="bottom-content">
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab', { 'tab--active': activeTab === tab.key }]"
          @click="setActiveTab(tab.key)"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="tabContent">
        <MediaRail
          v-if="activeTab === 'cast'"
          :item-width="130"
          :gap="8"
        >
          <CastCard
            v-for="castMember in cast"
            :key="castMember.id"
            :cast-member="castMember"
          />
        </MediaRail>

        <MovieGrid
          v-else-if="activeTab === 'similar'"
          :similar="similar.slice(0, 12)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hero {
  width: 100%;
  .content {
    display: flex;
    gap: 20px;
  }
  &__poster {
    width: 300px;
    border-radius: 20px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    flex-shrink: 0;
  }
  &__info {
    .title {
      font-size: 35px;
      font-weight: 800;
      color: #eaeaea;
      margin: 0 0 4px;
      line-height: 1.2;
    }
    .original-title {
      font-size: 1rem;
      color: #6b7280;
      margin: 0 0 12px;
      font-style: italic;
    }
    .rating-row {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 12px;
      .tmdb-rating {
        display: flex;
        align-items: center;
        gap: 6px;
        &__icon {
          color: #ffc107;

          :deep(path) {
            fill: #ffc107;
          }
        }
      }
      .rating-value {
        font-size: 1.25rem;
        font-weight: 700;
        color: #eaeaea;
      }
      .rating-label {
        font-size: 0.75rem;
        color: #6b7280;
        text-transform: uppercase;
      }
    }
    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
      font-size: 12px;
      color: #9ca3af;

      span {
        &::after {
          content: '·';
          margin-left: 8px;
          color: #6b7280;
        }
        &:last-child::after {
          content: '';
        }
      }
    }
    .genres {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
      .genre-chip {
        background: none;
        cursor: pointer;
        font-family: inherit;
        padding: 4px 14px;
        border-radius: 20px;
        font-size: 14px;
        color: #eaeaea;
        background: rgba(15, 52, 96, 0.3);
        border: 1px solid rgba(15, 52, 96, 0.5);
        transition: all 0.15s ease;

        &:hover {
          background: rgba(233, 69, 96, 0.2);
          border-color: #e94560;
          color: #e94560;
        }
      }
    }
    .overview {
      font-size: 14px;
      color: #9ca3af;
      line-height: 1.4;
      margin: 0 0 20px;
      max-width: 700px;
    }
    .actions-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 16px;
    }

    .stars-row {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .stars-label {
      color: #6b7280;
      font-size: 14px;
    }
  }
  .bottom-content {
    padding: 32px 24px 48px;
  }

  .tabs {
    display: flex;
    gap: 4px;
    margin-bottom: 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    overflow-x: auto;
  }

  .tab {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
    padding: 12px 20px;
    font-size: 16px;
    font-weight: 600;
    color: #6b7280;
    border-bottom: 2px solid transparent;
    transition: all 0.15s ease;
    white-space: nowrap;

    &:hover {
      color: #eaeaea;
    }
    &.tab--active {
      color: #e94560;
      border-bottom-color: #e94560;
    }
  }

  .tabContent {
    min-height: 200px;
  }
}
</style>
