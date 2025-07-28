// pages/_app.js
import '../styles/globals.css'     // ini CSS Tailwind-mu
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Shopee Scraper</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
