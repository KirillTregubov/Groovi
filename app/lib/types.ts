export type TrackObject = {
  id: string
  uri: string
  name: string
  artists: { name: string }[]
  album: { images: { url: string }[]; name: string }
  explicit: boolean
}

export type SearchResults = {
  items: Array<TrackObject>
  offset: number
  total: number
}
