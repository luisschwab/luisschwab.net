import Link from "next/link";
import Head from "next/head";

import Wrapper from "@/components/wrapper";
import Banner from "@/components/banner";
import Title from "@/components/title";
import PostIndexItem from "@/components/postIndex";

import { getSortedPostsData } from '../../lib/posts';

export async function getStaticProps() {
	const allPostsData: any = getSortedPostsData();

	return {
		props: {
			allPostsData,
		},
	};
}


export default function BlogIndex({ allPostsData }) {
    return (
    	<>
        <Head>
            <title>blog | luisschwab.net</title>

            <meta name="title" content="blog"/>
            <meta name="description" content="luisschwab's blog" />

            <meta property="og:title" content="luisschwab's blog"/>
            <meta property="og:image" content="http://luisschwab.net/img/diogenes.jpg"/>

            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:image" content="http://luisschwab.net/img/diogenes.jpg"/>
            <meta name="twitter:domain" content="luisschwab.net/"/>
            <meta name="twitter:url" content="https://luisschwab.net"/>
            <meta name="twitter:title" content="luisschwab's blog"/>
        </Head>

        <Wrapper>
        	<Banner></Banner>

            <Title content={"blog"}></Title>

            <div style={{ marginTop: '-5vh', marginBottom: '3vh' }}>
                <span style={{ fontFamily: 'grotesk-sharp', fontWeight: 600, fontSize: '21px'}}>
                    <Link href="/">&larr; main page</Link>
                </span>
            </div>

            <ul style={{ marginLeft: '-30px', listStyle: 'none' }}>
            	{allPostsData.map(({ id, title, date, tags }) => (
                	<PostIndexItem key={id} id={id} title={title} date={date} tags={tags}></PostIndexItem>
              	))}
            </ul>
            
        </Wrapper>
      </>
  );
}