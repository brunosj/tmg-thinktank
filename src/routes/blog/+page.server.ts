import { getBlogPosts } from '$lib/payloadClient';

export async function load() {
	try {
		const posts = await getBlogPosts();
		return {
			posts
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			status: 500,
			error: 'Server Error'
		};
	}
}
