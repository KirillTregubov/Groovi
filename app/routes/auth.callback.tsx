import { LoaderFunctionArgs, redirect } from '@remix-run/node'
import {
  AUTH_REDIRECT_URL,
  accessTokenCookie,
  codeVerifierCookie,
  refreshTokenCookie
} from '../lib/server'

const TOKEN_URL = 'https://accounts.spotify.com/api/token'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  if (!code) {
    throw new Response(null, {
      status: 400,
      statusText: 'Bad Request'
    })
  }

  const client_id = process.env.SPOTIFY_CLIENT_ID
  if (!client_id) {
    throw new Error('Missing Spotify client ID')
  }

  const code_verifier = await codeVerifierCookie.parse(
    request.headers.get('Cookie')
  )
  if (!code_verifier) {
    throw new Error('Missing PKCE code verifier')
  }

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: client_id,
      grant_type: 'authorization_code',
      code,
      redirect_uri: AUTH_REDIRECT_URL,
      code_verifier
    })
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error_description)
  }

  const headers = new Headers({
    'Content-Type': 'application/json'
  })
  headers.append('Set-Cookie', await codeVerifierCookie.serialize(''))
  headers.append(
    'Set-Cookie',
    await accessTokenCookie.serialize(data.access_token, {
      maxAge: data.expires_in
    })
  )
  headers.append(
    'Set-Cookie',
    await refreshTokenCookie.serialize(data.refresh_token)
  )

  return redirect('/', {
    headers
  })
}
