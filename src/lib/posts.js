import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';
import { remark } from 'remark';
import remarkParse from 'remark-parse';
import html from 'remark-html';
import remarkImages from 'remark-images';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeKatex from 'rehype-katex';
import remarkFigureCaption from '@microflash/remark-figure-caption';
import rehypeHighlight from 'rehype-highlight';

import {unified} from 'unified'

const postsDirectory = path.join(process.cwd(), 'posts');
const draftsDirectory = path.join(process.cwd(), 'post-drafts');

export function getSortedPostsData() {
	// Get file names under /posts
	let fileNames;
    let postNames;
    let draftNames;

    if (process.env.DRAFT === "true") {
        postNames = fs.readdirSync(postsDirectory);
        draftNames = fs.readdirSync(draftsDirectory);

        console.log(postNames);
        console.log(draftNames);

        fileNames = postNames.concat(draftNames);
    } else {
        postNames = fs.readdirSync(postsDirectory);
        fileNames = postNames;
    }

	const allPostsData = fileNames.map((fileName) => {
		// Remove ".md" from file name to get id
		const id = fileName.replace(/\.md$/, '');

		// Read markdown file as string
        let fullPath;
        if (fs.existsSync(path.join(postsDirectory, fileName))) {
            fullPath = path.join(postsDirectory, fileName);
        } else {
            fullPath = path.join(draftsDirectory, fileName);
        }
        const fileContents = fs.readFileSync(fullPath, 'utf8');

		// Use gray-matter to parse the post metadata section
		const matterResult = matter(fileContents);

		// Combine the data with the id
		return {
			id,
			...matterResult.data,
		};
	});

	// Sort posts by date
	return allPostsData.sort((a, b) => {
		if (a.date < b.date) {
			return 1;
		} else {
			return -1;
		}
	});
}

export function getAllPostIds() {
	let fileNames;
    let postNames;
    let draftNames;

    if (process.env.DRAFT === "true") {
        postNames = fs.readdirSync(postsDirectory);
        draftNames = fs.readdirSync(draftsDirectory);

        console.log(postNames);
        console.log(draftNames);

        fileNames = postNames.concat(draftNames);
    } else {
        postNames = fs.readdirSync(postsDirectory);
        fileNames = postNames;
    }
  	
	return fileNames.map((fileName) => {
    	return {
    		params: {
        		id: fileName.replace(/\.md$/, ''),
      		},
    	};
	});
}

export async function getPostData(id) {
    
	let fullPath;
    if (fs.existsSync(path.join(postsDirectory, `${id}.md`))) {
        fullPath = path.join(postsDirectory, `${id}.md`);
    } else {
        fullPath = path.join(draftsDirectory, `${id}.md`);
    }

	const fileContents = fs.readFileSync(fullPath, 'utf8');
  
	// Use gray-matter to parse the post metadata section
	const matterResult = matter(fileContents);
	
	// User remark to convert markdown into HTML
	const processedContent = await unified()
        .use(remarkParse)
        .use(remarkMath)
        .use(remarkGfm)
        .use(remarkImages)
        .use(remarkFigureCaption)
        .use(remarkRehype)
        .use(rehypeKatex)
        .use(rehypeStringify)
        .process(matterResult.content);
        
	const contentHTML = processedContent.toString();
    //console.log(processedContent.toString());

	// Combine the data with the id
	return {
		id,
		contentHTML,
		...matterResult.data,
	};
  }