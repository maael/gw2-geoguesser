import '~/styles/main.css'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import { SessionProvider } from 'next-auth/react'
import useFathom from '~/components/hooks/useFathom'
import SEO from '~/../next-seo.config'
import Header from '~/components/primitives/Header'

function App({ Component, pageProps: { session, ...pageProps } }: AppProps & { pageProps: { session: any } }) {
  useFathom()
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <DefaultSeo {...SEO} />
      <SessionProvider session={session}>
        <div className="ptfont bg-black-brushed bg-gray-900 flex flex-col h-full">
          <Header />
          <Component {...pageProps} />
        </div>
      </SessionProvider>
    </>
  )
}

export default App
