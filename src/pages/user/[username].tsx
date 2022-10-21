import * as React from 'react'
import { dehydrate, QueryClient, useQueries } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import format from 'date-fns/format'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { avatar, cleanUsername } from '~/util'
import AccountNamePrompt from '~/components/primitives/AccountNamePrompt'
import cls from 'classnames'

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

  return (
    <div className="flex justify-center items-center text-white">
      <div className="flex flex-col gap-2 justify-center items-center max-w-5xl w-full px-2 sm:px-4 pt-5">
        <div className="relative aspect-square" style={{ width: '25vmin', maxWidth: 200 }}>
          <Image
            src={avatar(user.image)}
            layout="fill"
            className={cls('rounded-full drop-shadow-md', { 'border-2 rainbow-border': user.style === 'rainbow' })}
          />
        </div>
        <div
          className={cls('gwfont text-4xl sm:text-6xl mb-3', {
            'rainbow-text animate-huerotate': user.style === 'rainbow',
          })}
        >
          {cleanUsername(user.username)}
        </div>
        {(session?.user as any)?.id === user.id ? <AccountNamePrompt /> : null}
        <div
          className="flex flex-col justify-center bg-brown-brushed px-6 pt-4 pb-6 drop-shadow-lg w-full text-xl"
          style={{ minHeight: '20vh' }}
        >
          <div
            className="flex flex-row gap-2 px-3 py-1 text-2xl gwfont"
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
              <div className="w-1/3 text-center">{g.totalScore}</div>
              <div className="w-1/3 text-right">
                {format(new Date(g.createdAt), 'HH:mm do MMM')}
                <span className="ml-1 hidden sm:inline-block">{format(new Date(g.createdAt), 'yyyy')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps({ params }) {
  const queryClient = new QueryClient()

  const rootUrl = process.env.VERCEL_ENV === 'production' ? 'https://gw2-geoguesser.mael.tech' : 'http://localhost:3002'

  console.info('[revalidate]', { username: params.username })

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
