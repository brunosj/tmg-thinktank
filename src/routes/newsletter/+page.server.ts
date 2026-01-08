import { fetchNewsletters } from '$lib/dataClient';
import type { Newsletter } from '$lib/types/types';

export async function load() {
	try {
		let newsletter: Newsletter[] = await fetchNewsletters();

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
