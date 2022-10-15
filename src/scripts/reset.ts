import ChallengeOption from '../db/models/challengeOption'
import Challenges from '../db/models/challenges'
import Game from '../db/models/games'
import User from '../db/models/user'

// eslint-disable-next-line @typescript-eslint/no-extra-semi
;(async () => {
  console.info('[start]')
  await ChallengeOption.remove({})
  await Game.remove({})
  await Challenges.remove({})
  await User.remove({})
  console.info('[end]')
})().finally(() => process.exit(0))
