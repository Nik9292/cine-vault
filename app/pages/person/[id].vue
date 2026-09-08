<script setup lang="ts">
import type { PersonDetails } from '~~/shared/types/person'
import { getTmdbImageUrl } from '~/utils/getTmdbImageUrl.ts'
import SocialLinks from '~/components/person/SocialLinks.vue'
import MovieGrid from '~/components/media/MovieGrid.vue'

const route = useRoute()

const {
  data: person,
  status,
  error,
} = await useFetch<PersonDetails>(() => `/api/person/${route.params.id}`)

const profilePath = computed(() => getTmdbImageUrl(person.value?.profilePath ?? null, 'w500'))
const externalIds = computed(() => person.value?.externalIds ?? null)

type CareerTabKey = 'acting' | 'producer' | 'director' | 'writing'

interface CareerTab {
  key: CareerTabKey
  label: string
  count: number
}

const activeTab = ref<CareerTabKey>('acting')

const actingCredits = computed(() =>
  (person.value?.combinedCredits.cast ?? [])
    .filter(credit => credit.posterPath)
    .toSorted((a, b) => b.releaseDate.localeCompare(a.releaseDate)),
)

const producerCredits = computed(() =>
  (person.value?.combinedCredits.crew ?? [])
    .filter(credit => credit.posterPath && credit.job.includes('Producer'))
    .toSorted((a, b) => b.releaseDate.localeCompare(a.releaseDate)),
)

const directorCredits = computed(() =>
  (person.value?.combinedCredits.crew ?? [])
    .filter(credit => credit.posterPath && credit.job === 'Director')
    .toSorted((a, b) => b.releaseDate.localeCompare(a.releaseDate)),
)

const writingCredits = computed(() =>
  (person.value?.combinedCredits.crew ?? [])
    .filter(credit => credit.posterPath && credit.department === 'Writing')
    .toSorted((a, b) => b.releaseDate.localeCompare(a.releaseDate)),
)

const tabs = computed<CareerTab[]>(
  () =>
    [
      {
        key: 'acting',
        label: 'Актёр',
        count: actingCredits.value.length,
      },
      {
        key: 'producer',
        label: 'Продюсер',
        count: producerCredits.value.length,
      },
      {
        key: 'director',
        label: 'Режиссёр',
        count: directorCredits.value.length,
      },
      {
        key: 'writing',
        label: 'Сценарист',
        count: writingCredits.value.length,
      },
    ].filter(tab => tab.count > 0) as CareerTab[],
)

const activeCredits = computed(() => {
  const credits = {
    acting: actingCredits.value,
    producer: producerCredits.value,
    director: directorCredits.value,
    writing: writingCredits.value,
  }

  return credits[activeTab.value]
})

function setActiveTab(key: CareerTabKey): void {
  activeTab.value = key
}
</script>

<template>
  <div class="person">
    <div class="container">
      <p v-if="status === 'pending'">Загрузка...</p>

      <p v-else-if="error">Не удалось загрузить данные актёра</p>
      <div
        v-else-if="person"
        class="content"
      >
        <div class="content__top">
          <img
            v-if="profilePath"
            :src="profilePath"
            :alt="person.name"
            class="person__photo"
          />

          <div class="person__info">
            <h1 class="name">{{ person.name }}</h1>

            <div class="meta">
              <span v-if="person.birthday"> Родился: {{ person.birthday }} </span>
              <span v-if="person.placeOfBirth">
                {{ person.placeOfBirth }}
              </span>
              <span v-if="person.deathday"> Умер: {{ person.deathday }} </span>
            </div>

            <div
              v-if="person.biography"
              class="bio"
            >
              <h3 class="bio-title">Биография</h3>
              <p>{{ person.biography }}</p>
            </div>

            <SocialLinks
              v-if="externalIds"
              :external-ids="externalIds"
            />
          </div>
        </div>

        <section
          v-if="tabs.length"
          class="career"
        >
          <h2 class="section-title">Карьера</h2>

          <div class="tabs">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              class="tab"
              :class="{ 'tab--active': activeTab === tab.key }"
              type="button"
              @click="setActiveTab(tab.key)"
            >
              {{ tab.label }}
              <span class="tab__count">
                {{ tab.count }}
              </span>
            </button>
          </div>

          <div class="tab-content">
            <MovieGrid :similar="activeCredits" />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.person {
  .content {
    padding-top: 40px;
    padding-bottom: 48px;
    display: flex;
    flex-direction: column;
    gap: 40px;
    &__top {
      display: flex;
      flex-direction: row;
      gap: 20px;
    }
    &__bottom {
      display: flex;
      gap: 20px;
    }
  }
  &__photo {
    width: 300px;
    border-radius: 20px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    flex-shrink: 0;
  }
  &__info {
    display: flex;
    flex-direction: column;
    gap: 16px;
    .meta {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .bio {
      .bio-title {
        font-size: 32px;
        font-weight: 600;
        margin-bottom: 8px;
      }
    }
  }
  .filmography {
    margin-top: 16px;
    .sectionTitle {
      font-size: 20px;
      font-weight: 700;
      color: #eaeaea;
      margin: 0 0 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .filmCount {
      padding: 2px 10px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      color: #6b7280;
    }
  }
  .section-title {
    margin-bottom: 20px;
    color: var(--color-text);
    font-size: 24px;
    font-weight: 700;
  }

  .tabs {
    display: flex;
    gap: 4px;
    overflow-x: auto;
    margin-bottom: 24px;
    border-bottom: 1px solid rgb(255 255 255 / 8%);
  }

  .tab {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    color: var(--color-text-muted);
    font-family: inherit;
    font-size: 16px;
    font-weight: 600;
    white-space: nowrap;
    background: none;
    border: 0;
    border-bottom: 2px solid transparent;
    cursor: pointer;

    &:hover {
      color: var(--color-text);
    }

    &--active {
      color: var(--color-accent);
      border-bottom-color: var(--color-accent);
    }

    &__count {
      padding: 2px 8px;
      font-size: 12px;
      background: rgb(255 255 255 / 8%);
      border-radius: 10px;
    }
  }
}
</style>
