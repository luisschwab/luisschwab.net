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
        ● Computer Engineering student @ Universidade de Brasília,
        <br/>
        ● <a href="https://summerofbitcoin.org">Summer of Bitcoin</a> &apos;24 Intern @ <a href="https://bitcoindevkit.org">BDK</a>,
        <br/>
        ● Interested in Bitcoin, cryptography, privacy tech, economics and philosophy.

        <br/>
        <br/>

        <Link href="/blog">
            <div className="title">Blog</div>
        </Link>
        <Link href="/blog/summer-of-bitcoin-2024">● Summer of Bitcoin 2024</Link>
        <br/>
        <Link href="/blog/how-digital-signatures-work">● How Digital Signatures Work</Link>
        <br/>
        <Link href="/blog/from-dice-to-address">● From Dice to Address</Link>
        <br/>
        <Link href="/blog/sovereign-bitcoin-stack">● A Sovereign Bitcoin Stack</Link>
        <br/>
        <Link href="/blog/books-2024">● Books of 2024</Link>

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
        022e6daa0464a77800ef0ad117497d687e21bab35b15672a7f9de7d8541b042f17@159.203.191.48:9735

        <br/>
        <br/>

        <div className="title">Self-Hosted Stuff</div>
        Publicly available services (please don&apos;t DDoS me):
        <ul style={{marginTop: "0", marginBottom: "-2em"}}>
            <li><a href="https://mempool.luisschwab.net">mempool.luisschwab.net</a></li>
            <li><a href="wss://nostr.luisschwab.net">wss://nostr.luisschwab.net</a></li>
            <li><a href="ssl://electrs.luisschwab.net:50002">ssl://electrs.luisschwab.net:50002</a></li>
        </ul>

        <br/>
        <br/>
        
        <div className="title">Contact Info</div>
        ● 𝕏: <a href="https://x.com/luisschwab_">luisschwab_</a>
        <br/>
        ● github: <a href="https://github.com/luisschwab">luisschwab</a>
        <br/>
        ● pgp: <a href="/F3EC3AD29E6FA7031B76.txt">F3EC 3AD2 9E6F A703 1B76</a>
        <br/>
        ● email: luisschwab [shift+2] protonmail
        <br/>
        <div style={{overflowWrap: 'break-word'}}>
            ●&nbsp;nostr:<a href="https://njump.me/npub1d2x9c0e5gwwg6ask88c87y4v425fh4wz3hwhskvcwzpzdn7dzg5sl4eu8n">npub1d2x9c0e5gwwg6ask88c87y4v425fh4wz3hwhskvcwzpzdn7dzg5sl4eu8n</a>
        </div>
        ● BIP353: pay@luisschwab.net

        <div style={{textAlign: 'center'}}>
            <br/>.<br/>.<br/>.
        </div>
        
        <QOTD></QOTD>

        <hr/>

        <div style={{textAlign: 'center'}}>
        ₿ λ ⌘ ⛁ ∇ ∯ ♛ Σ ∂
        </div>

    </Wrapper>
    </>
    );
}
