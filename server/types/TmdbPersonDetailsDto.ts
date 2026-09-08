import type { TmdbMovieDto } from './tmdb'

export interface TmdbPersonMovieCastCreditDto extends TmdbMovieDto {
  character: string
  credit_id: string
  media_type: 'movie'
  order: number
  softcore: boolean
}

export interface TmdbPersonMovieCrewCreditDto extends TmdbMovieDto {
  credit_id: string
  department: string
  job: string
  media_type: 'movie'
  softcore: boolean
}

export interface TmdbPersonImageDto {
  aspect_ratio: number
  file_path: string
  height: number
  iso_639_1: string | null
  iso_3166_1: string | null
  vote_average: number
  vote_count: number
  width: number
}

export interface TmdbPersonImagesDto {
  profiles: TmdbPersonImageDto[]
}

export interface TmdbPersonTaggedImageDto extends TmdbPersonImageDto {
  id: string
  image_type: 'poster' | 'backdrop'
  media: TmdbMovieDto
  media_type: 'movie'
}

export interface TmdbPersonExternalIdsDto {
  facebook_id: string | null
  freebase_id: string | null
  freebase_mid: string | null
  imdb_id: string | null
  instagram_id: string | null
  tiktok_id: string | null
  tvrage_id: number | null
  twitter_id: string | null
  wikidata_id: string | null
  youtube_id: string | null
}

export interface TmdbPersonDetailsDto {
  adult: boolean
  also_known_as: string[]
  biography: string
  birthday: string | null
  combined_credits: {
    cast: TmdbPersonMovieCastCreditDto[]
    crew: TmdbPersonMovieCrewCreditDto[]
  }
  deathday: string | null
  gender: number
  homepage: string | null
  id: number
  imdb_id: string | null
  known_for_department: string
  name: string
  place_of_birth: string | null
  popularity: number
  profile_path: string | null
  images: TmdbPersonImagesDto
  external_ids: TmdbPersonExternalIdsDto
}
