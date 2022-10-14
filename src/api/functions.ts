import { unstable_getServerSession } from 'next-auth/next'
import { ApiHandlers, CHALLENGE, WithDoc, Challenge as TChallenge, Game as TGame } from '~/types'
import { authOptions } from '~/pages/api/auth/[...nextauth]'
import Game from '~/db/models/games'
import Challenge from '~/db/models/challenges'
import ChallengeOption from '~/db/models/challengeOption'
import User from '~/db/models/user'
import { FilterQuery } from 'mongoose'

const handlers: ApiHandlers = {
  game: {
    get: {
      one: async ({ id, sort, limit = 10 }) => {
        let challengeId = id
        let challenge: WithDoc<TChallenge> | undefined | null = undefined
        if (challengeId === CHALLENGE.daily || challengeId === CHALLENGE.weekly || challengeId === CHALLENGE.monthly) {
          challenge = await Challenge.findOne({ type: id }, { _id: 1, name: 1, type: 1, createdAt: 1 }).sort({
            createdAt: 'desc',
          })
          challengeId = challenge?._id
        }
        if (!challengeId) {
          throw new Error('Required challenge ID')
        }
        const filterObj: FilterQuery<WithDoc<TGame>> = { challenge: challengeId }
        if (challengeId === CHALLENGE.random) {
          delete filterObj.challenge
          filterObj.challengeType = CHALLENGE.random
        }
        const filter = Game.find(filterObj).populate('userId', 'username image')
        if (sort === 'score') {
          filter.sort({ totalScore: 'desc' })
        } else if (sort === 'time') {
          filter.sort({ createdAt: 'desc' })
        }
        const [games, totalGames] = await Promise.all([filter.limit(limit).lean().exec(), filter.clone().count()])
        return { challenge, games, totalGames }
      },
      many: async ({ req, res }) => {
        const session = await unstable_getServerSession(req, res, authOptions)
        if (!session) {
          throw new Error('Required session')
        }
        return Game.find({ userId: (session.user as any).id })
          .sort({ createdAt: 'desc' })
          .lean()
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
        if (id === 'random') return null
        return Challenge.findOne({ type: id }).sort({ createdAt: 'desc' }).populate('options')
      },
    },
  },
  play: {
    get: {
      one: async ({ id, req, res }) => {
        console.info('[challenge]', { type: id })
        if (id === CHALLENGE.random) {
          return {
            options: await ChallengeOption.aggregate<{ _id: string }>([{ $sample: { size: 5 } }]),
          }
        } else if (id === CHALLENGE.daily || id === CHALLENGE.monthly || id === CHALLENGE.weekly) {
          const session = await unstable_getServerSession(req, res, authOptions)
          if (!session) throw new Error('Need to have an account to play ranked games!')
          const challenge = await Challenge.findOne({ type: id }).sort({ createdAt: 'desc' }).populate('options')
          if (!challenge) return null
          const existingUserGame = await Game.findOne({ userId: (session.user as any).id, challenge: challenge._id })
          if (existingUserGame) throw new Error('Ranked games can only be done once per user!')
          return challenge
        } else {
          return null
        }
      },
    },
  },
  user: {
    get: {
      many: async ({ req, res }) => {
        const session = await unstable_getServerSession(req, res, authOptions)
        return session as any
      },
      one: async ({ id }) => {
        const user = await User.findOne({ username: id }, { _id: 1, username: 1, createdAt: 1, image: 1 })
        if (!user) throw new Error('Not found')
        const userGames = await Game.find({ userId: user._id })
          .sort({ createdAt: 'desc' })
          .populate('challenge', 'name type createdAt')
          .limit(100)
        return {
          username: user.username,
          image: user.image,
          createdAt: user.createdAt,
          games: userGames,
        }
      },
    },
  },
  avatars: {
    get: {
      many: async () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return require('../../data/avatars.json') as string[]
      },
    },
  },
}

export default handlers
