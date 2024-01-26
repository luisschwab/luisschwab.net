import Link from "next/link";
import Head from "next/head";

import Wrapper from "@/components/wrapper";
import Banner from "@/components/banner";
import Title from "@/components/title";

export default function Custom404() {
    return (
        <>
        <Head>
            <title>404 not found</title>
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
                src="/img/milei.jpg"
                alt="Javier Milei"
                width="80%"
            />

        </Wrapper>
        </>
    );
}