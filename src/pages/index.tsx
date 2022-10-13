import Link from 'next/link'
import * as React from 'react'
import { useQueries } from '@tanstack/react-query'

export default function Index() {
  const [
    { data: daily },
    { data: monthly },
    { data: recentDailyGames },
    { data: highDailyGames },
    { data: recentMonthlyGames },
    { data: highMonthlyGames },
  ] = useQueries({
    queries: [
      { queryKey: ['daily-challenge'], queryFn: () => fetch('/api/internal/challenge/daily').then((r) => r.json()) },
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
      <div className="flex flex-col gap-2 justify-center items-center">
        <Link href="/game/random">Quick Game</Link>
        {daily ? <Link href="/game/daily">{daily.name}</Link> : null}
        {monthly ? <Link href="/game/monthly">{monthly.name}</Link> : null}
        <GamesBlock games={recentDailyGames} label={'Recent Daily Games'} />
        <GamesBlock games={highDailyGames} label={'High Daily Games'} />
        <GamesBlock games={recentMonthlyGames} label={'Recent Monthly Games'} />
        <GamesBlock games={highMonthlyGames} label={'High Monthly Games'} />
      </div>
    </div>
  )
}

function GamesBlock({ games, label }: any) {
  return games && !games.error ? (
    <div>
      <div>{label}</div>
      <div>{games.challenge.name}</div>
      <div>
        {games.games.map((g) => (
          <div key={g.id} className="flex flex-col sm:flex-row gap-2">
            <Link href={`/user/${g.userId.username}`}>{g.userId.username}</Link>
            <div>{g.totalScore}</div>
            <div>{g.createdAt}</div>
          </div>
        ))}
      </div>
    </div>
  ) : null
}
