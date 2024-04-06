// app/routes/resources/customers.tsx
import {
  //LoaderFunctionArgs,
  json
} from '@remix-run/node'
// import { getToken } from '~/lib/auth.server'

// { request }: LoaderFunctionArgs
export async function loader() {
  await new Promise((resolve) => setTimeout(resolve, 5000))

  return json({ message: `Hello, ` })
  //   const token = await getToken(request)

  //   const response = await fetch(
  //     'https://api.spotify.com/v1/artists/4Z8W4fKeB5YxbusRsdQVPb',
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       }
  //     }
  //   )
  //   const data = await response.json()
  //   return json(data)
}
