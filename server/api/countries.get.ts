import { tmdbFetch } from '../utils/tmdbFetch'

interface TmdbCountry {
  iso_3166_1: string
  english_name: string
  native_name: string
}

export default defineEventHandler(async (event) => {
  const countries = await tmdbFetch<TmdbCountry[]>(event, '/configuration/countries')
  const names = new Intl.DisplayNames(['ru'], { type: 'region' })
  return countries
    .map(country => ({
      code: country.iso_3166_1,
      name: names.of(country.iso_3166_1) || country.native_name || country.english_name,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'ru'))
})
