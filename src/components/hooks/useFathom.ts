import { useEffect } from 'react'
import { useRouter } from 'next/router'
import * as FathomClient from 'fathom-client'

const ID = process.env.FATHOM_ID || 'EIJUNWWI'

export type Fathom = typeof FathomClient

export const EVENTS = {
  Signin: 'WUKKM8SS',
  Register: 'RMLL1R4C',
  StartGame: 'YWX7HTHN',
  FinishGame: '7XZ3PJYS',
}

export default function useFathom() {
  const router = useRouter()
  useEffect(() => {
    if (!ID) {
      console.warn('[warn]', 'No Fathom ID set')
      return
    }

    // Initialize Fathom when the app loads
    FathomClient.load(ID, {
      excludedDomains: ['localhost'],
    })

    function onRouteChangeComplete() {
      FathomClient.trackPageview()
    }
    // Record a pageview when route changes
    router.events.on('routeChangeComplete', onRouteChangeComplete)

    // Unassign event listener
    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return FathomClient
}
