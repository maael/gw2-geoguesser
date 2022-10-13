import * as React from 'react'
import { useQueries } from '@tanstack/react-query'
import { useRouter } from 'next/router'

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
      <div className="flex flex-col gap-2 justify-center items-center">
        <div>{user.username}</div>
        <div className="flex flex-col gap-1">
          {user.games.map((g) => (
            <div key={g._id} className="flex flex-row gap-1">
              <div>{g.challenge?.name || 'Random'}</div>
              <div>{g.totalScore}</div>
              <div>{g.createdAt}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
