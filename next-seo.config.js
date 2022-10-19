const title = 'Guild Wars 2 | Geo Guesser'
const description = 'How well do you know the world of Guild Wars 2?'
const url = 'https://gw2-geoguesser.mael.tech'

export default {
  title,
  description,
  openGraph: {
    title,
    description,
    url,
    site_name: title,
    type: 'website',
    locale: 'en_GB',
    images: [
      {
        url: `${url}/preview.png`,
        width: 1200,
        height: 627,
        alt: 'Guild Wars 2 | Geo Guesser',
      },
    ],
  },
}
