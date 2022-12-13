/* eslint-disable @next/next/no-img-element */
import React from 'react'
import dynamic from 'next/dynamic'
import { FaClock, FaMapPin, FaSpinner, FaUser } from 'react-icons/fa'
import format from 'date-fns/format'
const Map = dynamic(() => import('~/components/primitives/Map'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
})

function useSubmissions() {
  const [submissions, setSubmissions] = React.useState({ data: [], error: undefined })
  React.useEffect(() => {
    void (async () => {
      const data = await fetch('/api/submissions').then((r) => r.json())
      setSubmissions(data)
    })()
  }, [])
  return { submissions: submissions.data || [], error: submissions.error }
}

export default function SubmissionsControl() {
  const { submissions, error } = useSubmissions()
  const [idx, setIdx] = React.useState(0)
  const currentSubmission = submissions[idx] as any
  const [applyingDecision, setApplyingDecision] = React.useState(false)
  return (
    <div className="text-white flex-1 flex flex-col">
      <h1 className="text-3xl text-center mb-5">
        Submissions ({idx + 1} of {submissions.length})
      </h1>
      <div className="flex flex-row gap-2 justify-around items-center">
        <h3 className="flex flex-row gap-2 justify-center items-center text-xl text-center mb-5">
          <FaUser /> {currentSubmission?.author || 'Unknown'}
        </h3>
        <h3 className="flex flex-row gap-2 justify-center items-center text-xl text-center mb-5">
          <FaClock />{' '}
          {currentSubmission?.createdAt ? format(new Date(currentSubmission?.createdAt), 'HH:mm dd/MM/yy') : 'Unknown'}
        </h3>
        <h3 className="flex flex-row gap-2 justify-center items-center text-xl text-center mb-5">
          <FaMapPin /> {currentSubmission?.mapId || 'Unknown'}
        </h3>
      </div>
      {error ? <h4 className="text-lg text-center text-red-600">Error: {error}</h4> : null}
      {currentSubmission ? (
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1">
            <img
              className="h-full mx-auto aspect-video bg-white bg-opacity-5 rounded-md flex justify-center items-center"
              src={currentSubmission?.image}
            />
          </div>
          <div className="absolute bottom-16 sm:bottom-2 lg:bottom-24 left-0 sm:left-1/2 lg:left-auto right-0 md:right-10 lg:w-1/2 aspect-video scale-100 lg:scale-50 lg:hover:scale-100 origin-bottom-right transition-all opacity-60 hover:opacity-100 shadow-lg overflow-hidden rounded-xl">
            <Map
              showGuessLocation
              guessLocation={currentSubmission?.location}
              guessId={currentSubmission?._id}
              onGuess={() => undefined}
            />
          </div>
          <div className="flex flex-row items-center justify-around my-5 text-2xl">
            <button
              className="bg-red-700 rounded-md px-4 py-1 transition-transform hover:scale-105"
              onClick={async () => {
                try {
                  setApplyingDecision(true)
                  setIdx((i) => i + 1)
                } finally {
                  setApplyingDecision(false)
                }
              }}
            >
              {applyingDecision ? <FaSpinner className="animate-spin" /> : 'Remove'}
            </button>
            <button
              className="bg-orange-600 rounded-md px-4 py-1 transition-transform hover:scale-105"
              onClick={async () => {
                setIdx((i) => i + 1)
              }}
            >
              Skip
            </button>
            <button
              className="bg-green-700 rounded-md px-4 py-1 transition-transform hover:scale-105"
              onClick={async () => {
                try {
                  setApplyingDecision(true)
                  await fetch(`/api/submissions?id=${currentSubmission?._id}`, { method: 'PUT' })
                  setIdx((i) => i + 1)
                } finally {
                  setApplyingDecision(false)
                }
              }}
            >
              {applyingDecision ? <FaSpinner className="animate-spin" /> : 'Approve'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
