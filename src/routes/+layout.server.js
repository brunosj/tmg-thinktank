import { createContentfulClient, fetchContentfulDataServer } from '$lib/contentfulClient';
import { SECRET_CONTENTFUL_SPACE_ID, SECRET_CONTENTFUL_ACCESS_TOKEN } from '$env/static/private';

const client = createContentfulClient(SECRET_CONTENTFUL_SPACE_ID, SECRET_CONTENTFUL_ACCESS_TOKEN);

export async function load() {
	try {
		const programmes = await fetchContentfulDataServer(client, 'program');

		programmes.sort((a, b) => (a.fields.title || '').localeCompare(b.fields.title || ''));

		return {
			programmes
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			status: 500,
			error: 'Server Error'
		};
	}
}
