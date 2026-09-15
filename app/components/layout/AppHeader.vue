<script setup lang="ts">
interface NavLink {
  label: string
  to: string
  relatedPrefixes?: string[]
}

const route = useRoute()

const isMobileMenuOpen = ref(false)

const navLinks: NavLink[] = [
  {
    label: 'Главная',
    to: '/',
  },
  {
    label: 'Фильмы',
    to: '/movie',
    relatedPrefixes: ['/media/movie/'],
  },
  {
    label: 'Сериалы',
    to: '/tv',
    relatedPrefixes: ['/media/tv/'],
  },
]

function isNavLinkActive(link: NavLink): boolean {
  if (route.path === link.to) return true

  if (link.to !== '/' && route.path.startsWith(`${link.to}/`)) {
    return true
  }

  return link.relatedPrefixes?.some(prefix => route.path.startsWith(prefix)) ?? false
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

watch(
  () => route.fullPath,
  () => {
    isMobileMenuOpen.value = false
  },
)
</script>

<template>
  <header class="app-header">
    <div class="container app-header__inner">
      <NuxtLink
        class="app-header__logo"
        to="/"
        aria-label="CineVault — главная"
      >
        <span class="app-header__logo-main">Cine</span>
        <span class="app-header__logo-accent">Vault</span>
      </NuxtLink>

      <nav
        class="app-header__nav"
        aria-label="Основная навигация"
      >
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          :class="[
            'app-header__nav-link',
            {
              'app-header__nav-link--active': isNavLinkActive(link),
            },
          ]"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="app-header__actions">
        <SearchBar />

        <button
          class="app-header__action app-header__profile"
          type="button"
          aria-label="Открыть профиль"
          title="Профиль"
        >
          <Icon
            name="lucide:user"
            size="21"
          />
        </button>

        <button
          class="app-header__action app-header__menu-button"
          type="button"
          aria-label="Открыть меню"
          aria-controls="mobile-navigation"
          :aria-expanded="isMobileMenuOpen"
          @click="toggleMobileMenu"
        >
          <Icon
            :name="isMobileMenuOpen ? 'lucide:x' : 'lucide:menu'"
            size="24"
          />
        </button>
      </div>
    </div>

    <Transition name="mobile-menu">
      <nav
        v-if="isMobileMenuOpen"
        id="mobile-navigation"
        class="app-header__mobile-nav"
        aria-label="Мобильная навигация"
      >
        <div class="container app-header__mobile-nav-inner">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            :class="[
              'app-header__mobile-link',
              {
                'app-header__mobile-link--active': isNavLinkActive(link),
              },
            ]"
          >
            {{ link.label }}
          </NuxtLink>

          <button
            class="app-header__mobile-profile"
            type="button"
          >
            <Icon
              name="lucide:user"
              size="20"
            />

            <span>Профиль</span>
          </button>
        </div>
      </nav>
    </Transition>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  position: sticky;
  z-index: 100;
  top: 0;
  color: #f5f5f5;
  background: rgb(15 15 26 / 92%);
  border-bottom: 1px solid rgb(255 255 255 / 10%);
  backdrop-filter: blur(12px);

  &__inner {
    display: flex;
    align-items: center;
    min-height: 72px;
  }

  &__logo {
    flex-shrink: 0;
    color: inherit;
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -0.8px;
    text-decoration: none;
  }

  &__logo-main {
    color: #f5f5f5;
  }

  &__logo-accent {
    color: #e94560;
  }

  &__nav {
    display: flex;
    align-self: stretch;
    gap: 8px;
    margin-left: 56px;
  }

  &__nav-link {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 12px;
    color: #8f8fa3;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    transition: color 200ms ease;

    &::after {
      position: absolute;
      right: 12px;
      bottom: 0;
      left: 12px;
      height: 2px;
      background: #e94560;
      content: '';
      opacity: 0;
      transform: scaleX(0);
      transition:
        opacity 200ms ease,
        transform 200ms ease;
    }

    &:hover {
      color: #f5f5f5;
    }

    &:focus-visible {
      color: #f5f5f5;
      outline: 2px solid #e94560;
      outline-offset: -2px;
      border-radius: 6px;
    }

    &--active {
      color: #f5f5f5;

      &::after {
        opacity: 1;
        transform: scaleX(1);
      }
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
  }

  &__action {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0;
    color: #f5f5f5;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 50%;
    cursor: pointer;
    transition:
      color 200ms ease,
      background 200ms ease,
      border-color 200ms ease;

    &:hover {
      color: #e94560;
      background: rgb(255 255 255 / 8%);
      border-color: rgb(255 255 255 / 10%);
    }

    &:focus-visible {
      outline: 2px solid #e94560;
      outline-offset: 2px;
    }
  }

  &__profile {
    background: rgb(255 255 255 / 8%);
    border-color: rgb(255 255 255 / 10%);
  }

  &__menu-button {
    display: none;
  }

  &__mobile-nav {
    display: none;
  }

  &__mobile-nav-inner {
    display: flex;
    flex-direction: column;
    padding-top: 8px;
    padding-bottom: 16px;
  }

  &__mobile-link {
    padding: 14px 0;
    color: #8f8fa3;
    font-size: 15px;
    font-weight: 600;
    text-decoration: none;
    border-bottom: 1px solid rgb(255 255 255 / 8%);
    transition: color 200ms ease;

    &:hover,
    &--active {
      color: #e94560;
    }

    &:focus-visible {
      outline: 2px solid #e94560;
      outline-offset: 2px;
    }
  }

  &__mobile-profile {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 0 0;
    color: #f5f5f5;
    font: inherit;
    font-size: 15px;
    font-weight: 600;
    text-align: left;
    background: transparent;
    border: 0;
    cursor: pointer;
  }
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  overflow: hidden;
  transition:
    opacity 200ms ease,
    transform 200ms ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (width <= 768px) {
  .app-header {
    &__inner {
      min-height: 64px;
    }

    &__logo {
      font-size: 22px;
    }

    &__nav,
    &__profile {
      display: none;
    }

    &__menu-button {
      display: flex;
    }

    &__mobile-nav {
      display: block;
      background: rgb(15 15 26 / 98%);
      border-top: 1px solid rgb(255 255 255 / 8%);
    }
    &__search {
      width: min(220px, 42vw);
    }
  }
}
</style>
