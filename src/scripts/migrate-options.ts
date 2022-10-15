import dbConnect from '../db/mongo'
import ChallengeOption from '../db/models/challengeOption'
import { getItems } from './util/gw2Mongo'

// eslint-disable-next-line @typescript-eslint/no-extra-semi
;(async () => {
  console.info('[start]')
  await dbConnect()
  const existing = await ChallengeOption.count()
  console.info({ existing })
  const items = await getItems()
  await ChallengeOption.insertMany(items)
  const after = await ChallengeOption.count()
  console.info({ after })
  console.info('[end]')
})().finally(() => process.exit(0))
