import { fetchBlogPosts } from '$lib/dataClient';
import type { BlogPost } from '$lib/types/types';

export async function load() {
	try {
		const news: BlogPost[] = await fetchBlogPosts();
		return {
			news
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			status: 500,
			error: 'Server Error'
		};
	}
}
