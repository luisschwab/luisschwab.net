import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

import Wrapper from "@/components/wrapper";
import Banner from "@/components/banner";
import Header from "@/components/header";
import QOTD from "@/components/qotd";

export default function Home() {
return (
    <>
    <Head>
        <meta name="title" content="luisschwab.net"/>
            
        <meta property="og:title" content="luisschwab"/>
        <meta property="og:image" content="http://luisschwab.net/img/diogenes.jpg"/>

        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:image" content="http://luisschwab.net/img/diogenes.jpg"/>
        <meta name="twitter:domain" content="luisschwab.net/"/>
        <meta name="twitter:url" content="https://luisschwab.net"/>
        <meta name="twitter:title" content="luisschwab"/>
    </Head>

	<Wrapper>
    	<Banner></Banner>

        <Header></Header>

        ~$ whoami 
        <br/>
        computer engineering @ <a href="https://cic.unb.br" target="_blank">unb</a>
        
        {/*
        <br/>
        jiujitsu <span style={{fontFamily: 'Helvetica' }}>🥋</span>
        <br/>
        bitcoin <span style={{fontFamily: 'Helvetica' }}>&#8383;</span>
        <br/>
        books <span style={{fontFamily: 'Helvetica' }}>📖</span>
        */}

        <br/>
        <br/>

        &gt;trying to understand how everything works
        <br/>
        &gt;systems should be beautiful and well engineered

        {/*
        <br/>
        <br/>

        ~$ ls projects/
        <br/>
        ..
        <Link href="https://civilization.energy">
            https://civilization.energy
            <div className="hover-box">
            How much energy does human
            civilization consume? How much more could we consume?
            </div>
        </Link>
        */}

        <br/>
        <br/>

        ~$ ls <Link href="/blog">blog/</Link>
        <br/>
        <Link href="/blog/sovereign-bitcoin-stack">sovereign-bitcoin-stack.md</Link>
        <br/>
        <Link href="/blog/books-2024">books-of-2024.md</Link>
        <br/>
        <Link href="/blog/">[...]</Link>

        <br/>
        <br/>

        ~$ <Link href="https://mempool.luisschwab.net">open mempool.luisschwab.net</Link> (self-hosted Mempool)

        <br/>
        <br/>

        ~$ <Link href="https://lib.luisschwab.net">open lib.luisschwab.net</Link> (pdf collection)

        <br/>
        <br/>
        
        github: <a href="https://github.com/luisschwab" target="_blank">luisschwab</a>
        <br/>
        twitter: <a href="https://twitter.com/luisschwab_" target="_blank">@luisschwab_</a>
        <br/>
        pgp: <a href="/F3EC3AD29E6FA7031B76.txt">F3EC 3AD2 9E6F A703 1B76</a>
        <br/>
        email: luisschwab[at]pm[dot]me
        <br/>
        
        <div style={{textAlign: 'center'}}>
            <br/>.<br/>.<br/>.
        </div>
        
        <QOTD></QOTD>

    </Wrapper>
    </>
    );
}
