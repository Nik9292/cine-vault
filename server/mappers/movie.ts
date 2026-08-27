import type { TmdbMovieDto } from '../types/tmdb'

import type { MovieSummary } from '~~/shared/types/media'

export function mapTmdbMovieToSummary(movie: TmdbMovieDto): MovieSummary {
  return {
    adult: movie.adult,
    backdropPath: movie.backdrop_path,
    genreIds: movie.genre_ids,
    id: movie.id,
    title: movie.title,
    originalLanguage: movie.original_language,
    originalTitle: movie.original_title,
    overview: movie.overview,
    popularity: movie.popularity,
    posterPath: movie.poster_path,
    releaseDate: movie.release_date,
    video: movie.video,
    voteAverage: movie.vote_average,
    voteCount: movie.vote_count,
  }
}
