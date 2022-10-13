import Link from 'next/link'
import * as React from 'react'
import { useQueries } from '@tanstack/react-query'
import format from 'date-fns/format'
import { avatar } from '~/util'
import Image from 'next/image'

export default function Index() {
  const [
    { data: daily },
    { data: weekly },
    { data: monthly },
    { data: recentDailyGames },
    { data: highDailyGames },
    { data: recentWeeklyGames },
    { data: highWeeklyGames },
    { data: recentMonthlyGames },
    { data: highMonthlyGames },
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
    <div className="ptfont bg-black-brushed bg-gray-900 flex justify-center items-center text-white">
      <div className="flex flex-col gap-7 justify-center items-center max-w-5xl w-full sm:text-lg px-2">
        <div className="flex flex-col justify-center items-center gap-2 w-full px-2 mt-2">
          <Link href="/game/random">
            <a className="text-center bg-brown-brushed rounded-full drop-shadow-md hover:scale-110 transition-transform px-3 py-1">
              Quick Game
            </a>
          </Link>
          <div className="grid grid-cols-3 gap-2">
            {daily ? (
              <Link href="/game/daily">
                <a className="text-center bg-brown-brushed rounded-full drop-shadow-md hover:scale-110 transition-transform px-3 py-1">
                  {daily.name}
                </a>
              </Link>
            ) : null}
            {weekly ? (
              <Link href="/game/weekly">
                <a className="text-center bg-brown-brushed rounded-full drop-shadow-md hover:scale-110 transition-transform px-3 py-1">
                  {weekly.name}
                </a>
              </Link>
            ) : null}
            {monthly ? (
              <Link href="/game/monthly">
                <a className="text-center bg-brown-brushed rounded-full drop-shadow-md hover:scale-110 transition-transform px-3 py-1">
                  {monthly.name}
                </a>
              </Link>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 w-full">
          <GamesBlock games={recentDailyGames} label={'Recent Daily Games'} />
          <GamesBlock games={highDailyGames} label={'High Daily Games'} />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 w-full">
          <GamesBlock games={recentWeeklyGames} label={'Recent Weekly Games'} />
          <GamesBlock games={highWeeklyGames} label={'High Weekly Games'} />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 w-full">
          <GamesBlock games={recentMonthlyGames} label={'Recent Monthly Games'} />
          <GamesBlock games={highMonthlyGames} label={'High Monthly Games'} />
        </div>
      </div>
    </div>
  )
}

function GamesBlock({ games, label }: any) {
  return games && !games.error ? (
    <div className="bg-brown-brushed px-5 pt-3 pb-5 drop-shadow-lg sm:flex-1 flex flex-col gap-1">
      <div className="gwfont text-lg sm:text-xl">{label}</div>
      <div>{games.challenge.name}</div>
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
        {games && games.games.length > 0 ? (
          games.games.map((g, idx) => (
            <div
              key={g.id}
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
        ) : (
          <div className="text-center">No scores!</div>
        )}
      </div>
    </div>
  ) : null
}
