import type { TmdbTvDto, TmdbTvDetailsDto } from '../types/TmdbTvDto'
import type { TvSummary, TvDetails } from '~~/shared/types/media'
import { mapCredits, mapVideos } from './details'

export function mapTmdbTvToSummary(tv: TmdbTvDto): TvSummary {
  return {
    mediaType: 'tv',
    adult: tv.adult,
    backdropPath: tv.backdrop_path,
    genreIds: tv.genre_ids,
    id: tv.id,
    title: tv.name,
    originalLanguage: tv.original_language,
    originalTitle: tv.original_name,
    overview: tv.overview,
    popularity: tv.popularity,
    posterPath: tv.poster_path,
    releaseDate: tv.first_air_date ?? '',
    voteAverage: tv.vote_average,
    voteCount: tv.vote_count,
  }
}

export function mapTmdbTvDetails(tv: TmdbTvDetailsDto): TvDetails {
  return {
    mediaType: 'tv',
    adult: tv.adult,
    backdropPath: tv.backdrop_path,
    genres: tv.genres,
    homepage: tv.homepage,
    id: tv.id,
    originCountry: tv.origin_country,
    originalLanguage: tv.original_language,
    originalTitle: tv.original_name,
    overview: tv.overview,
    popularity: tv.popularity,
    posterPath: tv.poster_path,
    productionCompanies: tv.production_companies.map(company => ({
      id: company.id,
      logoPath: company.logo_path,
      name: company.name,
      originCountry: company.origin_country,
    })),
    productionCountries: tv.production_countries.map(country => ({
      iso31661: country.iso_3166_1,
      name: country.name,
    })),
    spokenLanguages: tv.spoken_languages.map(language => ({
      englishName: language.english_name,
      iso6391: language.iso_639_1,
      name: language.name,
    })),
    status: tv.status,
    tagline: tv.tagline,
    title: tv.name,
    voteAverage: tv.vote_average,
    voteCount: tv.vote_count,
    firstAirDate: tv.first_air_date ?? '',
    lastAirDate: tv.last_air_date,
    numberOfSeasons: tv.number_of_seasons,
    numberOfEpisodes: tv.number_of_episodes,
    credits: mapCredits(tv.credits),
    videos: mapVideos(tv.videos),
    similar: {
      page: tv.similar.page,
      results: tv.similar.results.map(mapTmdbTvToSummary),
      totalPages: tv.similar.total_pages,
      totalResults: tv.similar.total_results,
    },
  }
}
