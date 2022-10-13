import Image from 'next/image'
import Link from 'next/link'
import { FaUser, FaSignOutAlt } from 'react-icons/fa'
import { useSession, signOut } from 'next-auth/react'
import logoImg from '../../../public/logo.png'

export default function Header() {
  const { data: session } = useSession()

  return (
    <div>
      <div className="max-w-6xl w-full mx-auto h-12 px-1 py-2 flex flex-row gap-6 items-center text-white">
        <Link href="/">
          <div className="flex flex-row gap-2 h-full items-center flex-1">
            <div className="relative h-full aspect-square">
              <Image src={logoImg} layout="fill" />
            </div>
            <h1 className="gwfont text-xl hidden sm:block">Guild Wars 2 | Geo Guesser</h1>
          </div>
        </Link>
        <Link href="/game/random">
          <button className="gwfont bg-brown-brushed rounded-full px-4 py-1 hover:scale-110 transition-transform drop-shadow-lg">
            New Game
          </button>
        </Link>
        {session ? (
          <Link href={`/user/${session.user?.name}`}>
            <div className="gwfont flex flex-row gap-2 justify-center items-center bg-brown-brushed rounded-full px-4 py-1 hover:scale-110 transition-transform drop-shadow-lg">
              <FaUser />
              {session.user?.name}
            </div>
          </Link>
        ) : null}
        {session ? (
          <button
            onClick={async () => {
              await signOut({ redirect: false })
              window.location.assign('/')
            }}
            className="gwfont flex flex-row gap-2 justify-center items-center bg-brown-brushed rounded-full px-4 py-1 hover:scale-110 transition-transform drop-shadow-lg"
          >
            <FaSignOutAlt />
            Sign Out
          </button>
        ) : (
          <Link href="/auth">
            <div className="gwfont flex flex-row gap-2 justify-center items-center bg-brown-brushed rounded-full px-4 py-1 hover:scale-110 transition-transform drop-shadow-lg">
              <FaUser />
              Sign In | Register
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}
