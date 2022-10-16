import '~/styles/main.css'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider, Hydrate } from '@tanstack/react-query'
import NextProgress from 'next-progress'
import useFathom from '~/components/hooks/useFathom'
import SEO from '~/../next-seo.config'
import Header from '~/components/primitives/Header'

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, refetchInterval: false } },
})

function App({
  Component,
  pageProps: { session, dehydratedState, ...pageProps },
}: AppProps & { pageProps: { session: any; dehydratedState: any } }) {
  const fathom = useFathom()
  console.info('[hydrate]', dehydratedState?.queries?.length !== undefined && dehydratedState?.queries?.length !== 0)
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#1A1B1C" />
        <meta name="msapplication-TileColor" content="#1A1B1C" />
        <meta name="theme-color" content="#1A1B1C" />
      </Head>
      <DefaultSeo {...SEO} />
      <NextProgress delay={300} color="#FFFFFF" options={{ showSpinner: false }} />
      <SessionProvider session={session}>
        <div className="flex flex-col h-full bg-fixed">
          <QueryClientProvider client={queryClient}>
            <Hydrate state={dehydratedState}>
              <Header />
              <Component {...pageProps} fathom={fathom} />
            </Hydrate>
          </QueryClientProvider>
        </div>
      </SessionProvider>
    </>
  )
}

export default App
