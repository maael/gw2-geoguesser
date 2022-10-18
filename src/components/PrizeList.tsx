import Image from 'next/image'
import { FaDice, FaMedal } from 'react-icons/fa'
import cls from 'classnames'
import { medalColor } from '~/util'

export default function PrizeList({ prizes }: { prizes?: any }) {
  return (
    <div className="flex flex-col gap-1 items-center">
      <h4 className="text-xl">Prizes</h4>
      <div className="flex flex-col justify-start items-center w-full gap-2 px-5 mb-2">
        <p
          className={cls('flex flex-row gap-2.5 justify-center items-center text-base', {
            'opacity-50': !prizes?.first,
          })}
        >
          <FaMedal className="text-sm" style={{ color: medalColor[0] }} /> <Prize prize={prizes?.first} />
        </p>
        <p
          className={cls('flex flex-row gap-2.5 justify-center items-center text-base', {
            'opacity-50': !prizes?.second,
          })}
        >
          <FaMedal className="text-sm" style={{ color: medalColor[1] }} /> <Prize prize={prizes?.second} />
        </p>
        <p
          className={cls('flex flex-row gap-2.5 justify-center items-center text-base', {
            'opacity-50': !prizes?.third,
          })}
        >
          <FaMedal className="text-sm" style={{ color: medalColor[2] }} /> <Prize prize={prizes?.third} />
        </p>
        <p
          className={cls('flex flex-row gap-1.5 justify-center items-center text-sm', {
            'opacity-50': !prizes?.entry,
          })}
          title="Just by playing you enter a lottery to get a prize"
        >
          <FaDice className="text-sm" /> Entry Lottery <Prize prize={prizes?.entry} />
        </p>
      </div>
    </div>
  )
}

function Prize({ prize }: { prize?: string }) {
  const finalPrize = prize || '0g'
  if (finalPrize.endsWith('g')) {
    return (
      <span className="flex flex-row gap-1 justify-center items-center">
        {finalPrize.slice(0, -1)}
        <Image src="/ui/gold.png" height={15} width={15} title="In-game gold" />
      </span>
    )
  } else {
    return <>finalPrize</>
  }
}
