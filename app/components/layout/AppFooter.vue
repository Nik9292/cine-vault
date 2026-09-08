<script setup lang="ts">
const currentYear = new Date().getFullYear()

const navigation = [
  { label: 'Фильмы', to: '/movie' },
  { label: 'Сериалы', to: '/tv' },
  { label: 'Мультфильмы', to: '/animation' },
  { label: 'Документалки', to: '/documentary' },
]

const personalSections = [
  { label: 'Коллекция', to: '/collection' },
  { label: 'Рекомендации', to: '/recommendations' },
]
</script>

<template>
  <footer class="footer">
    <div class="container footer__container">
      <div class="footer__content">
        <div class="footer__about">
          <NuxtLink
            class="footer__logo"
            to="/"
            aria-label="CineVault — на главную"
          >
            Cine<span>Vault</span>
          </NuxtLink>

          <p class="footer__description">
            Место для фильмов, сериалов и историй, которые хочется сохранить.
          </p>
        </div>

        <nav
          class="footer__navigation"
          aria-label="Навигация в подвале"
        >
          <div class="footer__column">
            <h2 class="footer__title">Смотреть</h2>

            <ul class="footer__links">
              <li
                v-for="item in navigation"
                :key="item.to"
              >
                <NuxtLink
                  class="footer__link"
                  :to="item.to"
                >
                  {{ item.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div class="footer__column">
            <h2 class="footer__title">Мой CineVault</h2>

            <ul class="footer__links">
              <li
                v-for="item in personalSections"
                :key="item.to"
              >
                <NuxtLink
                  class="footer__link"
                  :to="item.to"
                >
                  {{ item.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div class="footer__bottom">
        <p>© {{ currentYear }} CineVault</p>

        <p class="footer__source">
          Данные о фильмах предоставлены
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            TMDB
          </a>
        </p>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  margin-top: 64px;
  color: var(--color-text-muted);
  background: var(--color-background);
  border-top: 1px solid rgb(255 255 255 / 8%);

  &__container {
    padding-block: 48px 24px;
  }

  &__content {
    display: grid;
    grid-template-columns: minmax(260px, 1fr) auto;
    gap: 80px;
    padding-bottom: 40px;
  }

  &__about {
    max-width: 390px;
  }

  &__logo {
    display: inline-block;
    margin-bottom: 16px;
    color: var(--color-text);
    font-size: 26px;
    font-weight: 700;
    letter-spacing: -0.8px;

    span {
      color: var(--color-accent);
    }
  }

  &__description {
    font-size: 14px;
    line-height: 1.7;
  }

  &__navigation {
    display: grid;
    grid-template-columns: repeat(2, minmax(140px, 1fr));
    gap: 64px;
  }

  &__title {
    margin-bottom: 18px;
    color: var(--color-text);
    font-size: 14px;
    font-weight: 700;
  }

  &__links {
    display: grid;
    gap: 12px;
  }

  &__link {
    font-size: 14px;
    transition: color 150ms ease;

    &:hover,
    &:focus-visible {
      color: var(--color-accent);
    }
  }

  &__bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding-top: 24px;
    font-size: 12px;
    border-top: 1px solid rgb(255 255 255 / 8%);
  }

  &__source a {
    color: var(--color-text);
    font-weight: 700;
    transition: color 150ms ease;

    &:hover,
    &:focus-visible {
      color: var(--color-accent);
    }
  }
}

@media (max-width: 720px) {
  .footer {
    margin-top: 48px;

    &__container {
      padding-block: 40px 20px;
    }

    &__content {
      grid-template-columns: 1fr;
      gap: 36px;
      padding-bottom: 32px;
    }

    &__navigation {
      gap: 32px;
    }

    &__bottom {
      align-items: flex-start;
      flex-direction: column;
      gap: 10px;
      padding-top: 20px;
    }
  }
}

@media (max-width: 420px) {
  .footer__navigation {
    grid-template-columns: 1fr;
  }
}
</style>
