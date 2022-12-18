/* eslint-disable @next/next/no-img-element */
import React from 'react'
import dynamic from 'next/dynamic'
import cls from 'classnames'
import { FaClock, FaMapPin, FaSave, FaSpinner, FaUser } from 'react-icons/fa'
import format from 'date-fns/format'
import { ChallengeOption } from '~/types'
const Gw2Map = dynamic(() => import('~/components/primitives/Map'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
})

function useSubmissions() {
  const [submissions, setSubmissions] = React.useState<{ data: any[]; error?: string }>({ data: [], error: undefined })
  const getData = React.useCallback(async () => {
    const data = await fetch('/api/submissions').then((r) => r.json())
    setSubmissions(data)
  }, [])
  React.useEffect(() => {
    void getData()
  }, [getData])
  return { submissions: submissions.data || [], error: submissions.error, refresh: getData }
}

function SubmissionItem({
  item,
  onApprove,
  onRemove,
  isApproved,
  isRemoved,
}: {
  item: any
  onApprove: () => void
  isApproved: boolean
  onRemove: () => void
  isRemoved: boolean
}) {
  return (
    <div className="flex flex-col gap-1 mx-5">
      <div className="flex flex-row gap-2 justify-around items-center">
        <h3 className="flex flex-row gap-2 justify-center items-center text-xl text-center">
          <FaUser /> {item?.account || 'Unknown'}
        </h3>
        <h3 className="flex flex-row gap-2 justify-center items-center text-xl text-center">
          <FaClock /> {item?.createdAt ? format(new Date(item?.createdAt), 'HH:mm dd/MM/yy') : 'Unknown'}
        </h3>
        <h3 className="flex flex-row gap-2 justify-center items-center text-xl text-center">
          <FaMapPin /> {item?.mapId || 'Unknown'}
        </h3>
      </div>
      <div className="flex flex-row">
        <img
          className="w-1/2 mx-auto aspect-video bg-white bg-opacity-5 rounded-md flex justify-center items-center"
          src={item?.image}
        />
        <div className="w-1/2">
          <Gw2Map showGuessLocation guessLocation={item?.location} guessId={item?._id} onGuess={() => undefined} />
        </div>
      </div>
      <div className="flex flex-row items-center justify-around my-1 text-2xl">
        <button
          className={cls('bg-red-700 rounded-md px-4 py-1 transition-transform hover:scale-105', {
            'opacity-40': isApproved,
          })}
          disabled={isApproved}
          onClick={onRemove}
        >
          Remove{isRemoved ? 'd' : ''}
        </button>
        <button
          className={cls('bg-green-700 rounded-md px-4 py-1 transition-transform hover:scale-105', {
            'opacity-40': isRemoved,
          })}
          disabled={isRemoved}
          onClick={onApprove}
        >
          Approve{isApproved ? 'd' : ''}
        </button>
      </div>
    </div>
  )
}

export default function SubmissionsControl() {
  const { submissions, error, refresh } = useSubmissions()
  const [toApprove, setToApprove] = React.useState<any[]>([])
  const [toRemove, setToRemove] = React.useState<any[]>([])
  const [saving, setSaving] = React.useState(false)
  return (
    <div className="text-white flex-1 flex flex-col">
      <h1 className="text-3xl text-center mb-5">Submissions ({submissions.length})</h1>
      {error ? <h4 className="text-lg text-center text-red-600">Error: {error}</h4> : null}
      <div className="flex flex-col gap-2 fixed top-10 right-10 z-50">
        <button
          className="bg-brown-brushed flex flex-row gap-2 justify-center items-center px-8 py-2 rounded-full text-4xl shadow-md"
          onClick={async () => {
            try {
              setSaving(true)
              const newChallengeOptions: Omit<ChallengeOption, 'id'>[] = toApprove.map((s) => ({
                image: `https://gw2-sightseeing.mael-cdn.com${new URL(s.image).pathname}`,
                mapId: s.mapId,
                account: s.account,
                location: s.location,
              }))
              console.info({ toApprove, toRemove, newChallengeOptions })
              const creation = await fetch('/api/internal/options', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(newChallengeOptions),
              })
              if (!creation.ok) throw new Error('Failed to create submissions')
              const deletion = await fetch(
                `/api/submissions?ids=${toRemove
                  .concat(toApprove)
                  .map((r) => r._id)
                  .join(',')}`,
                {
                  method: 'DELETE',
                }
              )
              if (!deletion.ok) throw new Error('Failed to delete submissions')
              await refresh()
              setToApprove([])
              setToRemove([])
            } catch (e) {
              console.error('[save]', e)
            } finally {
              setSaving(false)
            }
          }}
        >
          {saving ? <FaSpinner className="animate-spin" /> : <FaSave />} Sav{saving ? 'ing' : 'e'}
        </button>
        <div className="flex flex-col gap-1 bg-brown-brushed px-4 pt-2 pb-4 rounded-2xl shadow-md text-lg">
          <div className="flex flex-row text-green-500">
            <div className="flex-1">Approved:</div>
            <div className="flex-1 text-right">{toApprove.length}</div>
          </div>
          <div className="flex flex-row text-red-500">
            <div className="flex-1">Removed:</div>
            <div className="flex-1 text-right">{toRemove.length}</div>
          </div>
          <div className="flex flex-row text-white">
            <div className="flex-1">Submissions:</div>
            <div className="flex-1 text-right">{submissions.length}</div>
          </div>
          <div className="flex flex-row text-white border-t border-white">
            <div className="flex-1">Remaining:</div>
            <div className="flex-1 text-right">{submissions.length - (toApprove.length + toRemove.length)}</div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-4">
        {submissions.map((s) => (
          <SubmissionItem
            key={s._id}
            item={s}
            onApprove={() =>
              setToApprove((a) => {
                let items = [...a]
                if (a.some((i) => i._id === s._id)) {
                  items = items.filter((i) => i._id !== s._id)
                } else {
                  items = items.concat(s)
                }
                return items
              })
            }
            onRemove={() =>
              setToRemove((r) => {
                let items = [...r]
                if (r.some((i) => i._id === s._id)) {
                  items = items.filter((i) => i._id !== s._id)
                } else {
                  items = items.concat(s)
                }
                return items
              })
            }
            isApproved={toApprove.some((i) => i._id === s._id)}
            isRemoved={toRemove.some((i) => i._id === s._id)}
          />
        ))}
      </div>
    </div>
  )
}
