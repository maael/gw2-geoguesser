import { useEffect, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
  Marker,
  Polyline,
  Tooltip,
  AttributionControl,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const myIcon = L.icon({
  iconUrl: 'guess-icon-green.png',
  iconSize: [32, 32],
  iconAnchor: [16, 34],
})

const MAX_ZOOM = 7

export default function Map({
  guessLocation = [null, null],
  onGuess,
  guessId,
  showGuessLocation,
}: {
  guessLocation: Readonly<[number | null, number | null]>
  onGuess: (score: number) => void
  guessId: string
  showGuessLocation: boolean
}) {
  const [distance, setDistance] = useState(null)
  return (
    <>
      <div className="isolate w-full h-full relative">
        <MapContainer
          center={[-241, 368]}
          zoom={3}
          minZoom={2}
          maxZoom={MAX_ZOOM}
          style={{ height: '100%', width: '100%', background: '#032A32' }}
          crs={L.CRS.Simple}
          maxBoundsViscosity={1}
          attributionControl={false}
        >
          <MapInner
            guessLocation={guessLocation}
            distance={distance}
            setDistance={setDistance}
            guessId={guessId}
            showGuessLocation={showGuessLocation}
          />
        </MapContainer>
      </div>
      {showGuessLocation ? null : (
        <button
          className="absolute left-1/2 bottom-5 bg-red-200 z-50 px-3 py-2"
          onClick={() => {
            onGuess(Number(Math.max(500 - Math.pow(distance || 0, Math.sqrt(Math.E)), 0).toFixed(0)))
          }}
        >
          Guess
        </button>
      )}
    </>
  )
}

function MapInner({ guessLocation, distance, setDistance, guessId, showGuessLocation }: any) {
  const [marker, setMarker] = useState(null)
  const locationLongLat = useLocationLongLat(guessLocation)
  useEffect(() => {
    setMarker(null)
    setDistance(null)
  }, [guessId, setMarker, setDistance])
  useSetup({
    locationLongLat,
    marker,
    setMarker,
    setDistance,
    showGuessLocation,
  })
  return (
    <>
      {/** TODO: Replace with own tile service */}
      <TileLayer url="https://tiles.tinyarmy.org/1/1/{z}/{x}/{y}.jpg" noWrap={true} minZoom={1} maxZoom={7} />
      <AttributionControl prefix={`Tiles by <a href="https://blog.thatshaman.com/" target="_blank">that_shaman</a>`} />
      {marker ? <Marker title="Your guess" icon={myIcon} position={marker} /> : null}
      {showGuessLocation && locationLongLat ? (
        <Marker title="The location" icon={myIcon} position={locationLongLat} />
      ) : null}
      {marker && locationLongLat && showGuessLocation ? (
        <Polyline
          positions={[marker, locationLongLat]}
          pathOptions={{ color: '#7DDA59', dashArray: '10, 10', weight: 5 }}
        >
          <Tooltip direction="bottom" offset={[0, 20]} opacity={1} permanent={true}>
            {distance}m
          </Tooltip>
        </Polyline>
      ) : null}
    </>
  )
}

function useLocationLongLat(guessLocation: Readonly<[number | null, number | null]>) {
  const map = useMap()
  const coords = guessLocation[0] === null || guessLocation[1] === null ? null : (guessLocation as [number, number])
  return coords ? map.unproject([coords[0], coords[1]], MAX_ZOOM) : null
}

function useSetup({
  locationLongLat,
  marker,
  setMarker,
  setDistance,
  showGuessLocation,
}: {
  locationLongLat: any
  marker: any
  setMarker: any
  setDistance: any
  showGuessLocation: boolean
}) {
  const map = useMap()

  useEffect(() => {
    const northWest = map.unproject([0, 0], MAX_ZOOM)
    const southEast = map.unproject([81920, 114688], MAX_ZOOM)
    const mapbounds = new L.LatLngBounds(northWest, southEast)
    map.setMaxBounds(mapbounds)
  }, [map])

  useEffect(() => {
    if (showGuessLocation) {
      const bounds = new L.LatLngBounds([marker, locationLongLat])
      map.fitBounds(bounds)
    }
  }, [marker, showGuessLocation, locationLongLat, map])

  useMapEvents({
    click(e) {
      if (showGuessLocation) return
      const newMarker = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      }
      setMarker(newMarker)

      const distance = map.distance(newMarker, locationLongLat)
      setDistance(distance)
    },
  })
}
