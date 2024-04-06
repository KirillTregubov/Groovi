export type TrackObject = {
  id: string
  name: string
  artists: { name: string }[]
  album: { images: { url: string }[]; name: string }
  uri: string
}

export type SearchResults = {
  items: Array<TrackObject>
  offset: number
  total: number
}
