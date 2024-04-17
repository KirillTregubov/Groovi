import { useEffect, useState } from 'react'

export default function Player({ token }: { token: string }) {
  const [ready, setReady] = useState(false)
  const [player, setPlayer] = useState<SpotifyPlayerInstance | null>(null)
  const [playerState, setPlayerState] = useState<WebPlaybackState | null>(null)
  // const [is_paused, setPaused] = useState(false)
  // const [is_active, setActive] = useState(false)
  // const [current_track, setTrack] = useState(null)

  useEffect(() => {
    if (!token) {
      return
    }

    if (!document.getElementById('spotify-player')) {
      const script = document.createElement('script')
      script.id = 'spotify-player'
      script.src = 'https://sdk.scdn.co/spotify-player.js'
      script.async = true
      document.body.appendChild(script)
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      setReady(true)
    }
  }, [token])

  useEffect(() => {
    if (!ready) {
      return
    }

    console.log('running')
    const player = new window.Spotify.Player({
      name: 'Groovi Player',
      getOAuthToken: (cb) => {
        cb(token)
      },
      volume: 0.5
      // enableMediaSession: true
    })

    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id)
      play()
    })

    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id)
    })

    player.addListener('initialization_error', ({ message }) => {
      console.error(`Failed to initialize: ${message}`)
    })

    player.addListener('authentication_error', ({ message }) => {
      console.error(`Failed to initialize: ${message}`)
    })

    player.addListener('playback_error', ({ message }) => {
      console.error(`Failed to perform playback: ${message}`)
    })

    player.addListener('account_error', ({ message }) => {
      console.error(`Failed to perform playback: ${message}`)
    })

    player.addListener('player_state_changed', (state) => {
      // if (!state) {
      //   return
      // }

      // setTrack(state.track_window.current_track)
      // setPaused(state.paused)

      // player.getCurrentState().then((state) => {
      //   !state ? setActive(false) : setActive(true)
      // })
      console.log('Player State Changed', state)
      setPlayerState(state)
    })

    player.connect()
    setPlayer(player)

    async function play() {
      const val = await player.getCurrentState().then((state) => {
        if (!state) {
          console.error(
            'User is not playing music through the Web Playback SDK'
          )
          return
        }

        const current_track = state.track_window.current_track
        const next_track = state.track_window.next_tracks[0]

        console.log('Currently Playing', current_track)
        console.log('Playing Next', next_track)
      })
      console.log(val)
    }

    return () => {
      player.disconnect()
    }
  }, [ready, token])

  return (
    <div>
      <h1>Player</h1>
      {player && (
        <button onClick={() => player?.togglePlay()}>Toggle Play</button>
      )}
      <pre>{JSON.stringify(player, null, 2)}</pre>
      <pre>{JSON.stringify(playerState, null, 2)}</pre>
    </div>
  )
}
