import Countdown from 'react-countdown'
import endOfDay from 'date-fns/endOfDay'

export default function RankedResetTimer() {
  return <Countdown date={endOfDay(Date.now())} />
}
