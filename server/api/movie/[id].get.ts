import type { TmdbMovieDetailsDto } from '../../types/TmdbMovieDetailsDto.ts'
import { mapTmdbMovieDetails } from '../../mappers/movieDetails.ts'
import { tmdbFetch } from '#server/utils/tmdbFetch.ts'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id || !/^[1-9]\d*$/.test(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid movie ID' })
  }
  const movie = await tmdbFetch<TmdbMovieDetailsDto>(event, `/movie/${id}`, {
    append_to_response: 'credits,recommendations,videos',
    include_video_language: 'ru,en,null',
  })

  return mapTmdbMovieDetails(movie)
})
