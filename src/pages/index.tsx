import Link from 'next/link'
import * as React from 'react'
import { dehydrate, QueryClient, useQueries } from '@tanstack/react-query'
import format from 'date-fns/format'
import { avatar } from '~/util'
import Image from 'next/image'
import { FaArrowRight, FaBeer, FaGithub, FaLink, FaMedal, FaReddit } from 'react-icons/fa'
import dynamic from 'next/dynamic'

const Countdown = dynamic(() => import('../components/primitives/RankedResetTimer'), {
  ssr: false,
  loading: () => null,
})

export default function Index() {
  const [
    { data: daily },
    { data: weekly },
    { data: monthly },
    { data: recentDailyGames, isLoading: recentDailyGamesLoading },
    { data: highDailyGames, isLoading: highDailyGamesLoading },
    { data: recentWeeklyGames, isLoading: recentWeeklyGamesLoading },
    { data: highWeeklyGames, isLoading: highWeeklyGamesLoading },
    { data: recentMonthlyGames, isLoading: recentMonthlyGamesLoading },
    { data: highMonthlyGames, isLoading: highMonthlyGamesLoading },
    { data: recentRandomGames, isLoading: recentRandomGamesLoading },
  ] = useQueries({
    queries: [
      { queryKey: ['daily-challenge'], queryFn: () => fetch('/api/internal/challenge/daily').then((r) => r.json()) },
      {
        queryKey: ['weekly-challenge'],
        queryFn: () => fetch('/api/internal/challenge/weekly').then((r) => r.json()),
      },
      {
        queryKey: ['monthly-challenge'],
        queryFn: () => fetch('/api/internal/challenge/monthly').then((r) => r.json()),
      },
      {
        queryKey: ['daily-games-recent'],
        queryFn: () => fetch('/api/internal/game/daily?sort=time&limit=10').then((r) => r.json()),
      },
      {
        queryKey: ['daily-games-score'],
        queryFn: () => fetch('/api/internal/game/daily?sort=score&limit=10').then((r) => r.json()),
      },
      {
        queryKey: ['weekly-games-recent'],
        queryFn: () => fetch('/api/internal/game/weekly?sort=time&limit=10').then((r) => r.json()),
      },
      {
        queryKey: ['weekly-games-score'],
        queryFn: () => fetch('/api/internal/game/weekly?sort=score&limit=10').then((r) => r.json()),
      },
      {
        queryKey: ['monthly-games-recent'],
        queryFn: () => fetch('/api/internal/game/monthly?sort=time&limit=10').then((r) => r.json()),
      },
      {
        queryKey: ['monthly-games-score'],
        queryFn: () => fetch('/api/internal/game/monthly?sort=score&limit=10').then((r) => r.json()),
      },
      {
        queryKey: ['random-games-recent'],
        queryFn: () => fetch('/api/internal/game/random?sort=time&limit=10').then((r) => r.json()),
      },
    ],
  })
  return (
    <>
      <div className="flex flex-col justify-center items-center text-white">
        <div className="flex flex-col gap-7 justify-center items-center max-w-5xl w-full sm:text-lg px-2">
          <div className="text-2xl sm:text-4xl text-center mt-3 sm:mt-7 gwfont">Think you know Tyria?</div>
          <div className="flex flex-col justify-center items-center gap-2 w-full px-2 my-1">
            <Link href="/game/random">
              <a className="text-2xl text-center bg-brown-brushed rounded-full drop-shadow-md hover:scale-110 transition-transform px-5 py-1 flex flex-row gap-2 justify-center items-center">
                Quick Game <FaArrowRight />
              </a>
            </Link>
            <div className="gwfont text-xl sm:text-3xl mt-2">Ranked Games</div>
            <div className="text-center max-w-md">
              <Link href="/auth">
                <a className="underline">Sign up or Log in</a>
              </Link>{' '}
              to play fixed ranked games!
            </div>
            <div className="text-center max-w-md my-1">
              You can only attempt each ranked game once until a new one is released, so play carefully!
            </div>
            <div className="flex flex-col sm:flex-row gap-1 text-center mb-2">
              Time until new Ranked game: <Countdown />
            </div>
            <div className="flex flex-row justify-center items-center gap-2">
              {daily ? (
                <Link href="/game/daily">
                  <a className="text-center bg-brown-brushed rounded-full drop-shadow-md hover:scale-110 transition-transform px-5 py-1">
                    {daily.name.replace(new Date().getFullYear(), '').trim()}
                  </a>
                </Link>
              ) : null}
              {weekly ? (
                <Link href="/game/weekly">
                  <a className="text-center bg-brown-brushed rounded-full drop-shadow-md hover:scale-110 transition-transform px-5 py-1">
                    {weekly.name.replace(new Date().getFullYear(), '').trim()}
                  </a>
                </Link>
              ) : null}
              {monthly ? (
                <Link href="/game/monthly">
                  <a className="text-center bg-brown-brushed rounded-full drop-shadow-md hover:scale-110 transition-transform px-5 py-1">
                    {monthly.name.replace(new Date().getFullYear(), '').trim()}
                  </a>
                </Link>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 w-full">
            <GamesBlock
              type="time"
              games={recentRandomGames}
              isLoading={recentRandomGamesLoading}
              label={'Recent Quick Games'}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 w-full">
            <GamesBlock
              type="time"
              games={recentDailyGames}
              isLoading={recentDailyGamesLoading}
              label={'Recent Daily'}
            />
            <GamesBlock
              type="score"
              games={highDailyGames}
              isLoading={highDailyGamesLoading}
              label={'High Score Daily'}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 w-full">
            <GamesBlock
              type="time"
              games={recentWeeklyGames}
              isLoading={recentWeeklyGamesLoading}
              label={'Recent Weekly'}
            />
            <GamesBlock
              type="score"
              games={highWeeklyGames}
              isLoading={highWeeklyGamesLoading}
              label={'High Score Weekly'}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 w-full">
            <GamesBlock
              type="time"
              games={recentMonthlyGames}
              isLoading={recentMonthlyGamesLoading}
              label={'Recent Monthly'}
            />
            <GamesBlock
              type="score"
              games={highMonthlyGames}
              isLoading={highMonthlyGamesLoading}
              label={'High Score Monthly'}
            />
          </div>
        </div>
      </div>
      <div className="flex-1" />
      <div className="max-w-3xl mx-auto mt-2 text-white pt-2 pb-1 text-xs flex flex-row gap-5 justify-center items-end text-center">
        <span className="flex flex-row gap-1 justify-center items-center">
          <a href="https://mael.tech">Made by Matt Elphick</a>
          <a href="https://mael.tech">
            <FaLink />
          </a>
          <a href="https://github.com/maael">
            <FaGithub />
          </a>
          <a href="http://reddit.com/u/maael">
            <FaReddit />
          </a>
        </span>
        <span className="flex flex-row gap-1 justify-center items-center">
          <Image src={avatar('Gorrik-Icon.jpg')} height={15} width={15} className="rounded-full" />
          Mael.3259 in game
        </span>
      </div>
      <div className="max-w-3xl mx-auto text-white pb-2 text-xs flex flex-row gap-5 justify-center items-end text-center">
        <a href="https://elonian-gallery.com/">Avatars © Ilona Iske 2022</a>
        <a href="https://www.buymeacoffee.com/matte" className="flex flex-row gap-1 justify-center items-center">
          Enjoying the game? Get me a beer. <FaBeer />
        </a>
      </div>
    </>
  )
}

const medalColor = {
  0: '#DAA520',
  1: '#A9A9A9',
  2: '#cd7f32',
}

function GamesBlock({
  games,
  label,
  isLoading,
  type,
}: {
  isLoading: boolean
  games?: {
    error?: string
    challenge?: { name: string }
    totalGames?: number
    games?: { _id: string; userId: { username: string; image: string }; totalScore: number; createdAt: string }[]
  }
  label: string
  type: 'score' | 'time'
}) {
  return (
    <div className="bg-brown-brushed px-5 pt-3 pb-5 drop-shadow-lg sm:flex-1 flex flex-col gap-1">
      <div className="gwfont text-xl">{label}</div>
      <div className="flex flex-col sm:flex-row items-center">
        <div className="text-lg sm:flex-1">{games?.challenge?.name}</div>
        <div className="text-sm">
          {games?.games?.length} of {games?.totalGames || '??'} entr{games?.totalGames === 1 ? 'y' : 'ies'}
        </div>
      </div>
      <div className="my-2">
        <div
          className="flex flex-row gap-2 px-3 py-1 gwfont text-lg sm:text-xl"
          style={{
            backgroundColor: 'rgba(96, 76, 52, 0.5)',
          }}
        >
          <div className="w-1/3">User</div>
          <div className="w-1/3 text-center">Score</div>
          <div className="w-1/3 text-right">Time</div>
        </div>
        {games && games.games && games.games.length > 0 ? (
          games.games.map((g, idx) => (
            <div
              key={`${label}-${g._id}`}
              className="flex flex-row gap-2 px-3 py-1 text-sm sm:text-lg"
              style={{
                backgroundColor: idx % 2 === 1 ? 'rgba(96, 76, 52, 0.5)' : 'rgba(55, 45, 35, 0.2)',
              }}
            >
              <Link href={`/user/${g.userId?.username}`}>
                <a className="w-2/5 text-center sm:text-left flex flex-row gap-2 items-center">
                  <Image src={avatar(g.userId?.image)} height={25} width={25} className="rounded-full" />{' '}
                  {g.userId?.username}
                </a>
              </Link>
              <div className="w-1/5 text-center flex flex-row gap-1 justify-center items-center">
                {type === 'score' && idx < 3 ? (
                  <FaMedal className="text-sm" style={{ color: medalColor[idx] }} />
                ) : null}{' '}
                {g.totalScore}
              </div>
              <div className="w-2/5 text-right">
                {format(new Date(g.createdAt), 'HH:mm do MMM')}
                <span className="hidden sm:inline-block ml-1">{format(new Date(g.createdAt), 'yyyy')}</span>
              </div>
            </div>
          ))
        ) : isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="text-center">No scores!</div>
        )}
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const queryClient = new QueryClient()

  const rootUrl = process.env.VERCEL_ENV === 'production' ? 'https://gw2-geoguesser.mael.tech' : 'http://localhost:3002'

  console.info('[revalidate]')

  await Promise.all([
    queryClient.prefetchQuery(['daily-challenge'], () =>
      fetch(`${rootUrl}/api/internal/challenge/daily`).then((r) => r.json())
    ),
    queryClient.prefetchQuery(['weekly-challenge'], () =>
      fetch(`${rootUrl}/api/internal/challenge/weekly`).then((r) => r.json())
    ),
    queryClient.prefetchQuery(['monthly-challenge'], () =>
      fetch(`${rootUrl}/api/internal/challenge/monthly`).then((r) => r.json())
    ),
    queryClient.prefetchQuery(['daily-games-recent'], () =>
      fetch(`${rootUrl}/api/internal/game/daily?sort=time&limit=10`).then((r) => r.json())
    ),
    queryClient.prefetchQuery(['daily-games-score'], () =>
      fetch(`${rootUrl}/api/internal/game/daily?sort=score&limit=10`).then((r) => r.json())
    ),
    queryClient.prefetchQuery(['weekly-games-recent'], () =>
      fetch(`${rootUrl}/api/internal/game/weekly?sort=time&limit=10`).then((r) => r.json())
    ),
    queryClient.prefetchQuery(['weekly-games-score'], () =>
      fetch(`${rootUrl}/api/internal/game/weekly?sort=score&limit=10`).then((r) => r.json())
    ),
    queryClient.prefetchQuery(['monthly-games-recent'], () =>
      fetch(`${rootUrl}/api/internal/game/monthly?sort=time&limit=10`).then((r) => r.json())
    ),
    queryClient.prefetchQuery(['monthly-games-score'], () =>
      fetch(`${rootUrl}/api/internal/game/monthly?sort=score&limit=10`).then((r) => r.json())
    ),
    queryClient.prefetchQuery(['random-games-recent'], () =>
      fetch(`${rootUrl}/api/internal/game/random?sort=time&limit=10`).then((r) => r.json())
    ),
  ])

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      revalidate: 10, // 10s
    },
  }
}
