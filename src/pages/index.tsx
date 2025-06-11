import Link from "next/link";
import Head from "next/head";

import Wrapper from "@/components/wrapper";
import Banner from "@/components/banner";
import QOTD from "@/components/qotd";

import { getSortedPostsData } from '../lib/posts';

export async function getStaticProps() {
	const allPostsData: any = getSortedPostsData();

    // show n latest blogs
    const n = 5
    const latestPostsData = allPostsData
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, n)

	return {
		props: {
			latestPostsData,
		},
	};
}

export default function Home({ latestPostsData }) {
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
        <br/>
        <div className="title">Luis Henrique Schwab</div>
        <br/>
        
        <div className="title">About</div>
        <div style={{marginTop: "0", marginBottom: "-2em"}}>
            * Computer Engineering @ Universidade de Brasília
            <br/>
            * Fellow @ <a href="https://vinteum.org"><b>Vinteum</b></a>, currently working on <a href="https://github.com/luisschwab/bdk-floresta"><b>bdk-floresta</b></a>
            <br/>
            * Interested in tech that transfers power from the state to the individual
        </div>
        <br/>
        <br/>

        <Link href="/blog"><div className="title">Blog</div></Link>
        <div style={{marginTop: "0", marginBottom: "-2em"}}>
            {latestPostsData.map(({ id, title }) => (
                <>
                    * <span key={id}><Link href={"blog/" + id}>{title}</Link></span>
                    <br/>
                </>
            ))}
        </div>

        <br/>
        <br/>

        <div className="title">Projects</div>
        <div style={{marginTop: "0", marginBottom: "-2em"}}>
            <span>* <a href="https://github.com/luisschwab/bdk-floresta"><b>bdk-floresta</b>: Floresta-powered chain source crate for BDK</a></span>
            <br/>
            <span>* <a href="https://github.com/luisschwab/fakhr"><b>fakhr</b>: vanity bitcoin address and nostr key generator</a></span>
            <br/>
            <span>* <a href="https://github.com/luisschwab/getaddress"><b>getaddress</b>: bitcoin p2p crawler</a></span>
        </div>

        <br/>
        <br/>

        <div className="title">Lightning Network</div>
        <div style={{overflowWrap: 'break-word'}}>
            *&nbsp;<a href="https://mempool.luisschwab.net/lightning/node/022e6daa0464a77800ef0ad117497d687e21bab35b15672a7f9de7d8541b042f17">
                022e6daa0464a77800ef0ad117497d687e21bab35b15672a7f9de7d8541b042f17
                </a>
                @209.126.80.42:9735
            <br/> 
            *&nbsp;<a href="https://mempool.luisschwab.net/lightning/node/022e6daa0464a77800ef0ad117497d687e21bab35b15672a7f9de7d8541b042f17">
                022e6daa0464a77800ef0ad117497d687e21bab35b15672a7f9de7d8541b042f17
            </a>
            @fp7joq2n66kq5oem3uweaov4ndeu4ulb2mzk6v34zgkrgmradpcmwxyd.onion:9735
            <br/>
            * 0 base-fee + 250 ppm
            <br/>
            * 1M sat minimum chansize
        </div>

        
        <br/>

        <div className="title">Self-Hosted Stuff</div>
        <div style={{marginTop: "0", marginBottom: "-2em"}}>
            * bitcoind.luisschwab.net:8333
            <br/>
            * electrs.luisschwab.net:50002
            <br/>
            * lightning.luisschwab.net:9735
            <br/>
            * <a href="https://mempool.luisschwab.net">mempool.luisschwab.net</a>
            <br/>
            * seed.bitcoin.luisschwab.com:53
            <br/>
            * wss://nostr.luisschwab.net
        </div>
        
        <br />
        <br />
 
        <div className="title">Contact</div>
        <div style={{marginTop: "0", marginBottom: "-2em"}}>
            * x: <a href="https://x.com/luisschwab_">luisschwab_</a>
            <br/>
            * github: <a href="https://github.com/luisschwab">luisschwab</a>
            <br/>
            * pgp: <a href="/FC43D25BEDD5EE7C.txt">FC43 D25B EDD5 EE7C</a>
            <br/>
            * email: luisschwab [shift+2] protonmail
            <br/>
            <div style={{overflowWrap: "break-word"}}>
                *&nbsp;nostr:&nbsp;<a href="https://njump.me/npub1d2x9c0e5gwwg6ask88c87y4v425fh4wz3hwhskvcwzpzdn7dzg5sl4eu8n">npub1d2x9c0e5gwwg6ask88c87y4v425fh4wz3hwhskvcwzpzdn7dzg5sl4eu8n</a>
            </div>
            * lightning ☇: sats@luisschwab.net
        </div>
         
        <br/>
        <br/>

        <Link href="/lib">
            <div className="title">Library 📜</div>
        </Link >

        <br/>

        <hr/>
        <QOTD></QOTD>
        <hr/>

        <div style={{textAlign: "center"}}>
            <img src="/img/blog/coin.gif" style={{display: "inline", height: "1em"}}/>
        </div>

    </Wrapper>
    </>
    );
}
