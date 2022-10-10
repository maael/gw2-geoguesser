import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Cagliostro&display=optional" rel="stylesheet" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#1A1B1C" />
        <meta name="msapplication-TileColor" content="#1A1B1C" />
        <meta name="theme-color" content="#1A1B1C" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
