<script setup lang="ts">
import type { CastMember } from '~~/shared/types/media.ts'
import { getTmdbImageUrl } from '~/utils/getTmdbImageUrl'

const { castMember } = defineProps<{ castMember: CastMember }>()

// function goToPerson(id: number) {
//   router.push(`/person/${id}`)
// }
</script>

<template>
  <div class="card">
    <img
      v-if="castMember.profilePath"
      :src="getTmdbImageUrl(castMember.profilePath) ?? undefined"
      :alt="`Profile photo ${castMember.name}`"
      class="photo"
    />

    <Icon
      v-else
      name="lucide:user"
      size="100"
      class="photo"
    />

    <div class="name">{{ castMember.name }}</div>
    <div class="character">{{ castMember.character }}</div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  flex-shrink: 0;
  width: 130px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.15s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  .photo {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 8px;
    background: rgba(255, 255, 255, 0.05);
  }
  .name {
    font-size: 16px;
    font-weight: 600;
    color: #eaeaea;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .character {
    font-size: 14px;
    color: #6b7280;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:hover {
    transform: translateY(-4px);
  }
}
</style>
