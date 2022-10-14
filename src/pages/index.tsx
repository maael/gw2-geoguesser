import Link from 'next/link'
import * as React from 'react'
import { useQueries } from '@tanstack/react-query'
import format from 'date-fns/format'
import { avatar } from '~/util'
import Image from 'next/image'
import { FaArrowRight, FaBeer } from 'react-icons/fa'
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
    ],
  })
  return (
    <>
      <div className="ptfont flex flex-col justify-center items-center text-white">
        <div className="flex flex-col gap-7 justify-center items-center max-w-5xl w-full sm:text-lg px-2">
          <div className="text-2xl sm:text-4xl text-center mt-3 sm:mt-7 gwfont">Think you know Tyria?</div>
          <div className="flex flex-col justify-center items-center gap-2 w-full px-2 my-1">
            <Link href="/game/random">
              <a className="text-2xl text-center bg-brown-brushed rounded-full drop-shadow-md hover:scale-110 transition-transform px-5 py-1 flex flex-row gap-2 justify-center items-center">
                Quick Game <FaArrowRight />
              </a>
            </Link>
            <div className="gwfont text-xl sm:text-3xl mt-2">Ranked Games</div>
            <div className="text-center">
              <Link href="/auth">
                <a className="underline">Sign up or Log in</a>
              </Link>{' '}
              to play fixed ranked games!
            </div>
            <div className="flex flex-col sm:flex-row gap-1 text-center mb-2">
              Time until new Ranked game:
              <Countdown />
            </div>
            <div className="flex flex-row justify-center items-center gap-2">
              {daily ? (
                <Link href="/game/daily">
                  <a className="text-center bg-brown-brushed rounded-full drop-shadow-md hover:scale-110 transition-transform px-5 py-1">
                    {daily.name}
                  </a>
                </Link>
              ) : null}
              {weekly ? (
                <Link href="/game/weekly">
                  <a className="text-center bg-brown-brushed rounded-full drop-shadow-md hover:scale-110 transition-transform px-5 py-1">
                    {weekly.name}
                  </a>
                </Link>
              ) : null}
              {monthly ? (
                <Link href="/game/monthly">
                  <a className="text-center bg-brown-brushed rounded-full drop-shadow-md hover:scale-110 transition-transform px-5 py-1">
                    {monthly.name}
                  </a>
                </Link>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 w-full">
            <GamesBlock games={recentDailyGames} isLoading={recentDailyGamesLoading} label={'Recent Daily Games'} />
            <GamesBlock games={highDailyGames} isLoading={highDailyGamesLoading} label={'High Daily Games'} />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 w-full">
            <GamesBlock games={recentWeeklyGames} isLoading={recentWeeklyGamesLoading} label={'Recent Weekly Games'} />
            <GamesBlock games={highWeeklyGames} isLoading={highWeeklyGamesLoading} label={'High Weekly Games'} />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 w-full">
            <GamesBlock
              games={recentMonthlyGames}
              isLoading={recentMonthlyGamesLoading}
              label={'Recent Monthly Games'}
            />
            <GamesBlock games={highMonthlyGames} isLoading={highMonthlyGamesLoading} label={'High Monthly Games'} />
          </div>
        </div>
      </div>
      <div className="flex-1" />
      <div className="max-w-3xl mx-auto text-white py-2 text-xs flex flex-row gap-5 justify-center items-end text-center">
        <a href="https://elonian-gallery.com/">Avatars © Ilona Iske 2022</a>
        <a href="https://www.buymeacoffee.com/matte" className="flex flex-row gap-1 justify-center items-end">
          Enjoying the game? Get me a beer. <FaBeer />
        </a>
      </div>
    </>
  )
}

function GamesBlock({
  games,
  label,
  isLoading,
}: {
  isLoading: boolean
  games?: {
    error?: string
    challenge?: { name: string }
    totalGames?: number
    games?: { _id: string; userId: { username: string; image: string }; totalScore: number; createdAt: string }[]
  }
  label: string
}) {
  return (
    <div className="bg-brown-brushed px-5 pt-3 pb-5 drop-shadow-lg sm:flex-1 flex flex-col gap-1">
      <div className="gwfont text-lg sm:text-xl">{label}</div>
      <div className="flex flex-col sm:flex-row items-center">
        <div className="sm:flex-1">{games?.challenge?.name}</div>
        <div className="text-sm">
          {games?.games?.length} of {games?.totalGames || '??'} entr{games?.totalGames === 1 ? 'y' : 'ies'}
        </div>
      </div>
      <div className="my-2">
        <div
          className="flex flex-row gap-2 px-3 py-1 gwfont"
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
              className="flex flex-row gap-2 px-3 py-1 text-md"
              style={{
                backgroundColor: idx % 2 === 1 ? 'rgba(96, 76, 52, 0.5)' : 'rgba(55, 45, 35, 0.2)',
              }}
            >
              <Link href={`/user/${g.userId.username}`}>
                <a className="w-2/5 text-center sm:text-left flex flex-row gap-2 items-center">
                  <Image src={avatar(g.userId.image)} height={25} width={25} className="rounded-full" />{' '}
                  {g.userId.username}
                </a>
              </Link>
              <div className="w-1/5 text-center">{g.totalScore}</div>
              <div className="w-2/5 text-right">{format(new Date(g.createdAt), 'HH:mm do MMM yyyy')}</div>
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
