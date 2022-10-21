import { FaExclamationTriangle } from 'react-icons/fa'
import PrizeList from '~/components/PrizeList'

export default function StartScreen({
  name,
  prizes,
  setStarted,
  startTimer,
}: {
  name?: string
  prizes?: any
  setStarted: React.Dispatch<React.SetStateAction<boolean>>
  startTimer: () => void
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
          startTimer()
        }}
        className="gwfont flex flex-row gap-2 justify-center items-center bg-brown-brushed rounded-full px-6 py-1 hover:scale-110 transition-transform drop-shadow-lg text-2xl"
      >
        Start
      </button>
    </div>
  )
}
