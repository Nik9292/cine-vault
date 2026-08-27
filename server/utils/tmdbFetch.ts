import type { H3Event } from 'h3'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

type TmdbQuery = Record<string, string | number | boolean | undefined>

export function tmdbFetch<T>(event: H3Event, path: string, query: TmdbQuery = {}) {
  const config = useRuntimeConfig(event)
  const url = `${TMDB_BASE_URL}${path}`

  return $fetch<T>(url, {
    headers: {
      Authorization: `Bearer ${config.tmdbAccessToken}`,
    },
    query: {
      language: 'ru-RU',
      region: 'RU',
      ...query,
    },
  })
}
