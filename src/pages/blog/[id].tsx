import Link from "next/link";
import Head from "next/head";

import Wrapper from "@/components/wrapper";
import Banner from "@/components/banner";
import Title from "@/components/title";
import PostContent from "@/components/postContent";

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
    
    let open_graph_image_url;

    if (postData.og_image_url != '') {
        open_graph_image_url = "https://luisschwab.net" + postData.og_image_url;
    } else {
        open_graph_image_url = "https://luisschwab.net/img/diogenes.jpg";
    }


    return (
        <>
        <Head>
            <title>{postData.title} | luisschwab.net</title>

            <meta name="title" content={postData.title}/>
            <meta name="description" content={postData.description} />

            <meta property="og:title" content={postData.title} />
            <meta property="og:image" content="https://luisschwab.net/img/diogenes.jpg"/>
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
                <div style={{ fontWeight: 'bold', marginTop: `-5vh`, marginBottom: `6vh` }}>
                    <Link href="/blog">&larr; post index</Link>
                    &nbsp;&nbsp;\\&nbsp;&nbsp;
                    {postData.date}
                </div>

                <div dangerouslySetInnerHTML={{ __html: postData.contentHTML }} />
            </PostContent>
        </Wrapper>
        </>
    );
  }