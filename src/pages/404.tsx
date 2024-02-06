import Link from "next/link";
import Head from "next/head";

import Wrapper from "@/components/wrapper";
import Banner from "@/components/banner";
import Title from "@/components/title";

export default function Custom404() {

    return (
        <>
        <Head>
            <title>404 not found | luisschwab.net</title>

            <meta name="title" content="404 Not Found | luisschwab.net"/>

            <meta property="og:title" content="404 Not Found"/>
            <meta property="og:image" content="https://luisschwab.net/img/diogenes.jpg"/>

            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:image" content="https://luisschwab.net/img/diogenes.jpg"/>
            <meta name="twitter:domain" content="luisschwab.net"/>
            <meta name="twitter:title" content="404 Not Found"/>
            <meta name="twitter:description" content="404 Not Found"/>
        </Head>
        
        <Wrapper>
            <Banner></Banner>

            <Title content={"404 Not Found"}></Title>

            <div style={{ marginTop: '-5vh', fontFamily: 'grotesk-sharp', fontWeight: 600, fontSize: '21px'}}>
                <Link href="/">&larr; main page</Link>
            </div>

            <br/>
            <br/>

            <img
                src="/img/k.jpg"
                alt="Officer K stares blankly"
                width="80%"
            />

        </Wrapper>
        </>
    );
}
