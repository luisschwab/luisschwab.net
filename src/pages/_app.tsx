import Head from 'next/head';
import type { AppProps } from 'next/app'

import '@/styles/globals.css'

// highlight.js
import '@/styles/humanoid-dark.css';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>luisschwab.net</title>

                <link rel="icon" href="/img/headshot.jpg"/>
                
                <meta name="twitter:site" content="@luisschwab_"/>

                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

            </Head>

            <Component {...pageProps} />
          </>
    );
}
