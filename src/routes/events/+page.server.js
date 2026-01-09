import { fetchEventSeries, fetchEvents } from '$lib/dataClient';

export async function load() {
	try {
		const eventSeries = await fetchEventSeries();
		const events = await fetchEvents();

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
