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
