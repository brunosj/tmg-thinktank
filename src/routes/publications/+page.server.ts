import {
	getPublications,
	getPublicationFeatures,
	getNews,
	getPublicationsPage
} from '$lib/payloadClient';
import type {
	Publication,
	PublicationFeature,
	News,
	PublicationsPage
} from '$lib/types/payload-types';

export async function load() {
	try {
		// Fetch page-specific data
		const pageData: PublicationsPage | null = await getPublicationsPage();

		let entries: Publication[] = await getPublications();

		entries = entries.sort((a, b) => {
			const dateA = new Date(a.info?.publicationDate || '');
			const dateB = new Date(b.info?.publicationDate || '');
			return dateB.getTime() - dateA.getTime();
		});

		let features: PublicationFeature[] = await getPublicationFeatures();
		features = features.sort((a, b) => {
			const dateA = new Date(a.updatedAt);
			const dateB = new Date(b.updatedAt);
			return dateB.getTime() - dateA.getTime();
		});

		let news: News[] = await getNews();
		news = news.filter((item) => item.info.type === 'Publication');

		return {
			entries,
			features,
			news,
			pageData
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			status: 500,
			error: 'Server Error'
		};
	}
}
