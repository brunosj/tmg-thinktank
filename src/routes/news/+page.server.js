import { fetchContentfulData } from '$lib/contentfulClient';
import {
	transformPublicationToNews,
	transformVideoToNews,
	transformBlogPostToNews
} from '$utils/utils';

export const config = {
	isr: {
		expiration: false
	}
};

export async function load() {
	try {
		const publicationEntries = await fetchContentfulData('publications');
		const publicationNewsItems = publicationEntries.filter((p) => p.fields.automatedNewsEntry);
		const transformedPublicationNewsItems = publicationNewsItems.map(transformPublicationToNews);

		const videos = await fetchContentfulData('video');
		const videoNewsItems = videos.filter((p) => p.fields.automatedNewsEntry);
		const transformedVideoNewsItems = videoNewsItems?.map(transformVideoToNews);

		let entries = await fetchContentfulData('news');

		const blogPosts = await fetchContentfulData('blogPost');
		const transformedBlogPosts = blogPosts?.map(transformBlogPostToNews);
		entries = [
			...entries,
			...transformedBlogPosts,
			...transformedPublicationNewsItems,
			...transformedVideoNewsItems
		];

		return {
			entries,
			transformedVideoNewsItems
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			status: 500,
			error: 'Server Error'
		};
	}
}
