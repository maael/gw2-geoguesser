import Image from 'next/image'
import Link from 'next/link'
import { FaUser } from 'react-icons/fa'

export default function Header() {
  return (
    <div>
      <div className="max-w-6xl w-full mx-auto h-12 px-1 py-2 flex flex-row gap-6 items-center text-white">
        <Link href="/">
          <div className="flex flex-row gap-2 h-full items-center flex-1">
            <div className="relative h-full aspect-square">
              <Image src="/logo.png" layout="fill" />
            </div>
            <h1 className="gwfont text-xl hidden sm:block">Guild Wars 2 | Geo Guesser</h1>
          </div>
        </Link>
        <Link href="/game">
          <button className="gwfont bg-brown-brushed rounded-full px-4 py-1 hover:scale-110 transition-transform drop-shadow-lg">
            New Game
          </button>
        </Link>
        <div className="gwfont flex flex-row gap-2 justify-center items-center bg-brown-brushed rounded-full px-4 py-1 hover:scale-110 transition-transform drop-shadow-lg">
          <FaUser />
          Sign in
        </div>
      </div>
    </div>
  )
}
