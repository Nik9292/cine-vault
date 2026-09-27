export interface MediaSummary {
  mediaType: 'movie' | 'tv'
  adult: boolean
  backdropPath: string | null
  genreIds: number[]
  id: number
  title: string
  originalLanguage: string
  originalTitle: string
  overview: string
  popularity: number
  posterPath: string | null
  releaseDate: string
  voteAverage: number
  voteCount: number
}

export interface MovieSummary extends MediaSummary {
  mediaType: 'movie'
  video: boolean
}

export interface TvSummary extends MediaSummary {
  mediaType: 'tv'
}

export interface PaginatedResponse<T> {
  page: number
  results: T[]
  totalPages: number
  totalResults: number
}

type BelongToCollection = {
  id: number
  name: string
  posterPath: string | null
  backdropPath: string | null
}
type Genre = {
  id: number
  name: string
}

type ProductionCompany = {
  id: number
  logoPath: string | null
  name: string
  originCountry: string
}

type ProductionCountry = {
  iso31661: string
  name: string
}

type SpokenLanguage = {
  englishName: string
  iso6391: string
  name: string
}

export interface CastMember {
  adult: boolean
  castId?: number
  character: string
  creditId: string
  gender: number
  id: number
  knownForDepartment: string
  name: string
  order: number
  originalName: string
  popularity: number
  profilePath: string | null
}
export interface Crew {
  adult: boolean
  creditId: string
  department: string
  gender: number
  id: number
  job: string
  knownForDepartment: string
  name: string
  originalName: string
  popularity: number
  profilePath: string | null
}

export interface Video {
  id: string
  iso31661: string
  iso6391: string
  key: string
  name: string
  official: boolean
  publishedAt: string
  site: string
  size: number
  type: string
}

export interface MediaDetailsBase {
  adult: boolean
  backdropPath: string | null
  genres: Genre[]
  homepage: string | null
  id: number
  originCountry: string[]
  originalLanguage: string
  originalTitle: string
  overview: string
  popularity: number
  posterPath: string | null
  productionCompanies: ProductionCompany[]
  productionCountries: ProductionCountry[]
  spokenLanguages: SpokenLanguage[]
  status: string
  tagline: string | null
  title: string
  voteAverage: number
  voteCount: number
  credits: {
    cast: CastMember[]
    crew: Crew[]
  }
  similar: PaginatedResponse<MediaSummary>
  videos: {
    results: Video[]
  }
}

export interface MovieDetails extends MediaDetailsBase {
  mediaType: 'movie'
  belongsToCollection: BelongToCollection | null
  budget: number
  imdbId: string | null
  releaseDate: string
  revenue: number
  runtime: number | null
  video: boolean
}

export interface TvDetails extends MediaDetailsBase {
  mediaType: 'tv'
  firstAirDate: string
  lastAirDate: string | null
  numberOfSeasons: number
  numberOfEpisodes: number
}

export type MediaDetails = MovieDetails | TvDetails

export interface Tab {
  key: 'trailer' | 'cast' | 'similar'
  label: string
}
