export type CatalogType = 'movie' | 'tv'
export type CatalogSort = 'popular' | 'rating' | 'newest' | 'oldest'

export interface CatalogFilters {
  country: string
  genre: string
  yearFrom: string
  yearTo: string
  ratingFrom: string
  votesFrom: string
  sort: CatalogSort
  page: number
}

export const ratingMinVotes = '1000'

export const catalogSortOptions: { value: CatalogSort, label: string }[] = [
  { value: 'popular', label: 'По популярности' },
  { value: 'rating', label: 'По рейтингу' },
  { value: 'newest', label: 'Сначала новые' },
  { value: 'oldest', label: 'Сначала старые' },
]

export function parseCatalogQuery(query: Record<string, unknown>): CatalogFilters {
  function numeric(key: string, label: string, min: number, max: number, decimal = false): string {
    const value = query[key]
    if (value === undefined || value === '') return ''
    if (
      typeof value !== 'string'
      || !(decimal ? /^\d+(\.\d)?$/ : /^\d+$/).test(value)
      || Number(value) < min
      || Number(value) > max
    ) {
      throw new Error(`${label}: укажите число от ${min} до ${max}.`)
    }
    return String(Number(value))
  }
  const country = query.country ?? ''
  if (typeof country !== 'string' || (country && !/^[A-Z]{2}$/.test(country))) {
    throw new Error('Укажите двухбуквенный код страны, например RU или US.')
  }
  const year = numeric('year', 'Год', 1870, 2100)
  const yearFrom = numeric('yearFrom', 'Начальный год', 1870, 2100) || year
  const yearTo = numeric('yearTo', 'Конечный год', 1870, 2100) || year
  if (yearFrom && yearTo && Number(yearFrom) > Number(yearTo)) {
    throw new Error('Начальный год не должен быть больше конечного.')
  }
  const sort = query.sort ?? 'popular'
  if (!catalogSortOptions.some(option => option.value === sort)) {
    throw new Error('Неизвестный способ сортировки.')
  }
  return {
    country,
    genre: numeric('genre', 'Жанр', 1, 999999),
    yearFrom,
    yearTo,
    ratingFrom: numeric('ratingFrom', 'Рейтинг', 0, 10, true),
    votesFrom:
      numeric('votesFrom', 'Количество оценок', 0, 10000000)
      || (sort === 'rating' ? ratingMinVotes : ''),
    sort: sort as CatalogSort,
    page: Number(numeric('page', 'Страница', 1, 500) || 1),
  }
}

export function catalogLocationQuery(filters: CatalogFilters): Record<string, string> {
  const query: Record<string, string> = {}
  for (const key of [
    'country',
    'genre',
    'yearFrom',
    'yearTo',
    'ratingFrom',
    'votesFrom',
  ] as const) {
    if (filters[key]) query[key] = filters[key]
  }
  if (filters.sort !== 'popular') query.sort = filters.sort
  if (filters.page !== 1) query.page = String(filters.page)
  return query
}

export function catalogTmdbQuery(type: CatalogType, filters: CatalogFilters) {
  const dateField = type === 'movie' ? 'primary_release_date' : 'first_air_date'
  const sorts: Record<CatalogSort, string> = {
    popular: 'popularity.desc',
    rating: 'vote_average.desc',
    newest: `${dateField}.desc`,
    oldest: `${dateField}.asc`,
  }
  return {
    'page': filters.page,
    'sort_by': sorts[filters.sort],
    'with_origin_country': filters.country || undefined,
    'with_genres': filters.genre || undefined,
    [`${dateField}.gte`]: filters.yearFrom ? `${filters.yearFrom}-01-01` : undefined,
    [`${dateField}.lte`]: filters.yearTo ? `${filters.yearTo}-12-31` : undefined,
    'vote_average.gte': filters.ratingFrom || undefined,
    'vote_count.gte': filters.votesFrom || undefined,
    'include_adult': false,
    'region': undefined,
  }
}
