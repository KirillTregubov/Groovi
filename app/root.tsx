import { LinksFunction, MetaFunction } from '@remix-run/node'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError
} from '@remix-run/react'
import stylesheet from '~/tailwind.css?url'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet }
]

export const meta: MetaFunction = () => {
  return [
    { title: 'Groovi' },
    { name: 'description', content: 'Greetings from Groovi!' }
  ]
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary() {
  const error = useRouteError()
  console.error(error)

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <main>
          <h1>Page Not Found</h1>
        </main>
      )
    }

    return (
      <main>
        <h1>{error.statusText}</h1>
      </main>
    )
  }

  return (
    <main>
      <h1>Oh no! An error occurred!</h1>
      {error instanceof Error ? <pre>{error.message}</pre> : null}
    </main>
  )
}
