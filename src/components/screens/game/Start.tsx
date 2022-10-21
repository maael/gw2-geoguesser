import * as React from 'react'
import { FaExclamationTriangle, FaInfinity, FaInfoCircle } from 'react-icons/fa'
import SliderOuter from '~/components/primitives/Slider'
import PrizeList from '~/components/PrizeList'
import { CHALLENGE } from '~/types'
import { convertMsToMinutesSeconds } from '~/util'

export default function StartScreen({
  gameType,
  name,
  prizes,
  setStarted,
  startTimer,
}: {
  gameType: CHALLENGE
  name?: string
  prizes?: any
  setStarted: React.Dispatch<React.SetStateAction<boolean>>
  startTimer: () => void
}) {
  return (
    <div className="h-full flex flex-col justify-center items-center text-white gap-5">
      <h1 className="gwfont text-4xl text-center">{name || 'Quick Game'}</h1>
      {gameType === CHALLENGE.random ? <p>No prizes for quick games, just fun!</p> : <PrizeList prizes={prizes} />}
      {name ? (
        <p className="flex flex-col gap-3 justify-center items-center max-w-xs text-center text-yellow-500 text-lg">
          <FaExclamationTriangle className="text-4xl" /> This is a ranked game, you'll only be able to attempt it once!
        </p>
      ) : null}
      {gameType === CHALLENGE.random ? <Options /> : null}
      <button
        onClick={(e) => {
          e.preventDefault()
          setStarted(true)
          startTimer()
        }}
        className="gwfont flex flex-row gap-2 justify-center items-center bg-brown-brushed rounded-full px-6 py-1 hover:scale-110 transition-transform drop-shadow-lg text-2xl"
      >
        Start
      </button>
    </div>
  )
}

function Options() {
  const [roundTime, setRoundTime] = React.useState(0)
  const [imageTime, setImageTime] = React.useState(0)
  const enabled = false
  return (
    <div className="relative p-2">
      <div className="max-w-md flex flex-col gap-5">
        <h3 className="text-2xl gwfont">Options</h3>
        <div className="flex flex-col gap-1">
          <SliderOuter
            label="Round Time Limit"
            value={roundTime}
            min={0}
            max={1_000 * 60 * 10}
            step={10_000}
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
            max={1_000 * 60 * 10}
            step={10_000}
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
