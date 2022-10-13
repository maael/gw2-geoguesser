import { CHALLENGE } from './types'

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
