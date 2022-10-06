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

export default function Map() {
  const [marker, setMarker] = useState(null)
  const [distance, setDistance] = useState(null)
  const [locationLongLat, setLocationLongLat] = useState(null)
  const [coordX] = useState(49704)
  const [coordY] = useState(39984)
  return (
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
      {/** TODO: Replace with own tile service */}
      <TileLayer url="https://tiles.tinyarmy.org/1/1/{z}/{x}/{y}.jpg" noWrap={true} minZoom={1} maxZoom={7} />
      <AttributionControl prefix={`Tiles by <a href="https://blog.thatshaman.com/" target="_blank">that_shaman</a>`} />
      <Setup
        locationLongLat={locationLongLat}
        marker={marker}
        setMarker={setMarker}
        setDistance={setDistance}
        setLocationLongLat={setLocationLongLat}
        coordsX={coordX}
        coordsY={coordY}
      />
      {marker ? <Marker title="Your guess" icon={myIcon} position={marker} /> : null}
      {locationLongLat ? <Marker title="Your guess" icon={myIcon} position={locationLongLat} /> : null}
      {marker && locationLongLat ? (
        <Polyline
          positions={[marker, locationLongLat]}
          pathOptions={{ color: '#7DDA59', dashArray: '10, 10', weight: 5 }}
        >
          <Tooltip direction="bottom" offset={[0, 20]} opacity={1} permanent={true}>
            {distance}m
          </Tooltip>
        </Polyline>
      ) : null}
    </MapContainer>
  )
}

function Setup({
  locationLongLat,
  marker,
  setMarker,
  setDistance,
  setLocationLongLat,
  coordsX,
  coordsY,
}: {
  locationLongLat: any
  marker: any
  setMarker: any
  setDistance: any
  setLocationLongLat: any
  coordsX: any
  coordsY: any
}) {
  const map = useMap()

  useEffect(() => {
    const northWest = map.unproject([0, 0], MAX_ZOOM)
    const southEast = map.unproject([81920, 114688], MAX_ZOOM)
    const mapbounds = new L.LatLngBounds(northWest, southEast)
    map.setMaxBounds(mapbounds)
  }, [map, setLocationLongLat])

  useEffect(() => {
    if (!isNaN(coordsX) && !isNaN(coordsY)) {
      setLocationLongLat(map.unproject([coordsX, coordsY], MAX_ZOOM))
    }
  }, [map, setLocationLongLat, coordsX, coordsY])

  useEffect(() => {
    if (!marker || !locationLongLat) return
    const bounds = new L.LatLngBounds([marker, locationLongLat])
    map.fitBounds(bounds)

    const distance = map.distance(marker, locationLongLat)
    setDistance(distance)
  }, [map, marker, locationLongLat, setDistance])

  useMapEvents({
    click(e) {
      console.info('CLICK', e)
      setMarker({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      })
    },
  })
  return null
}
