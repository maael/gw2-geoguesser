import nodemailer from 'nodemailer'
import { Challenge, WithDoc } from '~/types'

interface ChallengeResult {
  newChallenge: WithDoc<Challenge> | null
  existingChallenge: WithDoc<Challenge> | null
  winners: Winners | null
}

export interface Winner {
  userId: null | string
  username: null | string
  image: null | string
  gw2Account: null | string
}
export type Winners = Record<'first' | 'second' | 'third' | 'entry', Winner | null>

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
      ${challengeEntry('new', 'daily', daily.newChallenge)}
      ${challengeEntry('new', 'weekly', weekly.newChallenge)}
      ${challengeEntry('new', 'monthly', monthly.newChallenge)}
      <h2>Current Challenges</h2>
      ${challengeEntry('existing', 'daily', daily.existingChallenge)}
      ${challengeWinners(daily.winners)}
      ${challengeEntry('existing', 'weekly', weekly.existingChallenge)}
      ${challengeWinners(weekly.winners)}
      ${challengeEntry('existing', 'monthly', monthly.existingChallenge)}
      ${challengeWinners(monthly.winners)}
    `.trim(),
  })

  client.close()
}

function challengeEntry(type: 'new' | 'existing', challengeType: string, challenge?: WithDoc<Challenge> | null) {
  return challenge
    ? `<p><a href="https://gw2-geoguesser.mael.tech/leaderboard/${challenge._id}">${challenge.name}</a></p>`
    : `<p>No ${type} ${challengeType} challenge</p>`
}

function challengeWinners(winners: Winners | null) {
  if (!winners) return null
  const text = [
    winners.first ? challengeWinner('First', winners.first) : null,
    winners.second ? challengeWinner('Second', winners.second) : null,
    winners.third ? challengeWinner('Third', winners.third) : null,
    winners.entry ? challengeWinner('Entry', winners.entry) : null,
  ]
    .filter(Boolean)
    .join('\n')
  return text
    ? `
    <h3>Winners</h3>
    ${text}
  `
    : text
}

function challengeWinner(label: string, winner: Winner) {
  return winner.username
    ? `<p>${label}: <a href="https://gw2-geoguesser.mael.tech/user/${winner.username}">${winner.username} (${winner.gw2Account})</a></p>`
    : null
}
