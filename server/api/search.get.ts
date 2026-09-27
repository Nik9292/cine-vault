import type { TmdbMovieDto, TmdbPaginatedResponse } from '../types/tmdb'
import type { TmdbTvDto } from '../types/TmdbTvDto'
import { mapTmdbMovieToSummary } from '../mappers/movie'
import { mapTmdbTvToSummary } from '../mappers/tv'
import { mergeSearchResults } from '../utils/mergeSearchResults'
import { tmdbFetch } from '../utils/tmdbFetch'

export default defineEventHandler(async (event) => {
  const { query, page: pageParam = '1' } = getQuery(event)
  if (typeof query !== 'string' || !query.trim() || query.trim().length > 100) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Search query must contain from 1 to 100 characters',
    })
  }
  if (typeof pageParam !== 'string' || !/^[1-9]\d*$/.test(pageParam) || Number(pageParam) > 500) {
    throw createError({ statusCode: 400, statusMessage: 'Page must be an integer from 1 to 500' })
  }
  const page = Number(pageParam)
  const params = { query: query.trim(), page, include_adult: false }
  const [movies, series] = await Promise.all([
    tmdbFetch<TmdbPaginatedResponse<TmdbMovieDto>>(event, '/search/movie', params),
    tmdbFetch<TmdbPaginatedResponse<TmdbTvDto>>(event, '/search/tv', params),
  ])
  return mergeSearchResults(
    {
      page,
      results: movies.results.map(mapTmdbMovieToSummary),
      totalPages: movies.total_pages,
      totalResults: movies.total_results,
    },
    {
      page,
      results: series.results.map(mapTmdbTvToSummary),
      totalPages: series.total_pages,
      totalResults: series.total_results,
    },
  )
})
