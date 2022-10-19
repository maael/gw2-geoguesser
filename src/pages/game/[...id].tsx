import * as React from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { CHALLENGE } from '~/types'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { EVENTS, Fathom } from '~/components/hooks/useFathom'
import { FaExclamationTriangle, FaSpinner } from 'react-icons/fa'
import PrizeList from '~/components/PrizeList'

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

interface TGame {
  _id: undefined | string
  name?: string
  prizes?: any
  options: any[]
  error: string
}

function useGameOptions(gameType: CHALLENGE | null, setStarted: React.Dispatch<React.SetStateAction<boolean>>) {
  const [game, setGame] = React.useState<TGame>({ _id: undefined, options: [], error: '' })
  const [error, setError] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  async function getGameOptions() {
    if (gameType === null) return
    let game: TGame | null = null
    try {
      setLoading(true)
      game = await fetch(`/api/internal/play/${gameType}`).then((r) => r.json())
      game?.options?.forEach((o) => {
        const img = new global.Image()
        img.src = o.image
      })
      setGame(game!)
      setStarted(true)
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
    return game!
  }
  React.useEffect(() => {
    void getGameOptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameType])
  return { game, error, loading, reset: getGameOptions }
}

export default function Game({ fathom }: { fathom: Fathom }) {
  const { query } = useRouter()
  const queryGameType = query.id ? query.id[0] : null
  const gameType =
    queryGameType === CHALLENGE.daily
      ? CHALLENGE.daily
      : queryGameType === CHALLENGE.weekly
      ? CHALLENGE.weekly
      : queryGameType === CHALLENGE.monthly
      ? CHALLENGE.monthly
      : CHALLENGE.random
  const [started, setStarted] = React.useState(false)
  const {
    game: { _id: gameId, name, prizes, options, error },
    loading,
    reset,
  } = useGameOptions(queryGameType ? gameType : null, setStarted)
  return loading ? (
    <div className="flex justify-center items-center h-full">
      <FaSpinner className="animate-spin text-white text-4xl" />
    </div>
  ) : error ? (
    <ErrorScreen error={error} />
  ) : !started ? (
    <StartScreen name={name} prizes={prizes} setStarted={setStarted} />
  ) : (
    <GameScreen gameId={gameId} options={options} gameType={gameType} fathom={fathom} reset={reset} />
  )
}

function StartScreen({
  name,
  prizes,
  setStarted,
}: {
  name?: string
  prizes?: any
  setStarted: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <div className="h-full flex flex-col justify-center items-center text-white gap-5">
      <h1 className="gwfont text-4xl text-center">{name || 'Quick Game'}</h1>
      <PrizeList prizes={prizes} />
      {name ? (
        <p className="flex flex-col gap-3 justify-center items-center max-w-xs text-center text-yellow-500 text-lg">
          <FaExclamationTriangle className="text-4xl" /> This is a ranked game, you'll only be able to attempt it once!
        </p>
      ) : null}
      <button
        onClick={(e) => {
          e.preventDefault()
          setStarted(true)
        }}
        className="gwfont flex flex-row gap-2 justify-center items-center bg-brown-brushed rounded-full px-6 py-1 hover:scale-110 transition-transform drop-shadow-lg text-2xl"
      >
        Start
      </button>
    </div>
  )
}

const messageToTypeMap = {
  'Need to have an account to play ranked games!': 'account',
  'Ranked games can only be done once per user!': 'attempts',
}
const contentMap = {
  account: AccountError,
  attempts: AttemptsError,
  default: DefaultError,
}

function AccountError({ error }: { error: string }) {
  return (
    <div className="text-white text-center text-2xl flex flex-col justify-center items-center gap-5 mt-5 h-full">
      <div>{error}</div>
      <div className="flex flex-row">
        <Link href="/auth">
          <a className="gwfont flex flex-row gap-2 justify-center items-center bg-brown-brushed rounded-full px-5 py-1 hover:scale-110 transition-transform drop-shadow-lg h-full">
            Log in or Sign up here!
          </a>
        </Link>
      </div>
    </div>
  )
}

function AttemptsError({ error }: { error: string }) {
  return (
    <div className="text-white text-center text-2xl flex flex-col justify-center items-center gap-5 mt-5 h-full">
      <div>{error}</div>
      <div className="flex flex-row">
        <Link href="/">
          <a className="gwfont flex flex-row gap-2 justify-center items-center bg-brown-brushed rounded-full px-5 py-1 hover:scale-110 transition-transform drop-shadow-lg h-full">
            Go back and find another game!
          </a>
        </Link>
      </div>
    </div>
  )
}

function DefaultError({ error }: { error: string }) {
  return <div className="text-white text-center text-2xl mt-5 h-full">{error}</div>
}
function ErrorScreen({ error }: { error: string }) {
  const type = messageToTypeMap[error]
  const Component = contentMap[type] || contentMap.default
  return <Component error={error} />
}

function GameScreen({
  options,
  gameType,
  gameId,
  fathom,
  reset,
}: {
  options: any
  gameType: CHALLENGE
  gameId: string | undefined
  fathom: Fathom
  reset: () => Promise<TGame | undefined>
}) {
  const { data: session } = useSession()
  const [game, setGame] = React.useState<Game>([options[0]])
  const maxRounds = options.length || 0
  const lastItem = game[game.length - 1]
  const total = sumScore(game)
  function isFinished(g: Game) {
    return g.length === maxRounds && g.every((gi) => typeof gi.score === 'number')
  }
  React.useEffect(() => {
    fathom.trackGoal(EVENTS.StartGame, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div
      suppressHydrationWarning
      className="bg-black-brushed bg-gray-900 flex flex-col justify-center items-center flex-1 w-full relative"
    >
      <div className="bg-brown-brushed flex flex-col md:absolute top-1 right-0 text-white px-8 lg:px-12 py-2 bg-black text-base lg:text-3xl rounded-full my-4 md:my-0 mx-2 md:rounded-l-full drop-shadow-xl">
        <div>
          Round: {game.length}/{maxRounds}
        </div>
        <div>Score: {total}</div>
      </div>
      <div
        className="flex flex-row w-full h-full justify-center items-center bg-contain bg-no-repeat bg-top sm:bg-left lg:bg-center"
        style={{ backgroundImage: `url(${lastItem?.image})` }}
      />
      {lastItem.score !== null && lastItem.score !== undefined && game.length <= maxRounds ? (
        <button
          className="gwfont bg-brown-brushed text-white left-auto sm:left-2 lg:left-auto hover:scale-125 transition-transform flex flex-col absolute bottom-1.5 sm:bottom-0.5 lg:bottom-3 lg:bottom-10 px-10 py-2 text-2xl lg:text-5xl drop-shadow-md rounded-full"
          onClick={() => {
            setGame((g) => g.concat(options[game.length % options.length]))
          }}
        >
          Next
        </button>
      ) : null}
      <div className="absolute bottom-16 sm:bottom-2 lg:bottom-10 left-2 sm:left-1/2 lg:left-auto right-4 md:right-10 lg:w-1/2 aspect-square sm:aspect-video scale-100 lg:scale-50 hover:scale-100 origin-bottom-right transition-all opacity-60 hover:opacity-100 shadow-lg overflow-hidden rounded-xl">
        <Map
          guessId={lastItem?._id}
          guessLocation={lastItem?.location}
          showGuessLocation={typeof lastItem?.score === 'number'}
          onGuess={(score) => {
            setGame((g) => {
              const last = { ...g[g.length - 1], score }
              const updatedGame = g.slice(0, -1).concat(last)
              if (isFinished(updatedGame)) {
                fathom.trackGoal(EVENTS.FinishGame, 0)
                if (session) void saveGame(gameType, gameId, updatedGame)
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
                    <Image src={g.image} layout="fill" priority />
                  </div>
                  <div className="text-right flex-1">Score: {g.score}</div>
                </div>
              ))}
            </div>
            <div className="gwfont text-4xl text-center py-3">
              Total: {total} / {500 * maxRounds}
            </div>
            <div className="flex flex-row justify-center items-center mt-1 gap-2">
              {gameType === CHALLENGE.random ? (
                <button
                  className="gwfont bg-black-brushed text-white hover:scale-125 transition-transform flex flex-col px-10 py-2 text-2xl drop-shadow-md rounded-full"
                  onClick={async () => {
                    fathom.trackGoal(EVENTS.StartGame, 0)
                    const newGame = await reset()
                    setGame([newGame?.options[0]].filter(Boolean))
                  }}
                >
                  New Game
                </button>
              ) : null}
              <Link href="/">
                <a className="gwfont bg-black-brushed text-white hover:scale-125 transition-transform flex flex-col px-10 py-2 text-2xl drop-shadow-md rounded-full">
                  Finish
                </a>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
