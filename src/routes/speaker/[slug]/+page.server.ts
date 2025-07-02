import { getSpeakerBySlug, getEvents } from '$lib/payloadClient';
import type { RequestEvent } from '@sveltejs/kit';

export async function load({ params }: RequestEvent) {
	const slug = params.slug;

	if (!slug) {
		throw new Error('Slug parameter is required');
	}

	try {
		const speaker = await getSpeakerBySlug(slug);

		if (!speaker) {
			throw new Error('Speaker not found');
		}

		// Get all events and filter for ones featuring this speaker
		const allEvents = await getEvents();
		const events = allEvents.filter((event) => {
			if (!event.relationships?.speakers) return false;

			// Check if this speaker is in the event's speakers
			return event.relationships.speakers.some((eventSpeaker) => {
				// Handle both object references and string IDs
				if (typeof eventSpeaker === 'object' && eventSpeaker !== null) {
					return eventSpeaker.id === speaker.id;
				}
				// If it's a string ID, compare directly
				return eventSpeaker === speaker.id;
			});
		});

		return {
			item: speaker,
			events
		};
	} catch (error) {
		console.error('Error fetching speaker data:', error);
		throw error;
	}
}
