import Head from 'next/head'

export default function EmojiFavicon({ emoji }: { emoji: string }) {
  const isLocal = process.env.NODE_ENV === 'development'
  return (
    <Head>
      <link
        rel="icon"
        href={`data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" ${
          isLocal ? `style="filter: hue-rotate(90deg) opacity(50%);"` : ''
        } viewBox="0 0 100 100">
  <text y=".9em" font-size="81">${emoji}</text>
  ${isLocal ? `<circle cx="80" cy="80" r="20" fill="rgb(65,105,225)" fill-opacity="0.8" />` : ''}
</svg>`}
      ></link>
    </Head>
  )
}
