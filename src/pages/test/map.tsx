import * as React from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const Map = dynamic(() => import('~/components/primitives/Map'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
})

export default function TestMap() {
  const { query } = useRouter()
  const [location, setLocation] = React.useState(query.location?.toString() || '0, 0')
  const locationCoords = location
    ?.toString()
    .split(',')
    .map((l) => Number(l.trim())) as [number, number]
  React.useEffect(() => {
    const original = `${location}`
    setLocation(`${location}1`)
    setTimeout(() => setLocation(original), 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="h-full relative">
      <Map
        showGuessLocation={true}
        guessId="test"
        guessLocation={[locationCoords[0] || 0, locationCoords[1] || 0] ?? [0, 0]}
        onGuess={() => undefined}
      />
      <button
        className="bg-gray-200 px-3 py-1 absolute top-3 right-3 rounded-md"
        onClick={() => {
          const original = `${location}`
          setLocation(`${location}1`)
          setTimeout(() => setLocation(original), 1)
        }}
      >
        Center
      </button>
      <input
        className="bg-gray-200 px-3 py-1 absolute top-3 left-16 rounded-md"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location..."
      />
    </div>
  )
}
