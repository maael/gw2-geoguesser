import { useLayoutEffect, useState } from 'react'

export const IMAGE_HOST_KEY = 'geo-image-host'

export default function useImageHost() {
  const [host, setHost] = useState('mael-cdn.com')
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      console.info('what', localStorage.getItem(IMAGE_HOST_KEY))
      setHost(localStorage.getItem(IMAGE_HOST_KEY) || 'mael-cdn.com')
    }
  }, [])
  console.info('what', host)
  return host
}
