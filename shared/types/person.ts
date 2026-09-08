import type { MovieSummary } from './media'

export interface PersonMovieCastCredit extends MovieSummary {
  character: string
  creditId: string
  mediaType: 'movie'
  order: number
  softcore: boolean
}

export interface PersonMovieCrewCredit extends MovieSummary {
  creditId: string
  department: string
  job: string
  mediaType: 'movie'
  softcore: boolean
}

export interface PersonImage {
  aspectRatio: number
  filePath: string
  height: number
  iso6391: string | null
  iso31661: string | null
  voteAverage: number
  voteCount: number
  width: number
}

export interface PersonImages {
  profiles: PersonImage[]
}

export interface PersonExternalIds {
  facebookId: string | null
  imdbId: string | null
  instagramId: string | null
  tiktokId: string | null
  twitterId: string | null
  wikidataId: string | null
  youtubeId: string | null
}

export interface PersonDetails {
  adult: boolean
  alsoKnownAs: string[]
  biography: string
  birthday: string | null
  combinedCredits: {
    cast: PersonMovieCastCredit[]
    crew: PersonMovieCrewCredit[]
  }
  deathday: string | null
  gender: number
  homepage: string | null
  id: number
  imdbId: string | null
  knownForDepartment: string
  name: string
  placeOfBirth: string | null
  popularity: number
  profilePath: string | null
  images: PersonImages
  externalIds: PersonExternalIds
}
