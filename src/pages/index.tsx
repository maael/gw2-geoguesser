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
    image: 'https://gw2-sightseeing.maael.xyz/new_group/ce6fb458-8523-4c70-a1a1-35c4ffc8aad8.jpg',
    location: [45136, 29864],
  },
  {
    id: 'bc1f4a36-23ed-450d-b73a-debd5fa0cb89',
    image: 'https://gw2-sightseeing.maael.xyz/63276040328b845fd0dac05a/bc1f4a36-23ed-450d-b73a-debd5fa0cb89.jpg',
    location: [37988, 32718],
  },
  {
    id: '36094a2c-a7e3-44c2-a52f-40b3bdd0877a',
    image: 'https://gw2-sightseeing.maael.xyz/63276040328b845fd0dac05a/36094a2c-a7e3-44c2-a52f-40b3bdd0877a.jpg',
    location: [38714, 37092],
  },
  {
    id: 'f51eef90-1cb9-4669-8e7e-baea846b7c44',
    image: 'https://gw2-sightseeing.maael.xyz/63276040328b845fd0dac05a/f51eef90-1cb9-4669-8e7e-baea846b7c44.jpg',
    location: [49704, 39984],
  },
  {
    id: 'ab9d667f-38d1-446f-bc78-0864c872edd4',
    image: 'https://gw2-sightseeing.maael.xyz/63276040328b845fd0dac05a/ab9d667f-38d1-446f-bc78-0864c872edd4.jpg',
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
    <div suppressHydrationWarning className="ptfont bg-black-brushed bg-gray-900 flex justify-center items-center">
      <div className="flex flex-row w-full h-full justify-center items-center">
        <div className="relative aspect-video w-full bg-slate-500 max-h-full">
          <Image src={lastItem?.image} layout="fill" />
        </div>
      </div>
      <div className="bg-brown-brushed flex flex-col absolute top-10 right-0 text-white pl-12 pr-20 py-2 bg-black text-lg md:text-3xl rounded-l-full shadow-md border-b border-black">
        <div>Round: {game.length}/5</div>
        <div>Score: {total}</div>
      </div>
      {lastItem.score !== null && lastItem.score !== undefined && game.length <= 5 ? (
        <button
          className="gwfont bg-brown-brushed text-white hover:scale-125 transition-transform flex flex-col absolute bottom-10 px-10 py-2 text-2xl border-b border-black shadow-md rounded-full"
          onClick={() => {
            setGame((g) => {
              return g.concat(options[game.length % options.length])
            })
          }}
        >
          Next
        </button>
      ) : null}
      <div className="absolute bottom-10 right-10 w-5/6 lg:w-1/2 aspect-video scale-50 hover:scale-100 origin-bottom-right transition-all opacity-50 hover:opacity-100 shadow-lg overflow-hidden rounded-xl">
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
        <div className="bg-opacity-50 bg-gray-800 absolute inset-0 flex flex-col justify-center items-center">
          <div className="flex flex-col text-white bg-brown-brushed shadow-lg border-b border-black px-10 py-5 justify-center text-xl md:w-1/3 m-3">
            <h2 className="gwfont text-5xl text-center">Finished!</h2>
            <div className="flex flex-col gap-1 mt-3">
              {game.map((g, i) => (
                <div key={g.id} className="flex flex-row items-center gap-1 bg-black-brushed px-10 py-2">
                  <div className="pr-10">{i + 1}.</div>
                  <div className="h-20 aspect-video relative">
                    <Image src={g.image} layout="fill" />
                  </div>
                  <div className="text-right flex-1">Score: {g.score}</div>
                </div>
              ))}
            </div>
            <div className="gwfont text-4xl text-center py-3">Total: {total}</div>
            <div className="flex flex-row justify-center items-center">
              <button
                className="gwfont bg-black-brushed text-white hover:scale-125 transition-transform flex flex-col px-10 py-2 text-2xl border-b border-black shadow-md rounded-full"
                onClick={() => setGame([options[0]])}
              >
                Restart
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
