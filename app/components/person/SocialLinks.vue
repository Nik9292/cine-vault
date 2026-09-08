<script setup lang="ts">
import type { PersonExternalIds } from '~~/shared/types/person'

interface SocialLink {
  label: string
  icon: string
  url: string
}

const props = defineProps<{
  externalIds: PersonExternalIds
}>()

function removeAt(value: string): string {
  return value.replace(/^@/, '')
}

function getYouTubeUrl(value: string): string {
  if (value.startsWith('UC')) {
    return `https://www.youtube.com/channel/${value}`
  }

  return `https://www.youtube.com/@${removeAt(value)}`
}

const socialLinks = computed<SocialLink[]>(() => {
  const links: SocialLink[] = []
  const ids = props.externalIds

  if (ids.instagramId) {
    links.push({
      label: 'Instagram',
      icon: 'simple-icons:instagram',
      url: `https://www.instagram.com/${removeAt(ids.instagramId)}`,
    })
  }

  if (ids.facebookId) {
    links.push({
      label: 'Facebook',
      icon: 'simple-icons:facebook',
      url: `https://www.facebook.com/${ids.facebookId}`,
    })
  }

  if (ids.twitterId) {
    links.push({
      label: 'X',
      icon: 'simple-icons:x',
      url: `https://x.com/${removeAt(ids.twitterId)}`,
    })
  }

  if (ids.tiktokId) {
    links.push({
      label: 'TikTok',
      icon: 'simple-icons:tiktok',
      url: `https://www.tiktok.com/@${removeAt(ids.tiktokId)}`,
    })
  }

  if (ids.youtubeId) {
    links.push({
      label: 'YouTube',
      icon: 'simple-icons:youtube',
      url: getYouTubeUrl(ids.youtubeId),
    })
  }

  if (ids.imdbId) {
    links.push({
      label: 'IMDb',
      icon: 'simple-icons:imdb',
      url: `https://www.imdb.com/name/${ids.imdbId}`,
    })
  }

  return links
})
</script>

<template>
  <div
    v-if="socialLinks.length"
    class="social-links"
  >
    <a
      v-for="link in socialLinks"
      :key="link.label"
      class="social-links__link"
      :href="link.url"
      :aria-label="link.label"
      :title="link.label"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon
        :name="link.icon"
        size="20"
      />
    </a>
  </div>
</template>

<style scoped lang="scss">
.social-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  &__link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    color: var(--color-text-muted);
    background: rgb(255 255 255 / 5%);
    border: 1px solid rgb(255 255 255 / 10%);
    border-radius: 50%;
    transition:
      color 150ms ease,
      background-color 150ms ease,
      border-color 150ms ease,
      transform 150ms ease;

    &:hover,
    &:focus-visible {
      color: var(--color-accent);
      background: rgb(233 69 96 / 10%);
      border-color: var(--color-accent);
      transform: translateY(-2px);
    }
  }
}
</style>
