import * as React from 'react'
import { CHALLENGE } from '~/types'
import { useRouter } from 'next/router'
import { Fathom } from '~/components/hooks/useFathom'
import { FaSpinner } from 'react-icons/fa'
import ErrorScreen from '~/components/screens/game/Error'
import useTimer from '~/components/hooks/useTimer'
import StartScreen, { useOptions } from '~/components/screens/game/Start'
import GameScreen, { TGame } from '~/components/screens/game/Game'

function useGameOptions(
  gameType: CHALLENGE | null,
  customGameId: string | null,
  setStarted: React.Dispatch<React.SetStateAction<boolean>>,
  resetTimer: () => void
): {
  game: TGame
  error: null | string
  loading: boolean
  reset: () => Promise<TGame | undefined>
} {
  const [game, setGame] = React.useState<TGame>({ _id: undefined, options: [], error: '' })
  const [error, setError] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  async function getGameOptions() {
    if (gameType === null) return
    let game: TGame | null = null
    try {
      resetTimer()
      setLoading(true)
      const response = await fetch(`/api/internal/play/${[gameType, customGameId].filter(Boolean).join('/')}`)
      game = await response.json()
      if (response.status == 500 || game?.error) throw new Error(game?.error || 'Server error')
      game?.options?.forEach((o) => {
        const img = new global.Image()
        img.src = o.image
      })
      if (game) setGame(game!)
      setStarted(false)
    } catch (e) {
      setError(e.message)
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
  const customGameId = query.id ? query.id[1] : null
  const gameType =
    queryGameType === CHALLENGE.daily
      ? CHALLENGE.daily
      : queryGameType === CHALLENGE.weekly
      ? CHALLENGE.weekly
      : queryGameType === CHALLENGE.monthly
      ? CHALLENGE.monthly
      : queryGameType === CHALLENGE.custom
      ? CHALLENGE.custom
      : CHALLENGE.random
  const [started, setStarted] = React.useState(false)
  const { difference: timer, start: startTimer, reset: resetTimer, stop: stopTimer } = useTimer()
  const optionProps = useOptions(gameType, customGameId)
  const {
    game: { _id: gameId, name, prizes, options, error: gameError, settings },
    error,
    loading,
    reset,
  } = useGameOptions(queryGameType ? gameType : null, customGameId, setStarted, resetTimer)
  React.useEffect(() => {
    if (gameType === CHALLENGE.custom) {
      if (settings?.imageTime) {
        optionProps.setImageTime(settings.imageTime)
      }
      if (settings?.roundTime) {
        optionProps.setRoundTime(settings.roundTime)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings?.roundTime, settings?.imageTime, gameType, optionProps.setImageTime, optionProps.setRoundTime])
  return loading ? (
    <div className="flex justify-center items-center h-full">
      <FaSpinner className="animate-spin text-white text-4xl" />
    </div>
  ) : error ? (
    <ErrorScreen error={gameError || error} />
  ) : !started ? (
    <StartScreen
      gameType={gameType}
      gameId={customGameId || gameId}
      name={name}
      prizes={prizes}
      setStarted={setStarted}
      startTimer={startTimer}
      {...optionProps}
    />
  ) : (
    <GameScreen
      gameId={gameId}
      options={options}
      gameType={gameType}
      fathom={fathom}
      reset={reset}
      stopTimer={stopTimer}
      timer={timer}
      {...optionProps}
    />
  )
}
