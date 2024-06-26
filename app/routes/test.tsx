import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  TypedResponse,
  json
} from '@remix-run/node'
import {
  Form,
  ShouldRevalidateFunctionArgs,
  useActionData,
  useLoaderData,
  useNavigation,
  useRevalidator
} from '@remix-run/react'
import { useEffect } from 'react'
// import Player from '~/components/player'
import Search from '~/components/search'
import useVisibility from '~/hooks/useVisibility'
import { requireToken } from '~/lib/auth.server'
import { getQueue, addToQueue, searchForTracks } from '~/lib/data'
import type { TrackObject } from '~/lib/types'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const token = await requireToken(request)
  // const player = await getPlayer(token)
  const queue = await getQueue({ token })
  return json(queue)
}

export const action = async ({
  request
}: ActionFunctionArgs): Promise<
  TypedResponse<{
    ok: boolean
    errors: { message?: string; song?: string; search?: string } | null
  }>
> => {
  if (request.method !== 'POST') {
    return json(
      { ok: false, errors: { message: 'Method not allowed' } },
      { status: 405 }
    )
  }

  const token = await requireToken(request)

  const formData = await request.formData()
  const _action = (await formData.get('_action')) as string

  if (_action === 'search') {
    const search = (await formData.get('search')) as string
    if (!search) {
      return json(
        { ok: false, errors: { search: 'Missing search' } },
        { status: 400 }
      )
    }

    const results = await searchForTracks({ token, q: search })
    return json(results)
  } else if (_action === 'queue') {
    const song = (await formData.get('song')) as string
    if (!song) {
      return json(
        { ok: false, errors: { song: 'Missing song' } },
        { status: 400 }
      )
    }

    const queueStatus = await addToQueue({ token, song_uri: song })
    if (queueStatus.ok === false) {
      return json({ ok: false, errors: queueStatus.errors }, { status: 400 })
    }

    return json({ ok: true, errors: null, queueStatus })
  } else {
    return json(
      { ok: false, errors: { message: 'Action not found' } },
      { status: 400 }
    )
  }
}

export function shouldRevalidate({
  actionResult,
  defaultShouldRevalidate
}: ShouldRevalidateFunctionArgs) {
  if (actionResult?.ok === false) {
    return false
  }
  return defaultShouldRevalidate
}

export default function SpotiRequest() {
  const navigation = useNavigation()
  const revalidator = useRevalidator()
  const actionData = useActionData<typeof action>()
  const data = useLoaderData<typeof loader>()
  const visibility = useVisibility()

  useEffect(() => {
    if (!window) {
      return
    }

    const interval = window.setInterval(() => {
      if (!visibility) {
        return
      }
      visibility && revalidator.revalidate()
    }, 2000)

    return () => {
      window.clearInterval(interval)
    }
  })

  return (
    <main className="p-4">
      <h1>SpotiRequest</h1>
      <Form method="post" className="py-4">
        <div>
          <Search inputName="song" />
          {actionData?.errors?.song && <div>{actionData?.errors.song}</div>}
        </div>
        {actionData?.errors?.message && <div>{actionData?.errors.message}</div>}
        <button
          type="submit"
          name="_action"
          value="queue"
          disabled={data.currently_playing === null}
          title={data.currently_playing === null ? 'No active device' : ''}
          className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-500"
        >
          {navigation.formAction === '/test' && <div>Loading...</div>}
          Add to Queue
        </button>
      </Form>
      {/* <Player token={data.token} /> */}
      {/* <pre>{JSON.stringify(data.currently_playing, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(data.queue, null, 2)}</pre> */}
      {/* TODO: queue doesn't update when playback updates */}
      <div>
        <h2>Queue</h2>
        {data.queue.map((item: TrackObject, index: number) => (
          <div key={`${item.id}-${index}`} className="p-2">
            <img
              src={item.album.images[0].url}
              alt={`Cover for ${item.album.name}`}
              className="size-8 rounded-sm"
            />
            <div>{item.name}</div>
            <div>{item.artists[0].name}</div>
          </div>
        ))}
      </div>
    </main>
  )
}
