import * as React from 'react'
import { dehydrate, QueryClient, useQueries } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { avatar, cleanUsername, formatDate, getUserStyles } from '~/util'
import AccountNamePrompt from '~/components/primitives/AccountNamePrompt'
import cls from 'classnames'
import UserLinks from '~/components/primitives/UserLinks'

function averageScore(ar) {
  return (ar.length === 0 ? 0 : ar.reduce((acc, i) => acc + i.totalScore, 0) / ar.length).toLocaleString('en', {
    maximumFractionDigits: 0,
    useGrouping: true,
  })
}

export default function Index() {
  const { query } = useRouter()
  const [{ data: user }] = useQueries({
    queries: [
      {
        queryKey: ['user', query.username],
        queryFn: () => fetch(`/api/internal/user/${query.username}`).then((r) => r.json()),
      },
    ],
  })
  const { data: session } = useSession()

  if (!user) return null

  const userStyles = getUserStyles(user.username, user.style, { large: true, animate: true })

  const quickGames = user.games.filter((g) => !!g.challenge?.name)
  const dailyGames = user.games.filter((g) => g.challenge?.name?.startsWith('Daily'))
  const weeklyGames = user.games.filter((g) => g.challenge?.name?.startsWith('Week'))
  const monthlyGames = user.games.filter((g) => g.challenge?.name?.startsWith('Monthly'))

  return (
    <div className="flex justify-center items-center text-white">
      <div className="flex flex-col gap-2 justify-center items-center max-w-5xl w-full px-2 sm:px-4 pt-5">
        <div className="relative aspect-square" style={{ width: '25vmin', maxWidth: 200 }}>
          <Image
            src={avatar(user.image)}
            layout="fill"
            className={cls('rounded-full drop-shadow-md', userStyles.border)}
          />
        </div>
        <div className="flex flex-row gap-2 justify-center items-center mb-3 text-4xl sm:text-6xl">
          <div className={cls('gwfont', userStyles.text)}>{cleanUsername(user.username)}</div>
          <UserLinks username={user.username} />
        </div>
        {(session?.user as any)?.id === user.id ? <AccountNamePrompt /> : null}
        <div
          className="flex flex-col justify-center bg-brown-brushed px-6 pt-4 pb-10 drop-shadow-lg w-full text-xl"
          style={{ minHeight: '20vh' }}
        >
          <div className="gwfont grid grid-cols-2 lg:grid-cols-5 text-center text-sm lg:text-base">
            <div className="flex flex-col justify-center items-center col-span-2 lg:col-span-1">
              <div>Total Games</div>
              <div className="opacity-80">{user.totalGames}</div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <div>Avg Quick</div>
              <div className="opacity-80">{averageScore(quickGames)}</div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <div>Avg Daily</div>
              <div className="opacity-80">{averageScore(dailyGames)}</div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <div>Avg Weekly</div>
              <div className="opacity-80">{averageScore(weeklyGames)}</div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <div>Avg Monthly</div>
              <div className="opacity-80">{averageScore(monthlyGames)}</div>
            </div>
          </div>
          <div
            className="flex flex-row gap-2 px-3 py-1 text-2xl gwfont mt-2"
            style={{
              backgroundColor: 'rgba(96, 76, 52, 0.5)',
            }}
          >
            <div className="w-1/3">Game</div>
            <div className="w-1/3 text-center">Score</div>
            <div className="w-1/3 text-right">Time</div>
          </div>
          {user.games.map((g, idx) => (
            <div
              key={g._id}
              className="flex flex-row gap-1 px-3 py-1 text-sm sm:text-lg"
              style={{
                backgroundColor: idx % 2 === 1 ? 'rgba(96, 76, 52, 0.5)' : 'rgba(55, 45, 35, 0.2)',
              }}
            >
              {g.challenge ? (
                <Link href={`/leaderboard/${g.challenge?._id}`}>
                  <a className="w-1/3">{g.challenge?.name || 'Quick Game'}</a>
                </Link>
              ) : (
                <div className="w-1/3">Quick Game</div>
              )}
              <div className="w-1/3 text-center flex justify-center items-center">
                {g.totalScore?.toLocaleString('en', { useGrouping: true })}
              </div>
              <div className="w-1/3 text-right flex justify-end items-center" suppressHydrationWarning>
                {formatDate(g.createdAt)}
              </div>
            </div>
          ))}
          <div className="gwfont text-center mt-1 text-sm opacity-75">
            Showing {user.games.length} of {user.totalGames} games
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps({ params }) {
  const queryClient = new QueryClient()

  const rootUrl =
    process.env.VERCEL_ENV === 'production'
      ? 'https://gw2-geoguesser.mael.tech'
      : process.env.VERCEL_ENV === 'preview'
      ? 'https://gw2-geoguesser.mael.tech'
      : 'http://localhost:3002'

  console.info('[revalidate]', { username: params.username, rootUrl })

  await Promise.all([
    queryClient.prefetchQuery(['user', params.username], () =>
      fetch(`${rootUrl}/api/internal/user/${params.username}`).then((r) => r.json())
    ),
  ])

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      revalidate: 60, // 60s
    },
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}
