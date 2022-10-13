import { unstable_getServerSession } from 'next-auth/next'
import { ApiHandlers, CHALLENGE } from '~/types'
import { authOptions } from '~/pages/api/auth/[...nextauth]'
import Game from '~/db/models/games'
import Challenge from '~/db/models/challenges'
import ChallengeOption from '~/db/models/challengeOption'

const handlers: ApiHandlers = {
  game: {
    get: {
      many: async ({ req, res }) => {
        const session = await unstable_getServerSession(req, res, authOptions)
        if (!session) {
          throw new Error('Required session')
        }
        return Game.find({ userId: (session.user as any).id }).lean()
      },
    },
    post: {
      many: async ({ req, res, body }) => {
        const session = await unstable_getServerSession(req, res, authOptions)
        if (!session) {
          throw new Error('Required session')
        }
        const game = await Game.create({
          userId: (session.user as any).id,
          totalScore: body.totalScore,
          challenge: body.challenge,
          challengeType: body.challengeType,
        })
        return game as any
      },
    },
  },
  challenge: {
    get: {
      one: async ({ id }) => {
        console.info('[challenge]', { type: id })
        if (id === CHALLENGE.random) {
          return {
            options: await ChallengeOption.aggregate<{ _id: string }>([{ $sample: { size: 5 } }]),
          }
        } else if (id === CHALLENGE.daily || id === CHALLENGE.monthly) {
          return Challenge.findOne({ type: id }).sort({ createdAt: 'asc' }).populate('options')
        } else {
          return null
        }
      },
      many: async () => [],
    },
  },
  user: {
    get: {
      many: async ({ req, res }) => {
        const session = await unstable_getServerSession(req, res, authOptions)
        return session as any
      },
    },
  },
}

export default handlers
