import FlexSearch from 'flexsearch';
import type { SearchItem } from './types/types';

let postsIndex: FlexSearch.Index;
let posts: SearchItem[];

export function createPostsIndex(data: SearchItem[]) {
	postsIndex = new FlexSearch.Index({ tokenize: 'forward' });

	data.forEach((post, i) => {
		const item = `${post.title} ${post.summary}`;
		postsIndex.add(i, item);
	});

	posts = data;
}

export function searchPostsIndex(searchTerm: string) {
	const match = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const results = postsIndex.search(match);

	return results
		.map((index) => posts[index as number])
		.map(({ slug, title, summary, itemType, type, date, link }) => {
			return {
				slug,
				title: replaceTextWithMarker(title, match),
				summary: getMatches(summary, match),
				itemType,
				type,
				date,
				link
			};
		})
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function replaceTextWithMarker(text: string, match: string) {
	const regex = new RegExp(match, 'gi');
	return text.replaceAll(regex, (match) => `<mark>${match}</mark>`);
}

function getMatches(text: string, searchTerm: string, limit = 1) {
	const regex = new RegExp(searchTerm, 'gi');
	const indexes = [];
	let matches = 0;
	let match;

	while ((match = regex.exec(text)) !== null && matches < limit) {
		indexes.push(match.index);
		matches++;
	}

	return indexes.map((index) => {
		const start = index - 20;
		const end = index + 80;
		const excerpt = text.substring(start, end).trim();
		return `...${replaceTextWithMarker(excerpt, searchTerm)}...`;
	});
}
