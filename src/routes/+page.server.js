import { fetchContentfulData } from '$lib/contentfulClient';

export const config = {
	isr: {
		expiration: 60
	}
};

export async function load() {
	try {
		const landingPage = await fetchContentfulData('landingPage');
		const programmes = await fetchContentfulData('program');
		const newsletter = await fetchContentfulData('newsletter');
		const partners = await fetchContentfulData('partners');
		const events = await fetchContentfulData('event');
		const news = await fetchContentfulData('news');

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
