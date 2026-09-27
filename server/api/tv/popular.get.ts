import type { TmdbTvDto } from '../../types/TmdbTvDto'
import type { TmdbPaginatedResponse } from '../../types/tmdb'
import { mapTmdbTvToSummary } from '../../mappers/tv'
import { tmdbFetch } from '../../utils/tmdbFetch'

export default defineEventHandler(async (event) => {
  const response = await tmdbFetch<TmdbPaginatedResponse<TmdbTvDto>>(event, '/tv/popular', {
    page: 1,
  })
  return {
    page: response.page,
    results: response.results.map(mapTmdbTvToSummary),
    totalPages: response.total_pages,
    totalResults: response.total_results,
  }
})
