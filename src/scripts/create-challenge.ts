import getWeek from 'date-fns/getWeek'
import format from 'date-fns/format'
import dbConnect from '../db/mongo'
import Challenge from '../db/models/challenges'
import ChallengeOption from '../db/models/challengeOption'
import Game from '../db/models/games'
import '../db/models/user'
import { Challenge as TChallenge, CHALLENGE, WithDoc } from '../types'

// eslint-disable-next-line @typescript-eslint/no-extra-semi
import { sendChallengeEmail, Winner, Winners } from './util/sendEmail'
import { Schema } from 'mongoose'
;(async () => {
  console.info('[start]')
  await dbConnect()
  const existing = await Challenge.count()
  console.info({ existing })
  const daily = await createChallenge(CHALLENGE.daily, `Daily ${format(new Date(), 'do MMM yyyy')}`, 10, {
    entry: '1g',
  })
  const weekly = await createChallenge(
    CHALLENGE.weekly,
    `Week ${getWeek(new Date(), { weekStartsOn: 1 })} ${format(new Date(), 'yyyy')}`,
    10,
    {
      first: '5g',
      second: '3g',
      third: '2g',
      entry: '2g',
    }
  )
  const monthly = await createChallenge(CHALLENGE.monthly, `Monthly ${format(new Date(), 'MMMM yyyy')}`, 15, {
    first: '10g',
    second: '4g',
    third: '2g',
    entry: '5g',
  })
  const after = await Challenge.count()
  await sendChallengeEmail(daily, weekly, monthly)
  console.info({ after })
  console.info('[end]')
})()
  .catch((e) => {
    console.error('[error]', e)
    process.exit(1)
  })
  .finally(() => process.exit(0))

function userToWinner(user: any): Winner | null {
  if (!user) return null
  return {
    userId: user?._id,
    username: user?.username,
    image: user?.image,
    gw2Account: user?.gw2Account,
  }
}
async function getWinners(type: CHALLENGE, challengeId: string, sortMethod?: string) {
  const winners: Winners = {
    first: null,
    second: null,
    third: null,
    entry: null,
  }
  const gameQuery = { challengeType: type, challenge: challengeId }
  let sort: any = { totalScore: 'desc', createdAt: 'asc' }
  if (sortMethod === 'score-time') {
    sort = { totalScore: 'desc', timeMs: 'asc', createdAt: 'asc' }
  }
  const [winnerGames, entryLottery] = await Promise.all([
    Game.find(gameQuery).limit(3).populate('userId', 'username image gw2Account').sort(sort).lean(),
    Game.aggregate([
      { $match: gameQuery },
      { $sample: { size: 1 } },
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
    ]),
  ])
  winners.first = userToWinner(winnerGames[0]?.userId)
  winners.second = userToWinner(winnerGames[1]?.userId)
  winners.third = userToWinner(winnerGames[2]?.userId)
  winners.entry = userToWinner(entryLottery[0]?.user[0])
  return winners
}

async function createChallenge(type: CHALLENGE, name: string, rounds: number, prizes: any) {
  let existingChallenge: WithDoc<TChallenge> | null = null
  let newChallenge: WithDoc<TChallenge> | null = null
  let winners: Winners = { first: null, second: null, third: null, entry: null }
  try {
    existingChallenge = (await Challenge.find({ type }).sort({ createdAt: 'desc' }).lean())[0] as WithDoc<TChallenge>
    const options = await (
      await ChallengeOption.aggregate<{ _id: string }>([{ $sample: { size: rounds } }, { $project: { _id: 1 } }])
    ).map(({ _id }) => _id)
    const newChallengeInfo: Omit<TChallenge, 'createdAt' | 'updatedAt' | 'isDeleted'> = {
      name,
      options: options as unknown as Schema.Types.ObjectId[],
      type,
      prizes,
      settings: {
        sort: 'score-time',
        rounds,
      },
    }
    newChallenge = await Challenge.create(newChallengeInfo)
    if (newChallenge) {
      winners = await getWinners(type, existingChallenge._id, existingChallenge.settings?.sort)
    }
  } catch (e) {
    console.warn(`[${type}:warn]`, e.message)
  }
  return { existingChallenge, newChallenge, winners }
}
