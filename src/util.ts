import { QueryClient } from '@tanstack/react-query'
import { CHALLENGE } from './types'

export const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, refetchInterval: false } },
})

export const ChallengeOptionsMap: Record<CHALLENGE, { rounds: number }> = {
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

export function isSpecial(username?: string | null) {
  if (!username) return false
  return ['Mael', 'Mael2'].includes(username)
}
