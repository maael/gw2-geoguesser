import { QueryClient } from '@tanstack/react-query'
import { CHALLENGE } from './types'
import { isStreamer } from './components/primitives/UserLinks'

export const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, refetchInterval: false } },
})

export const ChallengeOptionsMap: Partial<Record<CHALLENGE, { rounds: number }>> = {
  [CHALLENGE.random]: {
    rounds: 5,
  },
  [CHALLENGE.daily]: {
    rounds: 10,
  },
  [CHALLENGE.weekly]: {
    rounds: 10,
  },
  [CHALLENGE.monthly]: {
    rounds: 15,
  },
}

export function avatar(name: string | undefined | null) {
  return `https://gw2-sightseeing.maael.xyz/avatars/${name || 'Toxx_2BIcon.jpg'}`
}

export function getRandomArrayItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

export const medalColor = {
  0: '#DAA520',
  1: '#A9A9A9',
  2: '#cd7f32',
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0')
}

export function convertMsToMinutesSeconds(milliseconds) {
  const minutes = Math.floor(milliseconds / 60000)
  const seconds = Math.round((milliseconds % 60000) / 1000)

  return seconds === 60 ? `${padTo2Digits(minutes + 1)}:00` : `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`
}

export function cleanUsername(username?: string | null) {
  return `${username || ''}`?.split('@')[0]?.trim()
}

export function getUserStyles(
  username?: string | null,
  style?: string | null,
  options = { animate: false, large: false }
) {
  const userIsStreamer = isStreamer(username)
  return {
    border: {
      'thick-border': options.large,
      'twitch-border thin-border': style !== 'rainbow' && userIsStreamer,
      'rainbow-border thin-border': style === 'rainbow',
      'taimi-border thin-border': style === 'taimi',
      'noxxi-border thin-border': style === 'noxxi',
    },
    text: {
      'animate-huerotate': style === 'rainbow' && options.animate,
      'twitch-text': style !== 'rainbow' && userIsStreamer,
      'rainbow-text': style === 'rainbow',
      'taimi-text': style === 'taimi',
      'noxxi-text': style === 'noxxi',
    },
  }
}
