import assert from 'node:assert/strict'
import test from 'node:test'
import {
  parseCatalogQuery,
  catalogLocationQuery,
  catalogTmdbQuery,
} from '../shared/utils/catalog.ts'
import { paginationItems } from '../shared/utils/pagination.ts'

test('catalog URLs round-trip filters and page without losing zero values', () => {
  const filters = parseCatalogQuery({
    genre: '16',
    year: '2025',
    ratingFrom: '0',
    votesFrom: '100',
    sort: 'rating',
    page: '8',
  })
  assert.equal(filters.yearFrom, '2025')
  assert.equal(filters.yearTo, '2025')
  assert.deepEqual(parseCatalogQuery(catalogLocationQuery(filters)), filters)
  assert.deepEqual(catalogLocationQuery(parseCatalogQuery({})), {})
})

test('invalid or repeated query parameters fail instead of reaching TMDB', () => {
  for (const query of [
    { page: '0' },
    { page: '501' },
    { page: '1.5' },
    { page: ['1', '2'] },
    { yearFrom: '2025', yearTo: '2020' },
    { ratingFrom: '11' },
    { votesFrom: '-1' },
    { genre: '16|99' },
    { sort: 'unknown' },
  ])
    assert.throws(() => parseCatalogQuery(query))
})

test('movie release dates and TV premiere dates use different upstream fields', () => {
  const filters = parseCatalogQuery({
    yearFrom: '2020',
    yearTo: '2025',
    sort: 'newest',
    genre: '16',
    ratingFrom: '7.5',
    votesFrom: '100',
  })
  for (const [type, field] of [
    ['movie', 'primary_release_date'],
    ['tv', 'first_air_date'],
  ]) {
    const query = catalogTmdbQuery(type, filters)
    assert.equal(query[`${field}.gte`], '2020-01-01')
    assert.equal(query[`${field}.lte`], '2025-12-31')
    assert.equal(query.sort_by, `${field}.desc`)
    assert.equal(query['vote_average.gte'], '7.5')
    assert.equal(query.with_genres, '16')
  }
})

test('pagination always exposes first, current and last pages without duplicates', () => {
  for (const total of [1, 2, 5, 8, 25, 500]) {
    for (let current = 1; current <= total; current++) {
      for (const siblings of [1, 2]) {
        const items = paginationItems(current, total, siblings)
        const pages = items.filter(item => typeof item === 'number')
        assert.equal(pages[0], 1)
        assert.equal(pages.at(-1), total)
        assert.ok(pages.includes(current))
        assert.equal(new Set(items).size, items.length)
        assert.ok(pages.every(page => page >= 1 && page <= total))
        assert.deepEqual(
          [...pages].sort((a, b) => a - b),
          pages,
        )
        assert.ok(items.length <= 2 * siblings + 7)
      }
    }
  }
  assert.deepEqual(paginationItems(1, 0), [])
})
