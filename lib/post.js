import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import remark from 'remark';
import html from 'remark-html';
const postsDir = path.join(process.cwd(), 'posts');
export async function getSortedPostsData() {
	const fileNames = fs.readdirSync(postsDir);
	const allPostsData = fileNames.map(item => {
		const id = item.replace(/\.md$/, '');
		const fullPath = path.join(postsDir, item);
		const fileContent = fs.readFileSync(fullPath, 'utf8');
		const matterResult = matter(fileContent);


		return {
			id,
			...matterResult.data
		};
	});
	return allPostsData.sort((a, b) => {
		if (a.date < b.date) {
			return 1;
		} else {
			return -1;
		}
	});
}

export async function getAllPostIds() {
	const fileNames = fs.readdirSync(postsDir);
	return fileNames.map(filename => {
		return {
			params: {
				id: filename.replace(/\.md$/, '')
			}
		};
	});
}

export async function getPostData(id) {
	const fullPath = path.join(postsDir, `${id}.md`);
	const fileContents = fs.readFileSync(fullPath, "utf8");
	const matterResult = matter(fileContents);
	const processdContent = await remark().use(html).process(matterResult.content);
	const contentHtml = processdContent.toString();
	return {
		id,
		contentHtml,
		...matterResult.data
	};
}