import { ActionFunctionArgs } from '@remix-run/node'
import { AUTH_REDIRECT_URL, SCOPES, codeVerifierCookie } from '../lib/server'

const generateRandomString = (length: number) => {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const values = crypto.getRandomValues(new Uint8Array(length))
  return values.reduce((acc, x) => acc + possible[x % possible.length], '')
}

const sha256 = async (plain: string) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return crypto.subtle.digest('SHA-256', data)
}

const base64encode = (input: ArrayBuffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

const getHash = async (input: string) => {
  return base64encode(await sha256(input))
}

export const loader = async () => {
  throw new Response(null, {
    status: 404,
    statusText: 'Not Found'
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    throw new Response(null, {
      status: 405,
      statusText: 'Method Not Allowed'
    })
  }

  const client_id = process.env.SPOTIFY_CLIENT_ID
  if (!client_id) {
    throw new Error('Missing SPOTIFY_CLIENT_ID')
  }

  const codeVerifier = generateRandomString(64)
  const code_challenge = await getHash(codeVerifier)

  const authURL = new URL('https://accounts.spotify.com/authorize')
  authURL.search = new URLSearchParams({
    client_id,
    response_type: 'code',
    redirect_uri: AUTH_REDIRECT_URL,
    scope: SCOPES,
    code_challenge_method: 'S256',
    code_challenge
  }).toString()
  return new Response(null, {
    status: 302,
    headers: {
      Location: authURL.toString(),
      'Set-Cookie': await codeVerifierCookie.serialize(codeVerifier)
    }
  })
}

export default function Auth() {}
