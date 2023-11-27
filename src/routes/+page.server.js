import { SECRET_CONTENTFUL_SPACE_ID, SECRET_CONTENTFUL_ACCESS_TOKEN } from '$env/static/private';
import { createContentfulClient, fetchContentfulDataServer } from '$lib/contentfulClient';

const client = createContentfulClient(SECRET_CONTENTFUL_SPACE_ID, SECRET_CONTENTFUL_ACCESS_TOKEN);

export const config = {
	isr: {
		expiration: 60
	}
};

export async function load() {
	try {
		const landingPage = await fetchContentfulDataServer(client, 'landingPage');
		const programmes = await fetchContentfulDataServer(client, 'program');
		const newsletter = await fetchContentfulDataServer(client, 'newsletter');
		const partners = await fetchContentfulDataServer(client, 'partners');
		const events = await fetchContentfulDataServer(client, 'event');
		const news = await fetchContentfulDataServer(client, 'news');

		return {
			landingPage,
			programmes,
			newsletter,
			partners,
			events,
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
