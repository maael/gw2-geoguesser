import nodemailer from 'nodemailer'
import { Challenge, WithDoc } from '~/types'

interface ChallengeResult {
  newChallenge: WithDoc<Challenge> | null
  existingChallenge: WithDoc<Challenge> | null
}

export async function sendChallengeEmail(daily: ChallengeResult, weekly: ChallengeResult, monthly: ChallengeResult) {
  const client = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'matt.a.elphy@gmail.com',
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  })

  await client.sendMail({
    from: 'gw2geoguesser-no-reply@gmail.com',
    to: 'matt.a.elphy@gmail.com',
    subject: '🎉 GW2 Geoguesser Challenges and Winners',
    html: `
      <h1>Gw2 Geoguesser Challenges and Winners</h1>
      <h2>New Challenges</h2>
      ${
        daily.newChallenge
          ? `<p><a href="https://gw2-geoguesser.mael.tech/leaderboard/${daily.newChallenge._id}">${daily.newChallenge.name}</a></p>`
          : '<p>No new daily challenge</p>'
      }
      ${
        weekly.newChallenge
          ? `<p><a href="https://gw2-geoguesser.mael.tech/leaderboard/${weekly.newChallenge._id}">${weekly.newChallenge.name}</a></p>`
          : '<p>No new weekly challenge</p>'
      }
      ${
        monthly.newChallenge
          ? `<p><a href="https://gw2-geoguesser.mael.tech/leaderboard/${monthly.newChallenge._id}">${monthly.newChallenge.name}</a></p>`
          : '<p>No new monthly challenge</p>'
      }
      <h2>Current Challenges</h2>
      ${
        daily.existingChallenge
          ? `<p><a href="https://gw2-geoguesser.mael.tech/leaderboard/${daily.existingChallenge._id}">${daily.existingChallenge.name}</a></p>`
          : '<p>No existing daily challenge</p>'
      }
      ${
        weekly.existingChallenge
          ? `<p><a href="https://gw2-geoguesser.mael.tech/leaderboard/${weekly.existingChallenge._id}">${weekly.existingChallenge.name}</a></p>`
          : '<p>No existing weekly challenge</p>'
      }
      ${
        monthly.existingChallenge
          ? `<p><a href="https://gw2-geoguesser.mael.tech/leaderboard/${monthly.existingChallenge._id}">${monthly.existingChallenge.name}</a></p>`
          : '<p>No existing monthly challenge</p>'
      }
    `.trim(),
  })

  client.close()
}
