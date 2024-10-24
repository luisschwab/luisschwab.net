import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

import Wrapper from "@/components/wrapper";
import Banner from "@/components/banner";
import Header from "@/components/header";
import Title from "@/components/title";
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

        <br/>
        <div className="title">Luis Henrique Schwab</div>
        <br/>
        
        <div className="title">About</div>
        <ul style={{marginTop: "0", marginBottom: "-2em", marginLeft: "-0.75em"}}>
            <li>Computer Engineering student @ Universidade de Brasília</li>
            <li><a href="https://summerofbitcoin.org">Summer of Bitcoin</a> &apos;24 Intern @ <a href="https://bitcoindevkit.org"><b>Bitcoin Dev Kit</b></a></li>
            <li>Interested in Bitcoin, cryptography, privacy tech</li>
        </ul>
        
        <br/>
        <br/>

        <Link href="/blog"><div className="title">Blog</div></Link>
        <ul style={{marginTop: "0", marginBottom: "-2em", marginLeft: "-0.75em"}}>
            <li><Link href="/blog/portable-self-hosting">Portable Self-Hosting</Link></li>
            <li><Link href="/blog/summer-of-bitcoin-2024">Summer of Bitcoin 2024</Link></li>
            <li><Link href="/blog/how-digital-signatures-work">How Digital Signatures Work</Link></li>
            <li><Link href="/blog/from-dice-to-address">From Dice to Address</Link></li>
            <li><Link href="/blog/sovereign-bitcoin-stack">A Sovereign Bitcoin Stack</Link></li>
            <li><Link href="/blog/books-2024">Books of 2024</Link></li>
        </ul>

        <br/>
        <br/>

        <div className="title">Projects</div>
        <ul style={{marginTop: "0", marginBottom: "-2em", marginLeft: "-0.75em"}}>
            <li><a href="https://github.com/luisschwab/getaddress">getaddress: a Bitcoin P2P crawler</a></li>
        </ul>

        <br/>
        <br/>

        <Link href="/lib">
            <div className="title">Library</div>(personal PDF collection)
        </Link>

        <br/>
        <br/>

        <div className="title">Lightning Network</div>
        Open a channel to my LN node:
        <br/>
        <a href="https://mempool.space/lightning/node/022e6daa0464a77800ef0ad117497d687e21bab35b15672a7f9de7d8541b042f17">
            022e6daa0464a77800ef0ad117497d687e21bab35b15672a7f9de7d8541b042f17
        </a>@ln.luisschwab.net:9735

        <br/>
        <br/>

        <div className="title">Self-Hosted Stuff</div>
        Publicly available services (please don&apos;t try to DDoS me):
        <ul style={{marginTop: "0", marginBottom: "-2em", marginLeft: "-0.75em"}}>
            <li><a href="https://mempool.luisschwab.net">mempool.luisschwab.net</a></li>
            <li><a href="wss://nostr.luisschwab.net">wss://nostr.luisschwab.net</a></li>
            <li><a href="ssl://electrs.luisschwab.net:50002">ssl://electrs.luisschwab.net:50002</a></li>
        </ul>

        <br/>
        <br/>
        
        <div className="title">Contact Info</div>
        <ul style={{marginTop: "0", marginBottom: "-2em", marginLeft: "-0.75em"}}>
            <li>x: <a href="https://x.com/luisschwab_">luisschwab_</a></li>
            <li>github: <a href="https://github.com/luisschwab">luisschwab</a></li>
            <li>pgp: <a href="/F3EC3AD29E6FA7031B76.txt">F3EC 3AD2 9E6F A703 1B76</a></li>
            <li>email: luisschwab [shift+2] protonmail</li>
            <li>
                <div style={{overflowWrap: 'break-word'}}>
                    nostr:&nbsp;<a href="https://njump.me/npub1d2x9c0e5gwwg6ask88c87y4v425fh4wz3hwhskvcwzpzdn7dzg5sl4eu8n">npub1d2x9c0e5gwwg6ask88c87y4v425fh4wz3hwhskvcwzpzdn7dzg5sl4eu8n</a>
                </div>
            </li>
            <li>BIP353: pay@luisschwab.net</li>
        </ul>
 
        
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
