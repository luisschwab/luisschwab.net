import Link from "next/link";
import Head from "next/head";

import Wrapper from "@/components/wrapper";
import Banner from "@/components/banner";
import Title from "@/components/title";
import PostContent from "@/components/postContent";
import Utterances from "@/components/utterances";

import { getAllPostIds, getPostData } from '../../lib/posts';

export async function getStaticProps({ params }: any) {
    const postData = await getPostData(params.id);
    return {
        props: {
            postData,
        },
    };
}

export async function getStaticPaths() {
    const paths = getAllPostIds();
    return {
        paths,
        fallback: false,
    };
}

export default function Post({ postData }) {

    let post_url = "https://luisschwab.net/blog/" + postData.id;
    
    let open_graph_image_url = "https://luisschwab.net" + postData.og_image_url;

    return (
        <>
        <Head>
            <title>{postData.title.toLowerCase() + ' | luisschwab.net'}</title>

            <meta name="title" content={postData.title}/>
            <meta name="description" content={postData.description} />

            <meta property="og:title" content={postData.title} />
            <meta property="og:image" content={open_graph_image_url}/>
            <meta property="og:description" content={postData.description}/>

            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:image" content={open_graph_image_url}/>
            <meta name="twitter:domain" content="luisschwab.net/"/>
            <meta name="twitter:url" content={post_url}/>
            <meta name="twitter:title" content={postData.title}/>
            <meta name="twitter:description" content={postData.description}/>
        </Head>

        <Wrapper>
            <Banner></Banner>

            <Title content={postData.title.toLowerCase()}></Title>

            <PostContent>
                <div className="nav" style={{ fontFamily: "grotesk-sharp", fontWeight: 'bold', marginTop: `-5vh`, marginBottom: `6vh` }}>
                    <Link href="/blog">&larr; blog index</Link>

                    &nbsp;&nbsp;|&nbsp;&nbsp;

                    {postData.date}
                </div>

                <div dangerouslySetInnerHTML={{ __html: postData.contentHTML }} />
            </PostContent>

            <Utterances></Utterances>
            <div id="utterance"></div>

            <div style={{marginTop: '1.5em', fontSize: '75%', fontFamily:'Noto Serif', textAlign:'center', color:'#F7931A'}}>
                <hr/>
                <em>follow the <a href="/lib/bitcoin/whitepaper.pdf" className="white_rabbit">white rabbit</a></em>
            </div>

        </Wrapper>
        </>
    );
}