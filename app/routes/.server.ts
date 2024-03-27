import { createCookie } from '@remix-run/node' // or cloudflare/deno

export const AUTH_REDIRECT_URL =
  process.env.NODE_ENV === 'production'
    ? '' // TODO: set this to the production URL
    : 'http://localhost:5173/auth/callback'

export const SCOPES =
  'streaming user-read-private user-read-email user-modify-playback-state user-read-currently-playing'

export const codeVerifierCookie = createCookie('code-verifier', {
  maxAge: 600, // 10 minutes
  httpOnly: true,
  secure: true
})

export const accessTokenCookie = createCookie('access-token', {
  maxAge: 3_600, // 1 hour
  httpOnly: true,
  secure: true
})

export const refreshTokenCookie = createCookie('refresh-token', {
  maxAge: 31_536_000, // 1 year
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
})
