import getWeek from 'date-fns/getWeek'
import format from 'date-fns/format'
import Challenge from '../db/models/challenges'
import ChallengeOption from '../db/models/challengeOption'
import { CHALLENGE } from '../types'

// eslint-disable-next-line @typescript-eslint/no-extra-semi
;(async () => {
  console.info('[start]')
  const existing = await Challenge.count()
  console.info({ existing })
  await createDaily()
  await createWeek()
  await createMonthly()
  const after = await Challenge.count()
  console.info({ after })
  console.info('[end]')
})()
  .catch((e) => {
    console.error('[error]', e)
    process.exit(1)
  })
  .finally(() => process.exit(0))

async function createDaily() {
  try {
    const options = await (
      await ChallengeOption.aggregate<{ _id: string }>([{ $sample: { size: 10 } }, { $project: { _id: 1 } }])
    ).map(({ _id }) => _id)
    const label = format(new Date(), 'do MMM yyyy')
    await Challenge.create({
      name: `Daily ${label}`,
      options,
      type: CHALLENGE.daily,
    })
  } catch (e) {
    console.warn('[daily:warn]', e)
  }
}

async function createWeek() {
  try {
    const options = await (
      await ChallengeOption.aggregate<{ _id: string }>([{ $sample: { size: 10 } }, { $project: { _id: 1 } }])
    ).map(({ _id }) => _id)
    const label = getWeek(new Date(), { weekStartsOn: 1 })
    await Challenge.create({
      name: `Week ${label}`,
      options,
      type: CHALLENGE.weekly,
    })
  } catch (e) {
    console.warn('[week:warn]', e)
  }
}

async function createMonthly() {
  try {
    const options = await (
      await ChallengeOption.aggregate<{ _id: string }>([{ $sample: { size: 15 } }, { $project: { _id: 1 } }])
    ).map(({ _id }) => _id)
    const label = format(new Date(), 'MMMM')
    await Challenge.create({
      name: `Monthly ${label}`,
      options,
      type: CHALLENGE.monthly,
    })
  } catch (e) {
    console.warn('[monthly:warn]', e)
  }
}
