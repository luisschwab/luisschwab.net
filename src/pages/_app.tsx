import Head from 'next/head';
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>luisschwab.net</title>

                <link rel="icon" href="/img/luisschwab-red.jpg"/>
                
                <meta property="og:image" content="https://luisschwab.net/img/diogenes.jpg"/>
                
                <meta name="twitter:site" content="@luisschwab_" />
            </Head>

            <Component {...pageProps} />
          </>
    );
}
