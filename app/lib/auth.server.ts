import { accessTokenCookie } from '~/routes/.server'

export async function getToken(request: Request) {
  const token = await accessTokenCookie.parse(request.headers.get('Cookie'))
  if (!token) {
    return null
    // throw new Error('Missing token')
  }
  return token as string
}
