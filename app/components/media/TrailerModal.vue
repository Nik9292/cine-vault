<script setup lang="ts">
import type { Video } from '~~/shared/types/media'

const { videos, visible } = defineProps<{
  videos: Video[]
  visible: boolean
}>()
const emit = defineEmits<{
  close: []
}>()

function getTrailerKey(): string | null {
  const ru = videos.find(
    video => video.site === 'YouTube' && video.type === 'Trailer' && video.iso6391 === 'ru',
  )
  if (ru) return ru.key
  const en = videos.find(
    video => video.site === 'YouTube' && video.type === 'Trailer' && video.iso6391 === 'en',
  )
  if (en) return en.key
  const any = videos.find(video => video.site === 'YouTube' && video.type === 'Trailer')
  if (any) return any.key
  const vid = videos.find(video => video.site === 'YouTube')
  return vid?.key || null
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="visible"
        class="backdrop"
        @click="emit('close')"
      >
        <div
          class="modal"
          @click.stop
        >
          <button
            class="closeBtn"
            @click="emit('close')"
          >
            ✕
          </button>
          <div class="videoWrap">
            <iframe
              v-if="getTrailerKey()"
              :src="`https://www.youtube.com/embed/${getTrailerKey()}?autoplay=1`"
              frameborder="0"
              allow="
                accelerometer;
                autoplay;
                clipboard-write;
                encrypted-media;
                gyroscope;
                picture-in-picture;
              "
              allowfullscreen
              class="iframe"
            />
            <div
              v-else
              class="noVideo"
            >
              Трейлер не найден
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal {
  position: relative;
  width: 100%;
  max-width: 900px;
  background: #1a1a2e;
  border-radius: 16px;
  overflow: hidden;
}

.closeBtn {
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  font-family: inherit;
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  color: white;
  font-size: 16px;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
}

.videoWrap {
  position: relative;
  padding-top: 56.25%;
}

.iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.noVideo {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
