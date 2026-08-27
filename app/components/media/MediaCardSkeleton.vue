<template>
  <article
    class="media-card-skeleton"
    aria-hidden="true"
  >
    <div class="media-card-skeleton__poster" />
    <div class="media-card-skeleton__content">
      <div class="media-card-skeleton__title" />
      <div class="media-card-skeleton__meta">
        <div class="media-card-skeleton__year" />
        <div class="media-card-skeleton__type" />
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.media-card-skeleton {
  overflow: hidden;
  background: #1a1a2e;
  border-radius: 12px;
  flex: 0 0 180px;
  width: 180px;

  &__poster {
    aspect-ratio: 2 / 3;
    background: #24243d;
  }

  &__content {
    padding: 12px;
  }

  &__title {
    width: 75%;
    height: 20px;
    margin-bottom: 8px;
    border-radius: 4px;
  }

  &__meta {
    display: flex;
    justify-content: space-between;
    gap: 8px;
  }

  &__year {
    width: 32px;
    height: 14px;
    border-radius: 4px;
  }

  &__type {
    width: 45px;
    height: 14px;
    border-radius: 4px;
  }

  &__poster,
  &__title,
  &__year,
  &__type {
    background: linear-gradient(90deg, #24243d 25%, #34344f 50%, #24243d 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite linear;
  }
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .media-card-skeleton {
    &__poster,
    &__title,
    &__year,
    &__type {
      animation: none;
    }
  }
}
</style>
