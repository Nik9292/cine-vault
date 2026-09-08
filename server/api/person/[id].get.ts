import type { TmdbPersonDetailsDto } from '../../types/TmdbPersonDetailsDto.ts'
import { mapPersonDetails } from '../../mappers/personDetails.ts'
import { tmdbFetch } from '~~/server/utils/tmdbFetch'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Person ID is required',
    })
  }

  const person = await tmdbFetch<TmdbPersonDetailsDto>(event, `/person/${id}`, {
    language: 'ru-RU',
    append_to_response: 'combined_credits,images,external_ids,tagged_images',
  })

  return mapPersonDetails(person)
})
