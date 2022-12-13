import { unstable_getServerSession } from 'next-auth/next'
import { FilterQuery } from 'mongoose'
import { ApiHandlers, CHALLENGE, WithDoc, Challenge as TChallenge, Game as TGame, ApiOneHandler } from '~/types'
import { authOptions } from '~/pages/api/auth/[...nextauth]'
import Game from '~/db/models/games'
import Challenge from '~/db/models/challenges'
import ChallengeOption from '~/db/models/challengeOption'
import User from '~/db/models/user'
import { getPath } from '~/util'

const getOneGame: ApiOneHandler = async ({ id, secondaryId, sort, limit = 10 }) => {
  let challengeId = id
  let challenge: WithDoc<TChallenge> | undefined | null = undefined
  if (challengeId !== CHALLENGE.random) {
    const filterObject: any = {}
    if (challengeId === CHALLENGE.custom) {
      filterObject.type = CHALLENGE.custom
      filterObject._id = secondaryId
    } else if (
      challengeId === CHALLENGE.daily ||
      challengeId === CHALLENGE.weekly ||
      challengeId === CHALLENGE.monthly
    ) {
      filterObject.type = id
    } else {
      filterObject._id = id
    }
    challenge = await Challenge.findOne(filterObject, { _id: 1, name: 1, type: 1, createdAt: 1, settings: 1 }).sort({
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
  const filter = Game.find(filterObj).populate('userId', 'username image style')
  if (sort === 'score') {
    if (challenge?.settings?.sort === 'score-time') {
      console.info('[sort]', challenge?.name, 'score-time')
      filter.sort({ totalScore: 'desc', timeMs: 'asc', createdAt: 'asc' })
    } else {
      console.info('[sort]', challenge?.name, 'score-created-at')
      filter.sort({ totalScore: 'desc', createdAt: 'asc' })
    }
  } else if (sort === 'time') {
    filter.sort({ createdAt: 'desc' })
  }
  const [games, totalGames] = await Promise.all([filter.clone().limit(limit).lean().exec(), filter.clone().count()])
  return { challenge, games, totalGames }
}

const getOneChallenge: ApiOneHandler = async ({ id }) => {
  if (id === 'random') return null
  const challenge = await Challenge.findOne({ type: id }).sort({ createdAt: 'desc' }).populate('options')
  return cleanChallengeOptions(challenge)
}

function cleanChallengeOptions(challenge: any) {
  return {
    ...challenge,
    options: cleanOptions(challenge.options),
  }
}

function cleanOptions(options: any) {
  return options.map((o) => ({ ...o, image: `https://gw2-sightseeing.mael-cdn.com${getPath(o.image)}` }))
}

const handlers: ApiHandlers = {
  game: {
    get: {
      one: getOneGame,
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
          timeMs: body.timeMs,
        })
        res.revalidate(`/user/${session.user?.name}`)
        return game as any
      },
    },
  },
  challenge: {
    get: {
      one: getOneChallenge,
    },
    post: {
      many: async ({ body }) => {
        if (!body?.name) {
          throw new Error('Requires name')
        } else if (['Daily', 'Week', 'Monthly'].some((i) => body?.name.toLowerCase().startsWith(i.toLowerCase()))) {
          throw new Error('Cannot start with Daily, Week, or Monthly')
        }
        const rounds = body?.rounds || 10
        const options = (
          await ChallengeOption.aggregate<{ _id: string }>([{ $sample: { size: rounds } }, { $project: { _id: 1 } }])
        ).map(({ _id }) => _id)
        const challenge = await Challenge.create({
          name: body?.name,
          type: CHALLENGE.custom,
          options,
          settings: {
            sort: 'score-time',
            rounds,
            roundTime: body?.roundTime,
            imageTime: body?.imageTime,
          },
          prizes: {},
          isDeleted: false,
        })
        return challenge
      },
    },
  },
  home_info: {
    get: {
      many: async () => {
        const [
          recentDailyGames,
          highDailyGames,
          recentWeeklyGames,
          highWeeklyGames,
          recentMonthlyGames,
          highMonthlyGames,
          recentRandomGames,
          daily,
          weekly,
          monthly,
        ] = await Promise.all([
          getOneGame({ id: 'daily', sort: 'time', limit: 10, req: {} as any, res: {} as any }),
          getOneGame({ id: 'daily', sort: 'score', limit: 10, req: {} as any, res: {} as any }),
          getOneGame({ id: 'weekly', sort: 'time', limit: 10, req: {} as any, res: {} as any }),
          getOneGame({ id: 'weekly', sort: 'score', limit: 10, req: {} as any, res: {} as any }),
          getOneGame({ id: 'monthly', sort: 'time', limit: 10, req: {} as any, res: {} as any }),
          getOneGame({ id: 'monthly', sort: 'score', limit: 10, req: {} as any, res: {} as any }),
          getOneGame({ id: 'random', sort: 'time', limit: 10, req: {} as any, res: {} as any }),
          getOneChallenge({ id: 'daily', req: {} as any, res: {} as any }),
          getOneChallenge({ id: 'weekly', req: {} as any, res: {} as any }),
          getOneChallenge({ id: 'monthly', req: {} as any, res: {} as any }),
        ])
        return {
          recentDailyGames,
          highDailyGames,
          recentWeeklyGames,
          highWeeklyGames,
          recentMonthlyGames,
          highMonthlyGames,
          recentRandomGames,
          daily,
          weekly,
          monthly,
        } as any
      },
    },
  },
  play: {
    get: {
      one: async ({ id, secondaryId, req, res }) => {
        console.info('[challenge]', { type: id })
        if (id === CHALLENGE.random) {
          const options = await ChallengeOption.aggregate<{ _id: string }>([{ $sample: { size: 5 } }])
          console.info({ options })
          return {
            options: cleanOptions(options),
          }
        } else if (id === CHALLENGE.custom) {
          const session = await unstable_getServerSession(req, res, authOptions)
          if (!session) throw new Error('Need to have an account to play ranked games!')
          const challenge = await Challenge.findOne({ type: id, _id: secondaryId })
            .sort({ createdAt: 'desc' })
            .populate('options')
          if (!challenge) return null
          const existingUserGame = await Game.findOne({ userId: (session.user as any).id, challenge: challenge._id })
          if (existingUserGame) throw new Error('Custom games can only be done once per user!')
          return cleanChallengeOptions(challenge)
        } else if (id === CHALLENGE.daily || id === CHALLENGE.monthly || id === CHALLENGE.weekly) {
          const session = await unstable_getServerSession(req, res, authOptions)
          if (!session) throw new Error('Need to have an account to play ranked games!')
          const challenge = await Challenge.findOne({ type: id }).sort({ createdAt: 'desc' }).populate('options')
          if (!challenge) return null
          const existingUserGame = await Game.findOne({ userId: (session.user as any).id, challenge: challenge._id })
          if (existingUserGame) throw new Error('Ranked games can only be done once per user!')
          return cleanChallengeOptions(challenge)
        } else {
          return null
        }
      },
    },
  },
  user: {
    get: {
      one: async ({ id }) => {
        const user = await User.findOne({ username: id }, { _id: 1, username: 1, createdAt: 1, image: 1, style: 1 })
        if (!user) throw new Error('Not found')
        const baseQuery = Game.find({ userId: user._id })
        const [userGames, totalGames] = await Promise.all([
          baseQuery.clone().sort({ createdAt: 'desc' }).populate('challenge', 'name type createdAt').limit(100),
          baseQuery.clone().count(),
        ])
        return {
          id: user._id,
          username: user.username,
          image: user.image,
          createdAt: user.createdAt,
          style: user.style,
          games: userGames,
          totalGames,
        }
      },
      many: async ({ req, res }) => {
        const session = await unstable_getServerSession(req, res, authOptions)
        if (!session) {
          throw new Error('Required session')
        }
        return User.findById((session.user as any).id, { gw2Account: 1 }) as any
      },
    },
    put: {
      many: async ({ body, req, res }) => {
        const session = await unstable_getServerSession(req, res, authOptions)
        if (!session) {
          throw new Error('Required session')
        }
        await User.updateOne(
          { _id: (session.user as any).id },
          { gw2Account: body.gw2Account },
          { projection: { gw2Account: 1 } }
        )
        return { gw2Account: body.gw2Account } as any
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
