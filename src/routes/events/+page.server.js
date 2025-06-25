import { getEvents, getEventSeries } from '$lib/payloadClient';

export async function load() {
	try {
		const eventSeries = await getEventSeries();
		const events = await getEvents();

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
