import type { H3Event } from 'h3'
import { ofetch } from 'ofetch'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

type TmdbQuery = Record<string, string | number | boolean | undefined>

export async function tmdbFetch<T>(event: H3Event, path: string, query: TmdbQuery = {}): Promise<T> {
  const config = useRuntimeConfig(event)
  const url = `${TMDB_BASE_URL}${path}`

  try {
    return await ofetch<T>(url, {
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
  catch (error) {
    const notFound = error instanceof Error && 'statusCode' in error && error.statusCode === 404
    throw createError({
      statusCode: notFound ? 404 : 502,
      statusMessage: notFound ? 'Media not found' : 'Unable to load TMDB data',
    })
  }
}
