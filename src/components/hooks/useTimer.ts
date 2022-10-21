import { useEffect, useState } from 'react'
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds'
import intervalToDuration from 'date-fns/intervalToDuration'

const zeroPad = (num) => String(num).padStart(2, '0')
function formatDuration(start: Date, stop: Date) {
  const duration = intervalToDuration({ start, end: stop })
  const differenceMs = differenceInMilliseconds(stop, start)
  const formatted = [duration.hours].filter(Boolean).concat([duration.minutes, duration.seconds]).map(zeroPad).join(':')
  return { differenceMs, formatted }
}

export default function useTimer() {
  const [state, setState] = useState<{ start: null | Date; stop: null | Date }>({ start: null, stop: null })
  const [time, setTime] = useState<null | Date>()
  function start() {
    setState((s) => ({ ...s, start: new Date() }))
  }
  function stop() {
    setState((s) => ({ ...s, stop: new Date() }))
  }
  function reset() {
    setState({ start: null, stop: null })
  }
  useEffect(() => {
    let r: number
    function timer() {
      if (!state.stop && state.start) {
        setTime(new Date())
        r = requestAnimationFrame(timer)
      }
    }
    r = requestAnimationFrame(timer)
    return () => {
      cancelAnimationFrame(r)
    }
  }, [state.stop, state.start])
  return {
    time,
    difference:
      state.start && time ? formatDuration(state.start, state.stop || time) : { formatted: '00:00', differenceMs: 0 },
    start,
    stop,
    reset,
  }
}
