import { useEffect } from 'react'
import { useRouter } from 'next/router'
import * as Fathom from 'fathom-client'

const ID = process.env.FATHOM_ID || ''

export default function useFathom() {
  const router = useRouter()
  useEffect(() => {
    if (!ID) {
      console.warn('[warn]', 'No Fathom ID set')
      return
    }

    // Initialize Fathom when the app loads
    Fathom.load(ID, {
      excludedDomains: ['localhost'],
    })

    function onRouteChangeComplete() {
      Fathom.trackPageview()
    }
    // Record a pageview when route changes
    router.events.on('routeChangeComplete', onRouteChangeComplete)

    // Unassign event listener
    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
