import ChallengeOption from '../db/models/challengeOption'

// eslint-disable-next-line @typescript-eslint/no-extra-semi
;(async () => {
  console.info('[start]')
  const existing = await ChallengeOption.count()
  console.info({ existing })
  if (existing === 0) {
    await ChallengeOption.insertMany([
      {
        image: 'https://gw2-sightseeing.maael.xyz/new_group/ce6fb458-8523-4c70-a1a1-35c4ffc8aad8.jpg',
        location: [45136, 29864],
      },
      {
        image: 'https://gw2-sightseeing.maael.xyz/63276040328b845fd0dac05a/bc1f4a36-23ed-450d-b73a-debd5fa0cb89.jpg',
        location: [37988, 32718],
      },
      {
        image: 'https://gw2-sightseeing.maael.xyz/63276040328b845fd0dac05a/36094a2c-a7e3-44c2-a52f-40b3bdd0877a.jpg',
        location: [38714, 37092],
      },
      {
        image: 'https://gw2-sightseeing.maael.xyz/63276040328b845fd0dac05a/f51eef90-1cb9-4669-8e7e-baea846b7c44.jpg',
        location: [49704, 39984],
      },
      {
        image: 'https://gw2-sightseeing.maael.xyz/63276040328b845fd0dac05a/ab9d667f-38d1-446f-bc78-0864c872edd4.jpg',
        location: [37988, 32718],
      },
      {
        image: 'https://gw2-sightseeing.maael.xyz/new_group/ce6fb458-8523-4c70-a1a1-35c4ffc8aad8.jpg',
        location: [45136, 29864],
      },
      {
        image: 'https://gw2-sightseeing.maael.xyz/63276040328b845fd0dac05a/bc1f4a36-23ed-450d-b73a-debd5fa0cb89.jpg',
        location: [37988, 32718],
      },
      {
        image: 'https://gw2-sightseeing.maael.xyz/63276040328b845fd0dac05a/36094a2c-a7e3-44c2-a52f-40b3bdd0877a.jpg',
        location: [38714, 37092],
      },
      {
        image: 'https://gw2-sightseeing.maael.xyz/63276040328b845fd0dac05a/f51eef90-1cb9-4669-8e7e-baea846b7c44.jpg',
        location: [49704, 39984],
      },
      {
        image: 'https://gw2-sightseeing.maael.xyz/63276040328b845fd0dac05a/ab9d667f-38d1-446f-bc78-0864c872edd4.jpg',
        location: [37988, 32718],
      },
      {
        image: 'https://gw2-sightseeing.maael.xyz/new_group/ce6fb458-8523-4c70-a1a1-35c4ffc8aad8.jpg',
        location: [45136, 29864],
      },
      {
        image: 'https://gw2-sightseeing.maael.xyz/63276040328b845fd0dac05a/bc1f4a36-23ed-450d-b73a-debd5fa0cb89.jpg',
        location: [37988, 32718],
      },
      {
        image: 'https://gw2-sightseeing.maael.xyz/63276040328b845fd0dac05a/36094a2c-a7e3-44c2-a52f-40b3bdd0877a.jpg',
        location: [38714, 37092],
      },
      {
        image: 'https://gw2-sightseeing.maael.xyz/63276040328b845fd0dac05a/f51eef90-1cb9-4669-8e7e-baea846b7c44.jpg',
        location: [49704, 39984],
      },
      {
        image: 'https://gw2-sightseeing.maael.xyz/63276040328b845fd0dac05a/ab9d667f-38d1-446f-bc78-0864c872edd4.jpg',
        location: [37988, 32718],
      },
    ])
  }
  const after = await ChallengeOption.count()
  console.info({ after })
  console.info('[end]')
})().finally(() => process.exit(0))
