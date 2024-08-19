import { fetchContentfulData } from '$lib/contentfulClient';
import { transformVideoToNews, transformBlogPostToNews } from '$utils/utils';

export const config = {
	isr: {
		expiration: false
	}
};

export async function load({ params }) {
	const { slug } = params;

	try {
		const videos = await fetchContentfulData('video');
		const videoNewsItems = videos.filter((p) => p.fields.automatedNewsEntry);
		const transformedVideoNewsItems = videoNewsItems.map(transformVideoToNews);

		const blogPosts = await fetchContentfulData('blogPost');
		const transformedBlogPosts = blogPosts?.map(transformBlogPostToNews);

		let entries = await fetchContentfulData('news');
		entries = [...entries, ...transformedVideoNewsItems, ...transformedBlogPosts];
		const item = entries.find((p) => p.fields.slug === slug);

		if (item) {
			return { entries, item };
		} else {
			throw new Error('Entry not found');
		}
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}
