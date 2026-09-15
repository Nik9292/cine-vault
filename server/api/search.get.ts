import type { TmdbMovieDto, TmdbPaginatedResponse } from '../types/tmdb'
import type { MovieSummary, PaginatedResponse } from '~~/shared/types/media'
import { mapTmdbMovieToSummary } from '../mappers/movie'
import { tmdbFetch } from '~~/server/utils/tmdbFetch'

export default defineEventHandler(async (event) => {
  const { query } = getQuery(event)

  if (typeof query !== 'string' || !query.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Search query is required',
    })
  }

  const searchQuery = query.trim()

  if (!searchQuery || searchQuery.length > 100) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Search query must contain from 1 to 100 characters',
    })
  }

  const response = await tmdbFetch<TmdbPaginatedResponse<TmdbMovieDto>>(
    event,
    '/search/movie',
    {
      query: searchQuery,
      page: 1,
      include_adult: false,
    })

  const result: PaginatedResponse<MovieSummary> = {
    page: response.page,
    results: response.results.map(mapTmdbMovieToSummary),
    totalPages: response.total_pages,
    totalResults: response.total_results,
  }

  return result
})
