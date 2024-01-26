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
        <meta property="og:title" content="luisschwab.net" />
    </Head>

	<Wrapper>
    	<Banner></Banner>

        <Header></Header>

        ~$ whoami 
        <br/>
        computer engineering @ <a href="https://cic.unb.br" target="_blank">unb</a> <span style={{fontFamily: 'Helvetica' }}>⚡💻</span>
        <br/>
        {/*<span style={{ margin: '0', lineHeight: '1', display: 'inline-block'}}>bitcoin <img src="https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg" style={{ height: '1em', verticalAlign: 'middle'}}></img></span>*/}
        jiujitsu <span style={{fontFamily: 'Helvetica' }}>🥋</span>
        <br/>
        bitcoin <span style={{fontFamily: 'Helvetica' }}>&#8383;</span>
        <br/>
        books <span style={{fontFamily: 'Helvetica' }}>📖</span>

        <br/>
        <br/>

        &gt;trying to understand how everything works
        <br/>
        &gt;systems should be beautiful and well engineered

        <br/>
        <br/>

        ~$ ls projects/
        <br/>
        ..
        {/*
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
        <Link href="/blog/">[...]</Link>

        <br/>
        <br/>

        ~$ <Link href="https://mempool.luisschwab.dev">open mempool.luisschwab.net</Link> (mempool.space instance)

        <br/>
        <br/>

        ~$ <Link href="https://lib.luisschwab.net">open lib.luisschwab.net</Link> (pdf collection)

        <br/>
        <br/>
        
        github: <a href="https://github.com/luisschwab" target="_blank">luisschwab</a>
        <br/>
        twitter: <a href="https://twitter.com/luisschwab_" target="_blank">@luisschwab_</a>
        <br/>
        email: luisschwab[at]pm[dot]me
        <br/>
        pgp: <a href="/F3EC3AD29E6FA7031B76.txt">F3EC 3AD2 9E6F A703 1B76</a>
        <br/>
        
        <div style={{textAlign: 'center'}}>
            <br/>.<br/>.<br/>.
        </div>
        
        <QOTD></QOTD>

        <br/>
        <br/>
        </Wrapper>

        </>
    );
}