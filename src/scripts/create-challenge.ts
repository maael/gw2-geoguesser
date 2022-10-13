import Challenge from '../db/models/challenges'
import ChallengeOption from '../db/models/challengeOption'
import { CHALLENGE } from '../types'

// eslint-disable-next-line @typescript-eslint/no-extra-semi
;(async () => {
  console.info('[start]')
  const existing = await Challenge.count()
  console.info({ existing })
  const options = await (
    await ChallengeOption.aggregate<{ _id: string }>([{ $sample: { size: 3 } }, { $project: { _id: 1 } }])
  ).map(({ _id }) => _id)
  console.info({ options })
  await Challenge.create({
    name: `${new Date().toDateString()} - Daily Challenge`,
    options,
    type: CHALLENGE.daily,
  })
  const after = await Challenge.count()
  console.info({ after })
  console.info('[end]')
})()
  .catch((e) => {
    console.error('[error]', e)
    process.exit(1)
  })
  .finally(() => process.exit(0))
