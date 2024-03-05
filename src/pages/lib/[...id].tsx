import path from 'path';

import Link from "next/link";
import Head from "next/head";

import { useRouter } from 'next/router';

import Wrapper from "@/components/wrapper";
import Banner from "@/components/banner";
import Title from "@/components/title";

import { getFileIndex, getPathsRecursive } from '../../lib/library';

export async function getStaticProps(context) {
    const currentPath = context.params?.id.join('/') || '/';

	const allFilesData: any = getFileIndex(currentPath)['index'];

    console.log(currentPath);

	return {
		props: {
			allFilesData,
            currentPath
		},
	};
}

export async function getStaticPaths() {
    const rootDir = path.join(process.cwd(), "public/lib/");

    const paths = getPathsRecursive(rootDir, rootDir);

    console.log(paths);

    return {
        paths,
        fallback: false,
    };
}


export default function LibIndex({ allFilesData, currentPath }) {
    return (
    	<>
        <Head>
            <title>library | luisschwab.net</title>

            <meta name="title" content="library"/>
            <meta name="description" content="luisschwab's library" />

            <meta property="og:title" content="luisschwab's library"/>
            <meta property="og:image" content="http://luisschwab.net/img/diogenes.jpg"/>

            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:image" content="http://luisschwab.net/img/diogenes.jpg"/>
            <meta name="twitter:domain" content="luisschwab.net/"/>
            <meta name="twitter:url" content="https://luisschwab.net"/>
            <meta name="twitter:title" content="luisschwab's library"/>
        </Head>

        <Wrapper>
        	<Banner></Banner>

            <Title content={"library"}></Title>

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

                    <tr>
                        <td><b><a href="../">../</a></b></td>
                        <td><b>-</b></td>
                        <td><b>-</b></td>
                    </tr>
                    
                    {allFilesData.map(file => (
                        <tr key={file.name}>
                            <td><a href={path.join("/lib/", currentPath, file.name)}>{file.name}</a></td>
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