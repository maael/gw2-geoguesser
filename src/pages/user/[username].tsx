import * as React from 'react'
import { useQueries } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import format from 'date-fns/format'

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
  if (!user) return null
  return (
    <div className="ptfont bg-black-brushed bg-gray-900 flex justify-center items-center text-white">
      <div className="flex flex-col gap-2 justify-center items-center max-w-5xl w-full px-2 sm:px-4">
        <div className="gwfont text-4xl sm:text-6xl mt-2">{user.username}</div>
        <div
          className="flex flex-col justify-center bg-brown-brushed px-6 pt-4 pb-6 drop-shadow-lg w-full text-xl"
          style={{ minHeight: '20vh' }}
        >
          <div
            className="flex flex-col sm:flex-row gap-2 px-3 py-1 text-2xl"
            style={{
              backgroundColor: 'rgba(96, 76, 52, 0.5)',
            }}
          >
            <div className="w-1/3">User</div>
            <div className="w-1/3 text-center">Score</div>
            <div className="w-1/3 text-right">Time</div>
          </div>
          {user.games.map((g, idx) => (
            <div
              key={g._id}
              className="flex flex-row gap-1 px-3 py-1"
              style={{
                backgroundColor: idx % 2 === 1 ? 'rgba(96, 76, 52, 0.5)' : 'rgba(55, 45, 35, 0.2)',
              }}
            >
              <div className="w-1/3">{g.challenge?.name || 'Random'}</div>
              <div className="w-1/3 text-center">{g.totalScore}</div>
              <div className="w-1/3 text-right">{format(new Date(g.createdAt), 'HH:mm do MMM yyyy')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}