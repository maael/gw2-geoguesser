import Link from 'next/link'
import * as React from 'react'
import { dehydrate, QueryClient, useQueries } from '@tanstack/react-query'
import getDaysInMonth from 'date-fns/getDaysInMonth'
import Image from 'next/image'
import { FaArrowRight, FaBeer, FaGithub, FaLink, FaReddit } from 'react-icons/fa'
import dynamic from 'next/dynamic'
import { avatar } from '~/util'
import { CHALLENGE } from '~/types'
import PrizeList from '~/components/PrizeList'
import GamesBlock from '~/components/primitives/GamesBlock'

const Countdown = dynamic(() => import('../components/primitives/RankedResetTimer'), {
  ssr: false,
  loading: () => null,
})

function sum(obj: any, multiplier: number) {
  if (!obj) return 0
  const perThing = Object.values(obj.prizes || {}).reduce<number>((acc, p) => acc + Number(`${p}`.replace('g', '')), 0)
  return perThing * multiplier
}

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
        <div className="bg-red-700 rounded-md drop-shadow-lg text-3xl px-5 py-1 max-w-xl text-center mt-3">
          Due to high load, services are down - we expect to be back online at 21:30 BST/13:30 PT, sorry about this!
        </div>
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
            <div className="text-center max-w-md mt-1 flex flex-col sm:flex-row gap-1 justify-center items-center gwfont">
              <div className="text-center flex flex-row gap-1 justify-center items-center gwfont text-4xl">
                {sum(daily, getDaysInMonth(new Date())) + sum(weekly, 4) + sum(monthly, 1)}{' '}
                <Image src="/ui/gold.png" height={30} width={30} title="In-game gold" />
              </div>
              In prizes this month
            </div>
            <div className="text-center max-w-md mb-1 text-sm opacity-60">Allow a delay when receiving prizes</div>
            <div className="flex flex-col sm:flex-row gap-1 text-center mb-2">
              Time until new Ranked game: <Countdown />
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-2">
              <RankedGameBlock type={CHALLENGE.daily} challenge={daily} />
              <RankedGameBlock type={CHALLENGE.weekly} challenge={weekly} />
              <RankedGameBlock type={CHALLENGE.monthly} challenge={monthly} />
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

function RankedGameBlock({
  type,
  challenge,
}: {
  type: CHALLENGE
  challenge: { error?: string; name: string; prizes: any }
}) {
  return challenge && !challenge.error ? (
    <div className="flex flex-col gap-1 items-center">
      <h3 className="gwfont text-2xl -mb-0.5">{type}</h3>
      <PrizeList prizes={challenge?.prizes} />
      <Link href={`/game/${type}`}>
        <a className="text-center bg-brown-brushed rounded-full drop-shadow-md hover:scale-110 transition-transform px-5 py-1 flex flex-row gap-1 items-center justify-center">
          {challenge?.name.replace(`${new Date().getFullYear()}`, '').trim()} <FaArrowRight />
        </a>
      </Link>
    </div>
  ) : null
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
