import * as React from 'react'
import { FaExclamationTriangle, FaInfinity, FaInfoCircle, FaSpinner } from 'react-icons/fa'
import cls from 'classnames'
import SliderOuter from '~/components/primitives/Slider'
import PrizeList from '~/components/PrizeList'
import { CHALLENGE } from '~/types'
import { convertMsToMinutesSeconds } from '~/util'

export default function StartScreen({
  gameType,
  gameId,
  name,
  prizes,
  setStarted,
  startTimer,
  ...optionsProps
}: {
  gameType: CHALLENGE
  gameId?: string | null
  name?: string
  prizes?: any
  setStarted: React.Dispatch<React.SetStateAction<boolean>>
  startTimer: () => void
} & OptionsProps) {
  const [isCreating, setIsCreating] = React.useState(false)
  const [creationError, setCreationError] = React.useState('')
  const [customGameName, setCustomGameName] = React.useState('')
  const [rounds, setRounds] = React.useState(10)
  const [createdGameId, setCreatedGameId] = React.useState('')
  return (
    <div className="h-full flex flex-col justify-center items-center text-white gap-5">
      <h1 className="gwfont text-4xl text-center">
        {name || (gameType === CHALLENGE.custom ? 'Custom Game' : 'Quick Game')}
      </h1>
      {gameType === CHALLENGE.custom ? null : gameType === CHALLENGE.random ? (
        <p>No prizes for quick games, just fun!</p>
      ) : (
        <PrizeList prizes={prizes} />
      )}
      {name ? (
        <p className="flex flex-col gap-3 justify-center items-center max-w-xs text-center text-yellow-500 text-lg">
          <FaExclamationTriangle className="text-4xl" /> This is a {gameType === CHALLENGE.custom ? 'custom' : 'ranked'}{' '}
          game, you'll only be able to attempt it once!
        </p>
      ) : null}
      {[CHALLENGE.random, CHALLENGE.custom].includes(gameType) && !gameId ? <Options {...optionsProps} /> : null}
      {gameType !== CHALLENGE.random && (gameType === CHALLENGE.custom ? !!gameId : true) ? (
        <div>
          {optionsProps.roundTime ? (
            <div>Game Time Limit: {convertMsToMinutesSeconds(optionsProps.roundTime)}</div>
          ) : null}
          {optionsProps.imageTime ? (
            <div>Image Time Limit: {convertMsToMinutesSeconds(optionsProps.imageTime)}</div>
          ) : null}
        </div>
      ) : null}
      {gameType === CHALLENGE.custom && !gameId ? (
        <div className="max-w-md flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <SliderOuter
              label="Rounds"
              value={rounds}
              min={1}
              max={20}
              step={1}
              onChange={setRounds}
              renderValue={(v) => (
                <span className="tabular-nums" style={{ fontFamily: 'Arial' }}>
                  {v}
                </span>
              )}
            />
            <p className="flex flex-row gap-1 mx-3">
              <FaInfoCircle className="w-10 mt-1" /> How many rounds of guessing should the game have
            </p>
          </div>
          <input
            value={customGameName}
            onChange={(e) => setCustomGameName(e.currentTarget.value)}
            placeholder="Game name..."
            className="px-3 py-1 rounded-md shadow-md text-2xl text-black w-full"
          />
          <div className="flex flex-row justify-center items-center">
            <button
              disabled={!customGameName.trim() || !!createdGameId}
              className={cls(
                'gwfont flex flex-row gap-2 justify-center items-center bg-brown-brushed rounded-full px-6 py-1 hover:scale-110 transition-transform drop-shadow-lg text-2xl',
                {
                  'opacity-50': !customGameName.trim() || !!createdGameId,
                }
              )}
              title={createdGameId ? 'Once created, cannot be edited' : undefined}
              onClick={async () => {
                try {
                  setIsCreating(true)
                  if (!customGameName.trim()) throw new Error('Requires name')
                  const res = await fetch('/api/internal/challenge', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      name: customGameName.trim(),
                      rounds,
                      roundTime: optionsProps.roundTime,
                      imageTime: optionsProps.imageTime,
                    }),
                  })
                  const data = await res.json()
                  if (res.status === 500 || data.error || !data._id) {
                    throw new Error(data.error || `Unknown error (${res.status}), please try again`)
                  }
                  if (data._id) setCreatedGameId(data._id)
                } catch (e) {
                  if (e.message.includes('E11000')) {
                    setCreationError('A challenge with that name exists, please choose another and try again')
                  } else if (e.message.startsWith('Cannot start')) {
                    setCreationError('Cannot start with Daily, Week, or Monthly - please change the name')
                  } else {
                    setCreationError('An unknown error occurred, please try again')
                  }
                } finally {
                  setIsCreating(false)
                }
              }}
            >
              {isCreating ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Creating...
                </>
              ) : (
                'Create'
              )}
            </button>
          </div>
          {createdGameId ? (
            <>
              <input
                disabled
                value={`https://gw2-geoguesser.mael.tech/game/custom/${createdGameId}`}
                className="px-3 py-1 rounded-md shadow-md text-2xl text-black w-full text-ellipsis"
              />
              <p className="flex flex-row gap-3 justify-center items-center max-w-xs text-center text-blue-500 mx-auto -mt-1">
                <FaInfoCircle className="text-6xl" /> Share this link with others to allow them to play the game, or
                press play below to play the game
              </p>
              <div className="flex flex-row justify-center items-center">
                <button
                  className="gwfont flex flex-row gap-2 justify-center items-center bg-brown-brushed rounded-full px-6 py-1 hover:scale-110 transition-transform drop-shadow-lg text-2xl"
                  onClick={() => window.location.replace(`/game/custom/${createdGameId}`)}
                >
                  Play
                </button>
              </div>
            </>
          ) : null}
        </div>
      ) : null}
      {creationError ? (
        <p className="flex flex-col gap-3 justify-center items-center max-w-xs text-center text-yellow-500 text-lg">
          {creationError}
        </p>
      ) : null}
      {gameType === CHALLENGE.custom && !gameId ? null : (
        <button
          onClick={(e) => {
            e.preventDefault()
            setStarted(true)
            startTimer()
          }}
          disabled={gameType === CHALLENGE.random ? false : !gameId}
          className={cls(
            'gwfont flex flex-row gap-2 justify-center items-center bg-brown-brushed rounded-full px-6 py-1 hover:scale-110 transition-transform drop-shadow-lg text-2xl',
            { 'opacity-50': gameType === CHALLENGE.random ? false : !gameId }
          )}
        >
          Start
        </button>
      )}
    </div>
  )
}

export type OptionsProps = ReturnType<typeof useOptions>

export function useOptions(_gameType: CHALLENGE, _customGameId: string | null) {
  const [roundTime, setRoundTime] = React.useState(0)
  const [imageTime, setImageTime] = React.useState(0)
  return { roundTime, imageTime, setRoundTime, setImageTime }
}

function Options({ roundTime, setRoundTime, imageTime, setImageTime }: OptionsProps) {
  const enabled = true
  return (
    <div className="relative p-2">
      <div className="max-w-md flex flex-col gap-5">
        <h3 className="text-2xl gwfont text-center">Options</h3>
        <div className="flex flex-col gap-1">
          <SliderOuter
            label="Round Time Limit"
            value={roundTime}
            min={0}
            max={1_000 * 60 * 5}
            step={5_000}
            onChange={setRoundTime}
            renderValue={(v) => (
              <span className="tabular-nums" style={{ fontFamily: 'Arial' }}>
                {v === 0 ? <FaInfinity /> : convertMsToMinutesSeconds(v)}
              </span>
            )}
          />
          <p className="flex flex-row gap-1 mx-3">
            <FaInfoCircle className="w-10 mt-1" /> How long to have to make a guess before the round automatically ends
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <SliderOuter
            label="Image Time Limit"
            value={imageTime}
            min={0}
            max={1_000 * 60 * 5}
            step={5_000}
            onChange={setImageTime}
            renderValue={(v) => (
              <span className="tabular-nums" style={{ fontFamily: 'Arial' }}>
                {v === 0 ? <FaInfinity /> : convertMsToMinutesSeconds(v)}
              </span>
            )}
          />
          <p className="flex flex-row gap-1 mx-3">
            <FaInfoCircle className="w-10 mt-1" /> How long before the image disappears, you can still guess on the map
            until the round ends though
          </p>
        </div>
      </div>
      {enabled ? null : (
        <div className="absolute inset-0 bg-stone-800 bg-opacity-70 rounded-md flex flex-col justify-center items-center overflow-hidden">
          <div className="-rotate-45 transform inline-block gwfont text-xl">Work in progress</div>
        </div>
      )}
    </div>
  )
}
