import type {
  TmdbPersonDetailsDto,
  TmdbPersonMovieCastCreditDto,
  TmdbPersonMovieCrewCreditDto,
} from '../types/TmdbPersonDetailsDto'
import type {
  PersonDetails,
  PersonMovieCastCredit,
  PersonMovieCrewCredit,
} from '~~/shared/types/person'

import { mapTmdbMovieToSummary } from './movie'

function mapPersonMovieCastCredit(credit: TmdbPersonMovieCastCreditDto): PersonMovieCastCredit {
  return {
    ...mapTmdbMovieToSummary(credit),
    character: credit.character,
    creditId: credit.credit_id,
    mediaType: credit.media_type,
    order: credit.order,
    softcore: credit.softcore,
  }
}

function mapPersonMovieCrewCredit(credit: TmdbPersonMovieCrewCreditDto): PersonMovieCrewCredit {
  return {
    ...mapTmdbMovieToSummary(credit),
    creditId: credit.credit_id,
    department: credit.department,
    job: credit.job,
    mediaType: credit.media_type,
    softcore: credit.softcore,
  }
}

export function mapPersonDetails(person: TmdbPersonDetailsDto): PersonDetails {
  return {
    adult: person.adult,
    alsoKnownAs: person.also_known_as,
    biography: person.biography,
    birthday: person.birthday,

    combinedCredits: {
      cast: person.combined_credits.cast
        .filter(credit => credit.media_type === 'movie')
        .map(mapPersonMovieCastCredit),

      crew: person.combined_credits.crew
        .filter(credit => credit.media_type === 'movie')
        .map(mapPersonMovieCrewCredit),
    },

    deathday: person.deathday,
    gender: person.gender,
    homepage: person.homepage,
    id: person.id,
    imdbId: person.imdb_id,
    knownForDepartment: person.known_for_department,
    name: person.name,
    placeOfBirth: person.place_of_birth,
    popularity: person.popularity,
    profilePath: person.profile_path,
    images: {
      profiles: person.images.profiles.map(image => ({
        aspectRatio: image.aspect_ratio,
        filePath: image.file_path,
        height: image.height,
        iso6391: image.iso_639_1,
        iso31661: image.iso_3166_1,
        voteAverage: image.vote_average,
        voteCount: image.vote_count,
        width: image.width,
      })),
    },
    externalIds: {
      facebookId: person.external_ids.facebook_id,
      imdbId: person.external_ids.imdb_id,
      instagramId: person.external_ids.instagram_id,
      tiktokId: person.external_ids.tiktok_id,
      twitterId: person.external_ids.twitter_id,
      wikidataId: person.external_ids.wikidata_id,
      youtubeId: person.external_ids.youtube_id,
    },
  }
}

export default mapPersonDetails
