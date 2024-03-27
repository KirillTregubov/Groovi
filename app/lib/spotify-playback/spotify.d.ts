interface WebPlaybackState {
  context: {
    uri: string
    metadata: object
  }
  disallows: {
    pausing?: boolean
    peeking_next?: boolean
    peeking_prev?: boolean
    resuming?: boolean
    seeking?: boolean
    skipping_next?: boolean
    skipping_prev?: boolean
  }
  duration: number
  paused: boolean
  position: number
  repeat_mode: 0 | 1 | 2 // The repeat mode. No repeat mode is 0,
  // repeat context is 1 and repeat track is 2.
  shuffle: boolean // True if shuffled, false otherwise.
  track_window: {
    current_track: WebPlaybackTrack
    previous_tracks: WebPlaybackTrack[]
    next_tracks: WebPlaybackTrack[]
  }
}

interface ReadyArgs {
  device_id: string
}

interface MessageArgs {
  message: string
}

interface SpotifyPlayerInstance {
  connect: () => Promise<boolean>
  disconnect: () => void
  addListener: {
    (event: 'ready', cb: ({ device_id }: ReadyArgs) => void): boolean
    (event: 'not_ready', cb: ({ device_id }: ReadyArgs) => void): boolean
    (
      event: 'initialization_error',
      cb: ({ message }: MessageArgs) => void
    ): boolean
    (
      event: 'authentication_error',
      cb: ({ message }: MessageArgs) => void
    ): boolean
    (event: 'account_error', cb: ({ message }: MessageArgs) => void): boolean
    (event: 'playback_error', cb: ({ message }: MessageArgs) => void): boolean
    (
      event: 'player_state_changed',
      cb: (state: WebPlaybackState) => void
    ): boolean
    (event: string, cb: (args: unknown) => void): boolean
  }
  removeListener: (
    event: string,
    cb?: (args: CallbackArguments) => void
  ) => boolean
  getCurrentState: () => Promise<WebPlaybackState>
  setName: (name: string) => Promise<undefined>
  getVolume: () => Promise<number>
  setVolume: (volume: number) => Promise<undefined>
  pause: () => Promise<undefined>
  resume: () => Promise<undefined>
  togglePlay: () => Promise<undefined>
  seek: (position: number) => Promise<undefined>
  previousTrack: () => Promise<undefined>
  nextTrack: () => Promise<undefined>
  activateElement: () => Promise<undefined>
}

interface SpotifyInitOptions {
  name: string
  getOAuthToken: (cb: (token: string) => void) => void
  volume?: number
  enableMediaSession?: boolean
}

interface Window {
  playerInstance: SpotifyPlayerInstance | null
  Spotify: {
    Player: new (props: SpotifyInitOptions) => SpotifyPlayerInstance
  }
  // The onSpotifyWebPlaybackSDKReady method will be automatically called once the Web Playback SDK has successfully loaded.
  onSpotifyWebPlaybackSDKReady(): void
}
