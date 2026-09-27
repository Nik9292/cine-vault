import type { TmdbMovieDetailsDto } from '../types/TmdbMovieDetailsDto'
import type { MediaDetailsBase } from '~~/shared/types/media'

export function mapCredits(credits: TmdbMovieDetailsDto['credits']): MediaDetailsBase['credits'] {
  return {
    cast: credits.cast.map(item => ({
      adult: item.adult,
      castId: item.cast_id,
      character: item.character,
      creditId: item.credit_id,
      gender: item.gender,
      id: item.id,
      knownForDepartment: item.known_for_department,
      name: item.name,
      order: item.order,
      originalName: item.original_name,
      popularity: item.popularity,
      profilePath: item.profile_path,
    })),
    crew: credits.crew.map(item => ({
      adult: item.adult,
      creditId: item.credit_id,
      department: item.department,
      gender: item.gender,
      id: item.id,
      job: item.job,
      knownForDepartment: item.known_for_department,
      name: item.name,
      originalName: item.original_name,
      popularity: item.popularity,
      profilePath: item.profile_path,
    })),
  }
}

export function mapVideos(videos: TmdbMovieDetailsDto['videos']): MediaDetailsBase['videos'] {
  return {
    results: videos.results.map(video => ({
      id: video.id,
      iso31661: video.iso_3166_1,
      iso6391: video.iso_639_1,
      key: video.key,
      name: video.name,
      official: video.official,
      publishedAt: video.published_at,
      site: video.site,
      size: video.size,
      type: video.type,
    })),
  }
}
