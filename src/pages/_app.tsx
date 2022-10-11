import '~/styles/main.css'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import useFathom from '~/components/hooks/useFathom'
import SEO from '~/../next-seo.config'
import Header from '~/components/primitives/Header'

function App({ Component, pageProps }: AppProps) {
  useFathom()
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <DefaultSeo {...SEO} />
      <div className="ptfont bg-black-brushed bg-gray-900 flex flex-col h-full">
        <Header />
        <Component {...pageProps} />
      </div>
    </>
  )
}

export default App
