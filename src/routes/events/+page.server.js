import { SECRET_CONTENTFUL_SPACE_ID, SECRET_CONTENTFUL_ACCESS_TOKEN } from '$env/static/private';
import { createContentfulClient, fetchContentfulDataServer } from '$lib/contentfulClient';

export const config = {
	isr: {
		expiration: 60
	}
};

const client = createContentfulClient(SECRET_CONTENTFUL_SPACE_ID, SECRET_CONTENTFUL_ACCESS_TOKEN);

export async function load() {
	try {
		const eventSeries = await fetchContentfulDataServer(client, 'unfssCop26');
		const events = await fetchContentfulDataServer(client, 'event');

		return {
			events,
			eventSeries
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			status: 500,
			error: 'Server Error'
		};
	}
}
