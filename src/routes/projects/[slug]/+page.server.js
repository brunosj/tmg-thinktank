// export const prerender = true;

import { fetchContentfulData } from '$lib/contentfulClient';
import { transformPublicationToNews, transformVideoToNews } from '$utils/utils';

export async function entries() {
	const entries = await fetchContentfulData('portfolio');
	return entries.map((entry) => {
		return {
			slug: entry.fields.slug
		};
	});
}

export async function load({ params }) {
	const { slug } = params;

	try {
		const entries = await fetchContentfulData('portfolio');
		const item = entries.find((p) => p.fields.slug === slug);

		const events = await fetchContentfulData('event');
		const videos = await fetchContentfulData('video');
		const videoNewsItems = videos.filter((p) => p.fields.automatedNewsEntry);
		const transformedVideoNewsItems = videoNewsItems?.map(transformVideoToNews);

		const publications = await fetchContentfulData('publications');
		const publicationNewsItems = publications.filter((p) => p.fields.automatedNewsEntry);
		const transformedPublicationNewsItems = publicationNewsItems.map(transformPublicationToNews);

		let news = await fetchContentfulData('news');
		news = [...news, ...transformedPublicationNewsItems, ...transformedVideoNewsItems];

		if (item) {
			return { item, events, news, videos, publications };
		} else {
			throw new Error('Entry not found');
		}
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}
