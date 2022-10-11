import Link from 'next/link'
import * as React from 'react'

export default function Index() {
  return (
    <div className="ptfont bg-black-brushed bg-gray-900 flex justify-center items-center">
      <Link href="/game">Game</Link>
    </div>
  )
}
