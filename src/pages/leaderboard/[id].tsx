import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import GamesBlock from '~/components/primitives/GamesBlock'

export default function ChallengeLeaderboard() {
  const { query } = useRouter()
  const id = query.id?.toString()
  const { data, isLoading } = useQuery(
    ['leaderboard', id],
    () => fetch(`/api/internal/game/${id}?sort=score&limit=100`).then((r) => r.json()),
    { enabled: !!id }
  )
  return (
    <div className="flex flex-col justify-center items-center max-w-5xl w-full mx-auto text-white pt-10">
      <GamesBlock label="Leaderboard" games={data} isLoading={isLoading} type="score" />
    </div>
  )
}
