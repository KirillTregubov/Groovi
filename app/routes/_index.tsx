import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
// import Player from '~/components/player'
import { getToken } from '~/lib/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const token = await getToken(request)
  return json({ token })
}

export default function Index() {
  const { token } = useLoaderData<typeof loader>()

  return (
    <main className="p-4">
      <h1>Groovi</h1>
      {token ? (
        <div>
          <h2>Token</h2>
          <pre>{token}</pre>
          <form method="get" action="/auth/logout">
            <button onClick={() => console.log(token)}>Logout</button>
          </form>
        </div>
      ) : (
        // <SpotiRequest />
        // <Player token={token} />
        <form method="post" action="/auth">
          {/* <label>
          <input name="name" type="text" />
        </label> */}
          <button type="submit">Auth</button>
        </form>
      )}
    </main>
  )
}
