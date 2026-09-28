import type { TmdbMovieDetailsDto } from './TmdbMovieDetailsDto'
import type { TmdbPaginatedResponse } from './tmdb'

export interface TmdbTvDto {
  adult: boolean
  backdrop_path: string | null
  genre_ids: number[]
  id: number
  name: string
  original_language: string
  original_name: string
  overview: string
  popularity: number
  poster_path: string | null
  first_air_date?: string
  vote_average: number
  vote_count: number
}

export interface TmdbTvDetailsDto {
  adult: boolean
  backdrop_path: string | null
  genres: TmdbMovieDetailsDto['genres']
  homepage: string | null
  id: number
  origin_country: string[]
  original_language: string
  original_name: string
  overview: string
  popularity: number
  poster_path: string | null
  production_companies: TmdbMovieDetailsDto['production_companies']
  production_countries: TmdbMovieDetailsDto['production_countries']
  spoken_languages: TmdbMovieDetailsDto['spoken_languages']
  status: string
  tagline: string | null
  name: string
  vote_average: number
  vote_count: number
  first_air_date: string | null
  last_air_date: string | null
  number_of_seasons: number
  number_of_episodes: number
  credits: TmdbMovieDetailsDto['credits']
  videos: TmdbMovieDetailsDto['videos']
  recommendations: TmdbPaginatedResponse<TmdbTvDto>
}
