import type { TmdbTvDetailsDto } from '../../types/TmdbTvDto'
import { mapTmdbTvDetails } from '../../mappers/tv'
import { tmdbFetch } from '../../utils/tmdbFetch'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id || !/^[1-9]\d*$/.test(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid TV ID' })
  }
  const tv = await tmdbFetch<TmdbTvDetailsDto>(event, `/tv/${id}`, {
    append_to_response: 'credits,recommendations,videos',
    include_video_language: 'ru,en,null',
  })
  return mapTmdbTvDetails(tv)
})
