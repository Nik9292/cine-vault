import { tmdbFetch } from '../../utils/tmdbFetch'

export default defineEventHandler(async (event) => {
  const type = getRouterParam(event, 'type')
  if (type !== 'movie' && type !== 'tv') {
    throw createError({ statusCode: 404, statusMessage: 'Unknown catalog type' })
  }
  return tmdbFetch<{ genres: { id: number, name: string }[] }>(event, `/genre/${type}/list`)
})
