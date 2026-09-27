import type { MediaSummary, PaginatedResponse } from '~~/shared/types/media'

// One search page contains the corresponding page from each source (up to 40 cards).
// Interleave source rankings instead of comparing movie and TV popularity scores.
export function mergeSearchResults(
  movies: PaginatedResponse<MediaSummary>,
  series: PaginatedResponse<MediaSummary>,
): PaginatedResponse<MediaSummary> {
  const results: MediaSummary[] = []
  for (let index = 0; index < Math.max(movies.results.length, series.results.length); index++) {
    const movie = movies.results[index]
    const tv = series.results[index]
    if (movie) results.push(movie)
    if (tv) results.push(tv)
  }
  return {
    page: movies.page,
    results,
    totalPages: Math.min(500, Math.max(movies.totalPages, series.totalPages)),
    totalResults: movies.totalResults + series.totalResults,
  }
}
