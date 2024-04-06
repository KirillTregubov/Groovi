import { redirect } from '@remix-run/node'
import { accessTokenCookie } from './server'

export type Token = string

export async function logout() {
  return redirect('/', {
    headers: {
      'Set-Cookie': await accessTokenCookie.serialize('', { maxAge: 1 }),
      'Content-Type': 'text/plain'
    }
  })
}

export async function getToken(request: Request) {
  const token = await accessTokenCookie.parse(request.headers.get('Cookie'))
  if (!token) {
    return null
    // throw new Error('Missing token')
  }
  return token as Token
}

export async function requireToken(request: Request) {
  const token = await getToken(request)
  if (!token) {
    // Logout screen
    throw redirect('/')
  }

  return token as Token
}
