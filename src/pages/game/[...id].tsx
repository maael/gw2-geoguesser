import * as React from 'react'
import { CHALLENGE } from '~/types'
import { useRouter } from 'next/router'
import { Fathom } from '~/components/hooks/useFathom'
import { FaSpinner } from 'react-icons/fa'
import ErrorScreen from '~/components/screens/game/Error'
import useTimer from '~/components/hooks/useTimer'
import StartScreen from '~/components/screens/game/Start'
import GameScreen, { TGame } from '~/components/screens/game/Game'

function useGameOptions(
  gameType: CHALLENGE | null,
  setStarted: React.Dispatch<React.SetStateAction<boolean>>,
  resetTimer: () => void
) {
  const [game, setGame] = React.useState<TGame>({ _id: undefined, options: [], error: '' })
  const [error, setError] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  async function getGameOptions() {
    if (gameType === null) return
    let game: TGame | null = null
    try {
      resetTimer()
      setLoading(true)
      game = await fetch(`/api/internal/play/${gameType}`).then((r) => r.json())
      game?.options?.forEach((o) => {
        const img = new global.Image()
        img.src = o.image
      })
      setGame(game!)
      setStarted(false)
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
  const { difference: timer, start: startTimer, reset: resetTimer, stop: stopTimer } = useTimer()
  const {
    game: { _id: gameId, name, prizes, options, error },
    loading,
    reset,
  } = useGameOptions(queryGameType ? gameType : null, setStarted, resetTimer)
  return loading ? (
    <div className="flex justify-center items-center h-full">
      <FaSpinner className="animate-spin text-white text-4xl" />
    </div>
  ) : error ? (
    <ErrorScreen error={error} />
  ) : !started ? (
    <StartScreen gameType={gameType} name={name} prizes={prizes} setStarted={setStarted} startTimer={startTimer} />
  ) : (
    <GameScreen
      gameId={gameId}
      options={options}
      gameType={gameType}
      fathom={fathom}
      reset={reset}
      stopTimer={stopTimer}
      timer={timer}
    />
  )
}
