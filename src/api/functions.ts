import { unstable_getServerSession } from 'next-auth/next'
import { ApiHandlers, ChallengeOption } from '~/types'
import { authOptions } from '~/pages/api/auth/[...nextauth]'
import Game from '~/db/models/games'

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
        })
        return game as any
      },
    },
  },
  challenge: {
    get: {
      one: async ({ id }) => {
        console.info('[challenge]', { type: id })
        const options: ChallengeOption[] = [
          {
            id: 'ce6fb458-8523-4c70-a1a1-35c4ffc8aad8.jpg',
            image: 'https://gw2-sightseeing.maael.xyz/new_group/ce6fb458-8523-4c70-a1a1-35c4ffc8aad8.jpg',
            location: [45136, 29864],
          },
          {
            id: 'bc1f4a36-23ed-450d-b73a-debd5fa0cb89',
            image:
              'https://gw2-sightseeing.maael.xyz/63276040328b845fd0dac05a/bc1f4a36-23ed-450d-b73a-debd5fa0cb89.jpg',
            location: [37988, 32718],
          },
          {
            id: '36094a2c-a7e3-44c2-a52f-40b3bdd0877a',
            image:
              'https://gw2-sightseeing.maael.xyz/63276040328b845fd0dac05a/36094a2c-a7e3-44c2-a52f-40b3bdd0877a.jpg',
            location: [38714, 37092],
          },
          {
            id: 'f51eef90-1cb9-4669-8e7e-baea846b7c44',
            image:
              'https://gw2-sightseeing.maael.xyz/63276040328b845fd0dac05a/f51eef90-1cb9-4669-8e7e-baea846b7c44.jpg',
            location: [49704, 39984],
          },
          {
            id: 'ab9d667f-38d1-446f-bc78-0864c872edd4',
            image:
              'https://gw2-sightseeing.maael.xyz/63276040328b845fd0dac05a/ab9d667f-38d1-446f-bc78-0864c872edd4.jpg',
            location: [37988, 32718],
          },
        ]
        return options
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
