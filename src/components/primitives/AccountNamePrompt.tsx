import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { FaExclamationTriangle, FaImages, FaInfoCircle, FaQuestionCircle, FaSave, FaSpinner } from 'react-icons/fa'
import { queryClient } from '~/util'
import useImageHost, { IMAGE_HOST_KEY } from '../hooks/useImageHost'

const QUERY_KEY = ['user-gw2-account']

export default function AccountNamePrompt() {
  const { data, isLoading } = useQuery(QUERY_KEY, () => fetch('/api/internal/user').then((r) => r.json()))
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const imageHost = useImageHost()
  return (
    <form
      onSubmit={async (e) => {
        setIsSaving(true)
        try {
          e.preventDefault()
          const gw2Account = (e.currentTarget.elements.namedItem('gw2Account') as HTMLInputElement | null)?.value.trim()
          const result = await fetch('/api/internal/user', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gw2Account }),
          }).then((r) => r.json())
          queryClient.setQueryData(QUERY_KEY, () => ({ gw2Account: result.gw2Account }))
        } catch (e) {
          console.error(e)
          setError('An unknown error occurred, please try again')
        } finally {
          setIsSaving(false)
        }
      }}
      className="bg-brown-brushed flex flex-col gap-0.5 px-5 pt-2 pb-5"
    >
      <h3 className="gwfont text-lg text-center mb-1">Account Options</h3>
      <h4 className="gwfont">Account Name</h4>
      <div className="flex flex-row justify-center items-center gap-2">
        <input
          className="px-4 py-1 rounded-md text-black"
          type="text"
          placeholder="XXXX.1234..."
          name="gw2Account"
          defaultValue={data?.gw2Account}
          pattern=".+\.[0-9]{4}"
        />
        <button
          disabled={isSaving || isLoading}
          className="gwfont flex flex-row justify-center items-center gap-2 bg-black-brushed px-5 py-2 rounded-md hover:scale-110 transition-transform"
        >
          {isSaving || isLoading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <>
              <FaSave />
            </>
          )}{' '}
          {isLoading ? null : 'Save'}
        </button>
      </div>
      <span className="flex flex-row gap-2 justify-center items-center text-xs text-opacity-85 text-white text-center max-w-xs -mt-0.5">
        <FaInfoCircle /> XXXX.1234
      </span>
      <span className="flex flex-row gap-2 justify-center items-center text-xs text-opacity-85 text-white text-center max-w-xs -mt-1 mb-1">
        <FaQuestionCircle /> This is optional - used to send ranked games rewards
      </span>
      {error ? (
        <p className="text-red-600 text-center flex flex-row gap-2 justify-center items-center">
          <FaExclamationTriangle /> {error}
        </p>
      ) : null}
      <h4 className="gwfont pt-2">Image Host</h4>

      <div
        className="gwfont flex flex-row justify-center items-center gap-2 bg-black-brushed px-5 py-2 mb-1 rounded-md hover:scale-110 transition-transform"
        onClick={() => {
          const current = localStorage.getItem(IMAGE_HOST_KEY)
          let newHost = 'mael-cdn.com'
          if (current === 'mael-cdn.com') {
            newHost = 'maael.xyz'
          } else if (current === 'maael.xyz') {
            newHost = 'mael-cdn.com'
          }
          localStorage.setItem(IMAGE_HOST_KEY, newHost)
          window.location.reload()
        }}
      >
        <FaImages /> Swap Host
      </div>
      <input
        className="px-4 py-1 rounded-md text-black mb-2 text-center"
        type="text"
        placeholder="Image Host..."
        name="imageHost"
        value={imageHost}
        disabled
      />
      <span className="flex flex-row gap-2 justify-center items-center text-xs text-opacity-85 text-white text-center max-w-xs -mt-1 mb-1">
        <FaQuestionCircle /> Only change this if you're having issues seeing images
      </span>
    </form>
  )
}
