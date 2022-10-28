import { FaTwitch } from 'react-icons/fa'

const STREAMERS = {
  Laranity: {
    twitch: 'laranity',
  },
  SimSouls: {
    twitch: 'SimSouls',
  },
  Rioanne: {
    twitch: 'Rioanne',
  },
  Areki: {
    twitch: 'areki_mirai',
  },
}

const KNOWN_STREAMERS = Object.keys(STREAMERS)

export function isStreamer(username?: string | null) {
  return username && KNOWN_STREAMERS.includes(username)
}

export default function UserLinks({ username }: { username?: string | null }) {
  return username && isStreamer(username) ? (
    STREAMERS[username]?.twitch ? (
      <a href={`https://twitch.tv/${STREAMERS[username]?.twitch}`}>
        <FaTwitch className="twitch-text" style={{ fontSize: '0.8em' }} />
      </a>
    ) : null
  ) : null
}
