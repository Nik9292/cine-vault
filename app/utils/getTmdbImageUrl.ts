export function getTmdbImageUrl(name: string | null, size = 'w342'): string | null {
  if (!name) {
    return null
  }

  return `https://image.tmdb.org/t/p/${size}/${name}`
}
