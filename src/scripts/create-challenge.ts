import Challenge from '../db/models/challenges'

// eslint-disable-next-line @typescript-eslint/no-extra-semi
;(async () => {
  console.info('[start]')
  const existing = await Challenge.count()
  console.info({ existing })
  // Do things
  const after = await Challenge.count()
  console.info({ after })
  console.info('[end]')
})().finally(() => process.exit(0))
