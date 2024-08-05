import Link from "next/link";
import Head from "next/head";

import Wrapper from "@/components/wrapper";
import Banner from "@/components/banner";
import Title from "@/components/title";

import { getFileIndex } from '../../lib/library';

export async function getStaticProps() {    
	const allFilesData: any = getFileIndex()['index'];

	return {
		props: {
			allFilesData,
		},
	};
}


export default function LibIndex({ allFilesData }) {
    return (
    	<>
        <Head>
            <title>{"index of /lib/ | luisschwab.net"}</title>

            <meta name="title" content="library"/>
            <meta name="description" content="luisschwab's library"/>

            <meta property="og:title" content="luisschwab's library"/>
            <meta property="og:image" content="http://luisschwab.net/img/alexandria.jpg"/>

            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:image" content="http://luisschwab.net/img/alexandria.jpg"/>
            <meta name="twitter:domain" content="luisschwab.net/"/>
            <meta name="twitter:url" content="https://luisschwab.net"/>
            <meta name="twitter:title" content="luisschwab's library"/>
        </Head>

        <Wrapper>
        	<Banner></Banner>

            <Title content={"index of /lib/"}></Title>

            <div style={{ marginTop: '-5vh', marginBottom: '3vh' }}>
                <span style={{ fontFamily: 'grotesk-sharp', fontWeight: 600, fontSize: '21px'}}>
                    <Link href="/">&larr; main page</Link>
                </span>
            </div>

            <table>
                <tbody>
                    <tr>
                        <td><b>filename</b></td>
                        <td><b>size</b></td>
                        <td><b>modified</b></td>
                    </tr>
                    
                    {allFilesData.map(file => (
                        <tr key={file.name}>
                            <td><a href={"/lib/" + file.name}>{file.name}</a></td>
                            <td>{file.size}</td>
                            <td>{file.modified}</td>
                        </tr>
                    ))}
                </tbody>          
            </table>            

        </Wrapper>
      </>
  );
}