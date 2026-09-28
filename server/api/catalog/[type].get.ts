import type { TmdbMovieDto, TmdbPaginatedResponse } from '../../types/tmdb'
import type { TmdbTvDto } from '../../types/TmdbTvDto'
import type { MediaSummary, PaginatedResponse } from '~~/shared/types/media'
import { parseCatalogQuery, catalogTmdbQuery } from '~~/shared/utils/catalog'
import { mapTmdbMovieToSummary } from '../../mappers/movie'
import { mapTmdbTvToSummary } from '../../mappers/tv'
import { tmdbFetch } from '../../utils/tmdbFetch'

export default defineEventHandler(async (event): Promise<PaginatedResponse<MediaSummary>> => {
  const type = getRouterParam(event, 'type')
  if (type !== 'movie' && type !== 'tv') {
    throw createError({ statusCode: 404, statusMessage: 'Unknown catalog type' })
  }
  let filters
  try {
    filters = parseCatalogQuery(getQuery(event))
  }
  catch (error) {
    throw createError({
      statusCode: 400,
      message: error instanceof Error ? error.message : 'Invalid filters',
    })
  }
  const query = catalogTmdbQuery(type, filters)
  if (type === 'movie') {
    const response = await tmdbFetch<TmdbPaginatedResponse<TmdbMovieDto>>(
      event,
      '/discover/movie',
      query,
    )
    return {
      page: response.page,
      results: response.results.map(mapTmdbMovieToSummary),
      totalPages: Math.min(500, response.total_pages),
      totalResults: response.total_results,
    }
  }
  const response = await tmdbFetch<TmdbPaginatedResponse<TmdbTvDto>>(event, '/discover/tv', query)
  return {
    page: response.page,
    results: response.results.map(mapTmdbTvToSummary),
    totalPages: Math.min(500, response.total_pages),
    totalResults: response.total_results,
  }
})
