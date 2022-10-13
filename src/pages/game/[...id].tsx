import * as React from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { CHALLENGE } from '~/types'
import { useRouter } from 'next/router'

const Map = dynamic(() => import('~/components/primitives/Map'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
})

type Game = Array<{
  _id: string
  image: string
  location: [number | null, number | null]
  score?: null | number
}>

async function saveGame(gameType: CHALLENGE, gameId: string | undefined, game: Game) {
  fetch('/api/internal/game', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      challenge: gameId,
      challengeType: gameType,
      totalScore: sumScore(game),
    }),
  })
}

function sumScore(game: Game) {
  return game.reduce((acc, g) => acc + (g.score || 0), 0)
}

function useGameOptions(gameType: CHALLENGE | null) {
  const [game, setGame] = React.useState({ _id: undefined, options: [] })
  const [error, setError] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  React.useEffect(() => {
    if (gameType === null) return // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(async () => {
      try {
        setLoading(true)
        const game = await fetch(`/api/internal/challenge/${gameType}`).then((r) => r.json())
        setGame(game)
      } catch (e) {
        setError(e)
      } finally {
        setLoading(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameType])
  return { game, error, loading }
}

export default function Game() {
  const { query } = useRouter()
  const queryGameType = query.id ? query.id[0] : null
  const gameType =
    queryGameType === CHALLENGE.daily
      ? CHALLENGE.daily
      : queryGameType === CHALLENGE.monthly
      ? CHALLENGE.monthly
      : CHALLENGE.random
  const {
    game: { _id: gameId, options },
    loading,
  } = useGameOptions(queryGameType ? gameType : null)
  return loading ? <div>Loading...</div> : <GameScreen gameId={gameId} options={options} gameType={gameType} />
}

function GameScreen({ options, gameType, gameId }: { options: any; gameType: CHALLENGE; gameId: string | undefined }) {
  const { data: session } = useSession()
  const [game, setGame] = React.useState<Game>([options[0]])
  const maxRounds = options.length || 0
  const lastItem = game[game.length - 1]
  const total = sumScore(game)
  function isFinished(g: Game) {
    return g.length === maxRounds && g.every((gi) => typeof gi.score === 'number')
  }
  return (
    <div
      suppressHydrationWarning
      className="ptfont bg-black-brushed bg-gray-900 flex flex-col justify-center items-center flex-1 w-full"
    >
      <div className="bg-brown-brushed flex flex-col md:absolute md:top-16 right-0 text-white pl-12 pr-20 py-2 bg-black text-lg md:text-3xl rounded-full my-4 md:my-0 md:rounded-l-full drop-shadow-xl">
        <div>
          Round: {game.length}/{maxRounds}
        </div>
        <div>Score: {total}</div>
      </div>
      <div
        className="flex flex-row w-full h-full justify-center items-center bg-contain bg-no-repeat md:bg-center"
        style={{ backgroundImage: `url(${lastItem?.image})` }}
      />
      {lastItem.score !== null && lastItem.score !== undefined && game.length <= maxRounds ? (
        <button
          className="gwfont bg-brown-brushed text-white hover:scale-125 transition-transform flex flex-col absolute bottom-3 md:bottom-10 px-10 py-2 text-2xl drop-shadow-md rounded-full"
          onClick={() => {
            setGame((g) => g.concat(options[game.length % options.length]))
          }}
        >
          Next
        </button>
      ) : null}
      <div className="absolute bottom-20 md:bottom-10 left-4 md:left-auto right-4 md:right-10 lg:w-1/2 aspect-video scale-100 md:scale-50 hover:scale-100 origin-bottom-right transition-all opacity-50 hover:opacity-100 shadow-lg overflow-hidden rounded-xl">
        <Map
          guessId={lastItem?._id}
          guessLocation={lastItem?.location}
          showGuessLocation={typeof lastItem?.score === 'number'}
          onGuess={(score) => {
            setGame((g) => {
              const last = { ...g[g.length - 1], score }
              const updatedGame = g.slice(0, -1).concat(last)
              if (isFinished(updatedGame) && session) {
                void saveGame(gameType, gameId, updatedGame)
              }
              return updatedGame
            })
          }}
        />
      </div>
      {isFinished(game) ? (
        <div className="bg-opacity-50 bg-gray-800 absolute inset-0 flex flex-col justify-center items-center">
          <div className="flex flex-col text-white bg-brown-brushed drop-shadow-xl px-2 md:px-10 py-5 justify-center text-xl md:w-1/3 m-3">
            <h2 className="gwfont text-5xl text-center">Finished!</h2>
            <div className="flex flex-col gap-1 mt-3 mb-1">
              {game.map((g, i) => (
                <div key={g._id} className="flex flex-row items-center gap-1 bg-black-brushed px-3 md:px-10 py-2">
                  <div className="pr-2 md:pr-10">{i + 1}.</div>
                  <div className="max-h-20 h-full aspect-video relative">
                    <Image src={g.image} layout="fill" />
                  </div>
                  <div className="text-right flex-1">Score: {g.score}</div>
                </div>
              ))}
            </div>
            <div className="gwfont text-4xl text-center py-3">
              Total: {total} / {500 * maxRounds}
            </div>
            <div className="flex flex-row justify-center items-center mt-1">
              <button
                className="gwfont bg-black-brushed text-white hover:scale-125 transition-transform flex flex-col px-10 py-2 text-2xl drop-shadow-md rounded-full"
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
