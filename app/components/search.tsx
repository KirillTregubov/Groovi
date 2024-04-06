import { useFetcher } from '@remix-run/react'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import type { SearchResults } from '~/lib/types'

export default function Search({
  inputName = undefined
}: {
  inputName: string | undefined
}) {
  const fetcher = useFetcher<{ results: SearchResults }>({ key: 'search' })
  const [hiddenInputValue, setHiddenInputValue] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null)

  useEffect(() => {
    if (fetcher.data?.results?.items && fetcher.data.results.items.length > 0) {
      console.log(fetcher.data.results)
      setSearchResults(fetcher.data.results)
      setHiddenInputValue(fetcher.data.results.items[0].uri)
    }
  }, [fetcher.data])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData()
    formData.append('_action', 'search')
    formData.append('search', e.target.value)
    fetcher.submit(formData, { method: 'POST' })
  }

  return (
    <>
      <input
        hidden
        readOnly
        type="text"
        name={inputName}
        value={hiddenInputValue}
      />
      <input
        type="text"
        placeholder="Search"
        name="search"
        onChange={handleSearchChange}
      />
      {searchResults && (
        <ul className="flex w-fit flex-col ">
          {searchResults.items.map((item) => (
            <li key={item.uri}>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  setHiddenInputValue(item.uri)
                }}
                className={clsx(
                  'flex w-full cursor-pointer items-center gap-2 rounded-md px-6 py-3',
                  item.uri === hiddenInputValue
                    ? 'bg-green-50 hover:bg-green-100'
                    : 'hover:bg-gray-100'
                )}
              >
                <img
                  src={item.album.images[0].url}
                  alt={`Cover for ${item.album.name}`}
                  className="size-12 rounded-sm"
                />
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5 font-medium">
                    {item.name}
                    {item.explicit && (
                      <span className="rounded-sm bg-gray-300 px-1.5 pb-px text-sm font-normal text-gray-950">
                        E
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {item.artists[0].name}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
      {/* <pre>{JSON.stringify(fetcher.data, null, 2)}</pre> */}
    </>
  )
}
