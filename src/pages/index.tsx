import dynamic from 'next/dynamic'

const Map = dynamic(() => import('~/components/primitives/Map'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
})

export default function Index() {
  return (
    <div suppressHydrationWarning className="bg-purple-300 text-purple-800 flex justify-center items-center">
      <div className="flex flex-row bg-green-200 w-full h-full justify-center items-center">
        <div className="h-4/5 w-full bg-slate-500"></div>
      </div>
      <div className="flex flex-col absolute top-10 right-0 bg-gray-300 pl-10 pr-20 py-2 text-xl rounded-l-full">
        <div>Round: 1/5</div>
        <div>Score: 0</div>
      </div>
      <div className="absolute bottom-10 right-10 w-1/2 h-3/5 scale-50 hover:scale-100 origin-bottom-right transition-all opacity-50 hover:opacity-100">
        <div className="isolate w-full h-full">
          <Map />
        </div>
        <button className="absolute left-1/2 bottom-5 bg-red-200 z-50 px-3 py-2">Guess</button>
      </div>
    </div>
  )
}
