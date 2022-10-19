import getWeek from 'date-fns/getWeek'
import format from 'date-fns/format'
import dbConnect from '../db/mongo'
import Challenge from '../db/models/challenges'
import ChallengeOption from '../db/models/challengeOption'
import { Challenge as TChallenge, CHALLENGE, WithDoc } from '../types'

// eslint-disable-next-line @typescript-eslint/no-extra-semi
import { sendChallengeEmail } from './util/sendEmail'
;(async () => {
  console.info('[start]')
  await dbConnect()
  const existing = await Challenge.count()
  console.info({ existing })
  const daily = await createDaily()
  const weekly = await createWeek()
  const monthly = await createMonthly()
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

async function createDaily() {
  let existingChallenge: WithDoc<TChallenge> | null = null
  let newChallenge: WithDoc<TChallenge> | null = null
  try {
    existingChallenge = (
      await Challenge.find({ type: CHALLENGE.daily }).sort({ createdAt: 'desc' }).lean()
    )[0] as WithDoc<TChallenge>
    const options = await (
      await ChallengeOption.aggregate<{ _id: string }>([{ $sample: { size: 10 } }, { $project: { _id: 1 } }])
    ).map(({ _id }) => _id)
    const label = format(new Date(), 'do MMM yyyy')
    newChallenge = await Challenge.create({
      name: `Daily ${label}`,
      options,
      type: CHALLENGE.daily,
      prizes: {
        entry: '1g',
      },
    })
  } catch (e) {
    console.warn('[daily:warn]', e.message)
  }
  return { existingChallenge, newChallenge }
}

async function createWeek() {
  let existingChallenge: WithDoc<TChallenge> | null = null
  let newChallenge: WithDoc<TChallenge> | null = null
  try {
    existingChallenge = (
      await Challenge.find({ type: CHALLENGE.weekly }).sort({ createdAt: 'desc' }).lean()
    )[0] as WithDoc<TChallenge>
    const options = await (
      await ChallengeOption.aggregate<{ _id: string }>([{ $sample: { size: 10 } }, { $project: { _id: 1 } }])
    ).map(({ _id }) => _id)
    const label = getWeek(new Date(), { weekStartsOn: 1 })
    newChallenge = await Challenge.create({
      name: `Week ${label} ${format(new Date(), 'yyyy')}`,
      options,
      type: CHALLENGE.weekly,
      prizes: {
        first: '5g',
        second: '3g',
        third: '2g',
        entry: '2g',
      },
    })
  } catch (e) {
    console.warn('[week:warn]', e.message)
  }
  return { existingChallenge, newChallenge }
}

async function createMonthly() {
  let existingChallenge: WithDoc<TChallenge> | null = null
  let newChallenge: WithDoc<TChallenge> | null = null
  try {
    existingChallenge = (
      await Challenge.find({ type: CHALLENGE.monthly }).sort({ createdAt: 'desc' }).lean()
    )[0] as WithDoc<TChallenge>
    const options = await (
      await ChallengeOption.aggregate<{ _id: string }>([{ $sample: { size: 15 } }, { $project: { _id: 1 } }])
    ).map(({ _id }) => _id)
    const label = format(new Date(), 'MMMM yyyy')
    newChallenge = await Challenge.create({
      name: `Monthly ${label}`,
      options,
      type: CHALLENGE.monthly,
      prizes: {
        first: '10g',
        second: '4g',
        third: '2g',
        entry: '5g',
      },
    })
  } catch (e) {
    console.warn('[monthly:warn]', e.message)
  }
  return { existingChallenge, newChallenge }
}
