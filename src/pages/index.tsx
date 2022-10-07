import * as React from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'

const Map = dynamic(() => import('~/components/primitives/Map'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
})

const options: Array<{
  id: string
  image: string
  location: [number | null, number | null]
}> = [
  {
    id: 'ce6fb458-8523-4c70-a1a1-35c4ffc8aad8.jpg',
    image: 'https://gw2-sightseeing-app.s3.us-west-2.amazonaws.com/new_group/ce6fb458-8523-4c70-a1a1-35c4ffc8aad8.jpg',
    location: [45136, 29864],
  },
  {
    id: 'bc1f4a36-23ed-450d-b73a-debd5fa0cb89',
    image:
      'https://gw2-sightseeing-app.s3.us-west-2.amazonaws.com/63276040328b845fd0dac05a/bc1f4a36-23ed-450d-b73a-debd5fa0cb89.jpg',
    location: [37988, 32718],
  },
  {
    id: '36094a2c-a7e3-44c2-a52f-40b3bdd0877a',
    image:
      'https://gw2-sightseeing-app.s3.us-west-2.amazonaws.com/63276040328b845fd0dac05a/36094a2c-a7e3-44c2-a52f-40b3bdd0877a.jpg',
    location: [38714, 37092],
  },
  {
    id: 'f51eef90-1cb9-4669-8e7e-baea846b7c44',
    image:
      'https://gw2-sightseeing-app.s3.us-west-2.amazonaws.com/63276040328b845fd0dac05a/f51eef90-1cb9-4669-8e7e-baea846b7c44.jpg',
    location: [49704, 39984],
  },
  {
    id: 'ab9d667f-38d1-446f-bc78-0864c872edd4',
    image:
      'https://gw2-sightseeing-app.s3.us-west-2.amazonaws.com/63276040328b845fd0dac05a/ab9d667f-38d1-446f-bc78-0864c872edd4.jpg',
    location: [37988, 32718],
  },
]

export default function Index() {
  const [game, setGame] = React.useState<
    Array<{
      id: string
      image: string
      location: [number | null, number | null]
      score?: null | number
    }>
  >([options[0]])
  const lastItem = game[game.length - 1]
  const total = game.reduce((acc, g) => acc + (g.score || 0), 0)
  return (
    <div suppressHydrationWarning className="bg-purple-300 text-purple-800 flex justify-center items-center">
      <div className="flex flex-row bg-green-200 w-full h-full justify-center items-center">
        <div className="relative aspect-video w-full bg-slate-500 max-h-full">
          <Image src={lastItem?.image} layout="fill" />
        </div>
      </div>
      <div className="flex flex-col absolute top-10 right-0 bg-gray-300 pl-10 pr-20 py-2 text-xl rounded-l-full">
        <div>Round: {game.length}/5</div>
        <div>Score: {total}</div>
      </div>
      {lastItem.score !== null && lastItem.score !== undefined && game.length <= 5 ? (
        <button
          className="flex flex-col absolute bottom-10 bg-gray-300 pl-10 pr-10 py-2 text-xl rounded-full"
          onClick={() => {
            setGame((g) => {
              return g.concat(options[game.length % options.length])
            })
          }}
        >
          Next
        </button>
      ) : null}
      <div className="absolute bottom-10 right-10 w-1/2 h-3/5 scale-50 hover:scale-100 origin-bottom-right transition-all opacity-50 hover:opacity-100">
        <Map
          guessId={lastItem?.id}
          guessLocation={lastItem?.location}
          showGuessLocation={typeof lastItem?.score === 'number'}
          onGuess={(score) => {
            setGame((g) => {
              const last = { ...g[g.length - 1], score }
              return g.slice(0, -1).concat(last)
            })
          }}
        />
      </div>
      {game.length === 5 && game.every((g) => typeof g.score === 'number') ? (
        <div className="bg-opacity-50 bg-gray-800 absolute inset-0">
          <div className="flex flex-col absolute inset-1/4 bg-gray-300 px-10 py-2 text-xl rounded-md">
            Done!
            <div className="flex flex-col gap-1">
              {game.map((g, i) => (
                <div key={g.id} className="flex flex-row gap-1">
                  <div>{i + 1}.</div>
                  <div className="h-24 aspect-video relative">
                    <Image src={g.image} layout="fill" />
                  </div>
                  <div>{g.score}</div>
                </div>
              ))}
            </div>
            <div>Total: {total}</div>
            <button onClick={() => setGame([options[0]])}>Restart</button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
