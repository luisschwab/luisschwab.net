import Link from "next/link";
import Head from "next/head";

import Wrapper from "@/components/wrapper";
import Banner from "@/components/banner";
import QOTD from "@/components/qotd";

import { getSortedPostsData } from '../lib/posts';

export async function getStaticProps() {
	const allPostsData: any = getSortedPostsData();

    // show n latest blogs
    const n = 7
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
 
        <br />
        <div className="title">Luis Henrique Schwab</div>
        <br/>
        
        <div className="title">About</div>
        <div style={{marginTop: "0", marginBottom: "-2em"}}>
            Computer Engineering student @ Universidade de Brasília
            <br/>
            Fellow @ <a href="https://vinteum.org"><b>Vinteum</b></a>, working on <b>BDK-Floresta</b> integration.
            <br/>
            <a href="https://summerofbitcoin.org">Summer of Bitcoin</a> &apos;24 @ <a href="https://bitcoindevkit.org"><b>Bitcoin Dev Kit</b></a>
            <br/>
            Bitcoin, Cryptography, Freedom Tech, Jiu-Jitsu, Bikes
        </div>
        
        <br/>
        <br/>

        <Link href="/blog"><div className="title">Blog</div></Link>
        <div style={{marginTop: "0", marginBottom: "-2em"}}>
            {latestPostsData.map(({ id, title }) => (
                <>
                    <span key={id}><Link href={"blog/" + id}>{title}</Link></span>
                    <br/>
                </>
            ))}
        </div>

        <br/>
        <br/>

        <div className="title">Projects</div>
        <div style={{marginTop: "0", marginBottom: "-2em"}}>
            <span><a href="https://github.com/luisschwab/getaddress">getaddress: a bitcoin p2p crawler</a></span>
        </div>

        <br/>
        <br/>

        <div className="title">Lightning Network</div>
        <div style={{overflowWrap: 'break-word'}}>
            <a href="https://mempool.space/lightning/node/022e6daa0464a77800ef0ad117497d687e21bab35b15672a7f9de7d8541b042f17">
                022e6daa0464a77800ef0ad117497d687e21bab35b15672a7f9de7d8541b042f17
            </a>@lnd.luisschwab.net:9735
        </div>

        
        <br/>

        <div className="title">Self-Hosted Stuff</div>
        <div style={{marginTop: "0", marginBottom: "-2em"}}>
            nostr.luisschwab.net
            <br/>
            <a href="https://mempool.luisschwab.net">mempool.luisschwab.net</a>
            <br/>
            mint.luisschwab.net:3338
            <br/>
            electrs.luisschwab.net:50002
            <br/>
            lnd.luisschwab.net:9735
        </div>
        
        <br />
        <br />

        <Link href="/lib">
            <div className="title">Library</div>
        </Link>

        <br/>
        
        <div className="title">Contact</div>
        <div style={{marginTop: "0", marginBottom: "-2em"}}>
            x: <a href="https://x.com/luisschwab_">luisschwab_</a>
            <br/>
            github: <a href="https://github.com/luisschwab">luisschwab</a>
            <br/>
            pgp: <a href="/3AD29E6FA7031B76.txt">3AD2 9E6F A703 1B76</a>
            <br/>
            email: luisschwab [shift+2] protonmail
            <br/>
            <div style={{overflowWrap: 'break-word'}}>
                nostr:&nbsp;<a href="https://njump.me/npub1d2x9c0e5gwwg6ask88c87y4v425fh4wz3hwhskvcwzpzdn7dzg5sl4eu8n">npub1d2x9c0e5gwwg6ask88c87y4v425fh4wz3hwhskvcwzpzdn7dzg5sl4eu8n</a>
            </div>
            BIP353: pay@luisschwab.net
        </div>
         
        <br/>
        <br/>

        <hr/>
        <QOTD></QOTD>
        <hr/>

        <div style={{textAlign: 'center'}}>
        ₿ λ ⌘ ⛁ ∇ ∯ ♛ Σ ∂
        </div>

    </Wrapper>
    </>
    );
}
