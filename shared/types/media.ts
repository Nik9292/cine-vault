export interface MovieSummary {
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
  video: boolean
  voteAverage: number
  voteCount: number
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
  castId: number
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

export interface MovieDetails {
  adult: boolean
  backdropPath: string | null
  belongsToCollection: BelongToCollection | null
  budget: number
  genres: Genre[]
  homepage: string | null
  id: number
  imdbId: string | null
  originCountry: string[]
  originalLanguage: string
  originalTitle: string
  overview: string
  popularity: number
  posterPath: string | null
  productionCompanies: ProductionCompany[]
  productionCountries: ProductionCountry[]
  releaseDate: string
  revenue: number
  runtime: number | null
  spokenLanguages: SpokenLanguage[]
  status: string
  tagline: string | null
  title: string
  video: boolean
  voteAverage: number
  voteCount: number
  credits: {
    cast: CastMember[]
    crew: Crew[]
  }
  similar: PaginatedResponse<MovieSummary>
  videos: {
    results: Video[]
  }
}

export interface Tab {
  key: 'trailer' | 'cast' | 'similar'
  label: string
}
