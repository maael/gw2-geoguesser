import format from 'date-fns/format'
import Image from 'next/image'
import Link from 'next/link'
import { FaMedal, FaSpinner } from 'react-icons/fa'
import { avatar, medalColor } from '~/util'

export default function GamesBlock({
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
  label?: string
  type: 'score' | 'time'
}) {
  return (
    <div className="bg-brown-brushed px-5 pt-3 pb-5 drop-shadow-lg sm:flex-1 flex flex-col gap-1 w-full">
      <div className="flex flex-row gap-1 items-center">
        <div className="gwfont text-xl flex-1">{label}</div>
        {isLoading ? <FaSpinner className="animate-spin" /> : null}
      </div>
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
              <Link href={`/user/${g.userId?.username}`} prefetch={false}>
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
