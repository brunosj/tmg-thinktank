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

export async function load({ params }) {
	const { slug } = params;

	try {
		const entries = await fetchContentfulData('staff');
		const item = entries.find((p) => p.fields.slug === slug);

		const publications = await fetchContentfulData('publications');
		const publicationNewsItems = publications.filter((p) => p.fields.automatedNewsEntry);
		const transformedPublicationNewsItems = publicationNewsItems.map(transformPublicationToNews);

		const videos = await fetchContentfulData('video');
		const videoNewsItems = videos.filter((p) => p.fields.automatedNewsEntry);
		const transformedVideoNewsItems = videoNewsItems?.map(transformVideoToNews);

		const blogPosts = await fetchContentfulData('blogPost');
		const transformedBlogPosts = blogPosts?.map(transformBlogPostToNews);

		let news = await fetchContentfulData('news');
		news = [
			...news,
			...transformedPublicationNewsItems,
			...transformedVideoNewsItems,
			...transformedBlogPosts
		];

		if (item) {
			return { item, publications, news };
		} else {
			throw new Error('Entry not found');
		}
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}
