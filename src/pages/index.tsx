import dynamic from 'next/dynamic'

const Map = dynamic(() => import('~/components/primitives/Map'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
})

export default function Index() {
  return (
    <div suppressHydrationWarning className="bg-purple-300 text-purple-800 flex justify-center items-center">
      <Map />
    </div>
  )
}
