import type { TmdbMovieDetailsDto } from '../../types/TmdbMovieDetailsDto.ts'
import { mapTmdbMovieDetails } from '../../mappers/movieDetails.ts'
import { tmdbFetch } from '#server/utils/tmdbFetch.ts'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const movie = await tmdbFetch<TmdbMovieDetailsDto>(
    event,
    `/movie/${id}?append_to_response=credits,similar,videos`,
  )

  return mapTmdbMovieDetails(movie)
})
