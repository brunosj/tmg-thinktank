import { fetchContentfulData } from '$lib/contentfulClient';
import type { Newsletter } from '$lib/types/types';

export const config = {
	isr: {
		expiration: 60
	}
};

export async function load() {
	try {
		let newsletter: Newsletter[] = await fetchContentfulData('newsletter');

		newsletter = newsletter.sort((a, b) => {
			const dateA = new Date(a.fields.date);
			const dateB = new Date(b.fields.date);
			return dateB.getTime() - dateA.getTime();
		});

		return {
			newsletter
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			status: 500,
			error: 'Server Error'
		};
	}
}
