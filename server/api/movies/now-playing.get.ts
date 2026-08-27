import type { TmdbMovieDto, TmdbPaginatedResponse } from '../../types/tmdb'
import type { MovieSummary, PaginatedResponse } from '~~/shared/types/media'
import { mapTmdbMovieToSummary } from '../../mappers/movie'
import { tmdbFetch } from '~~/server/utils/tmdbFetch'

export default defineEventHandler(async (event) => {
  const response = await tmdbFetch<TmdbPaginatedResponse<TmdbMovieDto>>(
    event,
    '/movie/now_playing',
    {
      page: 1,
    },
  )

  const result: PaginatedResponse<MovieSummary> = {
    page: response.page,
    results: response.results.map(mapTmdbMovieToSummary),
    totalPages: response.total_pages,
    totalResults: response.total_results,
  }

  return result
})
