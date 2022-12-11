import dbConnect from '../db/mongo'
import ChallengeOption from '../db/models/challengeOption'
import { getItems } from './util/gw2Mongo'

/**
 * TODO: Need to make this use the submissions going forwards
 */

// eslint-disable-next-line @typescript-eslint/no-extra-semi
;(async () => {
  console.info('[start]')
  await dbConnect()
  const existing = await ChallengeOption.find({})
  console.info({ existing: existing.length })
  const existingOptionIds = new Set(existing.map((e) => e.image))
  const items = await getItems()
  const newItems = items.filter((i) => !existingOptionIds.has(i.image))
  const repeatedItems = items.filter((i) => existingOptionIds.has(i.image))
  console.info({ newItems: newItems.length, repeatedItems: repeatedItems.length })
  if (newItems.length > 0) {
    await ChallengeOption.insertMany(newItems)
  } else {
    console.info('[skip] No new items')
  }
  const after = await ChallengeOption.count()
  console.info({ after })
  console.info('[end]')
})()
  .catch((e) => console.error('[error]', e))
  .finally(() => process.exit(0))
