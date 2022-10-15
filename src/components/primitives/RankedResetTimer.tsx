import Countdown from 'react-countdown'
import endOfDay from 'date-fns/endOfDay'
import addMinutes from 'date-fns/addMinutes'

export default function RankedResetTimer() {
  return (
    <Countdown
      date={endOfDay(addMinutes(new Date(), new Date().getTimezoneOffset()))}
      now={() => +addMinutes(new Date(), new Date().getTimezoneOffset())}
      renderer={(props) => {
        return `${props.formatted.hours}:${props.formatted.minutes}:${props.formatted.seconds}`
      }}
    />
  )
}
