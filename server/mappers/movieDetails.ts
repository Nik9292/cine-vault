import { mapCredits, mapVideos } from './details'
import type { TmdbMovieDetailsDto } from '../types/TmdbMovieDetailsDto'
import type { MovieDetails } from '~~/shared/types/media'
import { mapTmdbMovieToSummary } from './movie.ts'

export function mapTmdbMovieDetails(movie: TmdbMovieDetailsDto): MovieDetails {
  return {
    mediaType: 'movie',
    adult: movie.adult,
    backdropPath: movie.backdrop_path,
    belongsToCollection: movie.belongs_to_collection
      ? {
          id: movie.belongs_to_collection.id,
          name: movie.belongs_to_collection.name,
          posterPath: movie.belongs_to_collection.poster_path,
          backdropPath: movie.belongs_to_collection.backdrop_path,
        }
      : null,
    budget: movie.budget,
    genres: movie.genres,
    homepage: movie.homepage,
    id: movie.id,
    imdbId: movie.imdb_id,
    originCountry: movie.origin_country,
    originalLanguage: movie.original_language,
    originalTitle: movie.original_title,
    overview: movie.overview,
    popularity: movie.popularity,
    posterPath: movie.poster_path,
    productionCompanies: movie.production_companies.map(company => ({
      id: company.id,
      logoPath: company.logo_path,
      name: company.name,
      originCountry: company.origin_country,
    })),
    productionCountries: movie.production_countries.map(country => ({
      iso31661: country.iso_3166_1,
      name: country.name,
    })),
    releaseDate: movie.release_date,
    revenue: movie.revenue,
    runtime: movie.runtime,
    spokenLanguages: movie.spoken_languages.map(language => ({
      englishName: language.english_name,
      iso6391: language.iso_639_1,
      name: language.name,
    })),
    status: movie.status,
    tagline: movie.tagline,
    title: movie.title,
    video: movie.video,
    voteAverage: movie.vote_average,
    voteCount: movie.vote_count,
    credits: mapCredits(movie.credits),
    similar: {
      page: movie.similar.page,
      results: movie.similar.results.map(mapTmdbMovieToSummary),
      totalPages: movie.similar.total_pages,
      totalResults: movie.similar.total_results,
    },
    videos: mapVideos(movie.videos),
  }
}
