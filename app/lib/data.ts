import { redirect } from '@remix-run/node'
import { Token } from './auth.server'

/**
 * @see: {@link https://developer.spotify.com/documentation/web-api/reference/get-information-about-the-users-current-playback}
 */
export async function getPlayer({ token }: { token: Token }) {
  const response = await fetch('https://api.spotify.com/v1/me/player', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  if (response.status === 204) {
    return null
  }
  const data = await response.json()
  if ('error' in data) {
    // 403, 429
    if (data.status === 401) {
      throw redirect('/auth/logout')
    }
    throw new Error(data.error.message)
  }
  // TODO: add zod
  return data as object
}

/**
 * @see: {@link https://developer.spotify.com/documentation/web-api/reference/get-queue}
 */
export async function getQueue({ token }: { token: Token }) {
  const response = await fetch('https://api.spotify.com/v1/me/player/queue', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  const data = await response.json()
  if ('error' in data) {
    // 403, 429
    if (data.status === 401) {
      throw redirect('/auth/logout')
    }
    throw new Error(data.error.message)
  }
  return data
}

/**
 * @see: {@link https://developer.spotify.com/documentation/web-api/reference/add-to-queue}
 */
export async function addToQueue({
  token,
  song_uri,
  device_id = undefined
}: {
  token: Token
  song_uri: string
  device_id?: string
}) {
  const params = {
    uri: song_uri
  } as {
    uri: string
    device_id?: string
  }
  if (device_id) {
    params['device_id'] = device_id
  }

  const response = await fetch(
    'https://api.spotify.com/v1/me/player/queue?' + new URLSearchParams(params),
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  if (response.status === 204) {
    return { ok: true, errors: null }
  }
  const data = await response.json()
  // 403, 429
  if (data.status === 401) {
    throw redirect('/auth/logout')
  }

  return { ok: false, errors: { message: data.error.message } }
}

export async function searchForTracks({
  token,
  q
}: {
  token: Token
  q: string
}) {
  const response = await fetch(
    'https://api.spotify.com/v1/search?' +
      new URLSearchParams({
        q,
        type: 'track',
        limit: '3'
      }),
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
      //   signal: request.signal
    }
  )
  const results = await response.json()
  if ('error' in results) {
    if (results.status === 401) {
      redirect('/auth/logout')
    }
    return { ok: false, errors: { message: results.error.message } }
  }

  return { ok: true, errors: null, results: results.tracks }
}
