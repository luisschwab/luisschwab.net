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
    return (
        <>
        <Head>
            <title>{postData.title}</title>
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