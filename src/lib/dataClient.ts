/**
 * Unified Data Client
 * Switches between Contentful and Payload based on feature flag
 * Maintains consistent return types for seamless transition
 */

import { USE_PAYLOAD } from './config/features';
import * as ContentfulClient from './contentfulClient';
import * as PayloadClient from './payloadClient';
import type * as Types from './types/types';

// ============================================================================
// COLLECTION FETCHERS
// ============================================================================

export async function fetchProgrammes(): Promise<Types.Programme[]> {
	if (USE_PAYLOAD) {
		return PayloadClient.getAdaptedProgrammes();
	}
	return ContentfulClient.fetchContentfulData<Types.Programme>('program');
}

export async function fetchProjects(): Promise<Types.Project[]> {
	if (USE_PAYLOAD) {
		return PayloadClient.getAdaptedProjects();
	}
	return ContentfulClient.fetchContentfulData<Types.Project>('portfolio');
}

export async function fetchEvents(): Promise<Types.Event[]> {
	if (USE_PAYLOAD) {
		const events = await PayloadClient.getAdaptedEvents();

		return events;
	}
	return ContentfulClient.fetchContentfulData<Types.Event>('event');
}

export async function fetchNews(): Promise<Types.News[]> {
	if (USE_PAYLOAD) {
		return PayloadClient.getAdaptedNews();
	}
	return ContentfulClient.fetchContentfulData<Types.News>('news');
}

export async function fetchPublications(): Promise<Types.Publication[]> {
	if (USE_PAYLOAD) {
		return PayloadClient.getAdaptedPublications();
	}
	return ContentfulClient.fetchContentfulData<Types.Publication>('publications');
}

export async function fetchBlogPosts(): Promise<Types.BlogPost[]> {
	if (USE_PAYLOAD) {
		return PayloadClient.getAdaptedBlogPosts();
	}
	return ContentfulClient.fetchContentfulData<Types.BlogPost>('blogPost');
}

export async function fetchVideos(): Promise<Types.Video[]> {
	if (USE_PAYLOAD) {
		return PayloadClient.getAdaptedVideos();
	}
	return ContentfulClient.fetchContentfulData<Types.Video>('video');
}

export async function fetchEventSeries(): Promise<Types.EventSeries[]> {
	if (USE_PAYLOAD) {
		return PayloadClient.getAdaptedEventSeries();
	}
	return ContentfulClient.fetchContentfulData<Types.EventSeries>('unfssCop26');
}

export async function fetchTeams(): Promise<Types.Team[]> {
	if (USE_PAYLOAD) {
		return PayloadClient.getAdaptedTeams();
	}
	return ContentfulClient.fetchContentfulData<Types.Team>('staff');
}

export async function fetchSpeakers(): Promise<Types.Speaker[]> {
	if (USE_PAYLOAD) {
		return PayloadClient.getAdaptedSpeakers();
	}
	return ContentfulClient.fetchContentfulData<Types.Speaker>('speaker');
}

export async function fetchPartners(): Promise<Types.Partner[]> {
	if (USE_PAYLOAD) {
		return PayloadClient.getAdaptedCollaborators();
	}
	return ContentfulClient.fetchContentfulData<Types.Partner>('partners');
}

export async function fetchNewsletters(): Promise<Types.Newsletter[]> {
	if (USE_PAYLOAD) {
		// TODO: Newsletters may not exist in Payload - verify
		return [];
	}
	return ContentfulClient.fetchContentfulData<Types.Newsletter>('newsletter');
}

export async function fetchPublicationFeatures(): Promise<Types.PublicationFeature[]> {
	if (USE_PAYLOAD) {
		return PayloadClient.getAdaptedPublicationFeatures();
	}
	return ContentfulClient.fetchContentfulData<Types.PublicationFeature>('publicationFeature');
}

// ============================================================================
// SINGLE ENTRY FETCHERS (by slug)
// ============================================================================

export async function getEntryBySlug<T>(slug: string, collection: string): Promise<T | null> {
	if (USE_PAYLOAD) {
		// Route to correct adapted getter based on collection type
		switch (collection) {
			case 'program':
				return PayloadClient.getAdaptedProgrammeBySlug(slug) as Promise<T | null>;
			case 'portfolio':
				return PayloadClient.getAdaptedProjectBySlug(slug) as Promise<T | null>;
			case 'event':
				return PayloadClient.getAdaptedEventBySlug(slug) as Promise<T | null>;
			case 'news':
				return PayloadClient.getAdaptedNewsBySlug(slug) as Promise<T | null>;
			case 'publications':
				return PayloadClient.getAdaptedPublicationBySlug(slug) as Promise<T | null>;
			case 'blogPost':
				return PayloadClient.getAdaptedBlogPostBySlug(slug) as Promise<T | null>;
			case 'video':
				return PayloadClient.getAdaptedVideoBySlug(slug) as Promise<T | null>;
			case 'staff':
				return PayloadClient.getAdaptedTeamBySlug(slug) as Promise<T | null>;
			case 'speaker':
				return PayloadClient.getAdaptedSpeakerBySlug(slug) as Promise<T | null>;
			case 'unfssCop26':
			case 'eventSeries':
			case 'event-series':
				return PayloadClient.getAdaptedEventSeriesBySlug(slug) as Promise<T | null>;
			default:
				console.warn(`No Payload adapter for collection: ${collection}`);
				return null;
		}
	}

	return ContentfulClient.getEntryBySlug<T>(slug, collection);
}

// ============================================================================
// SPECIALIZED QUERIES
// ============================================================================

export async function fetchContentfulData<T>(
	contentType: string,
	options: {
		limit?: number;
		include?: number;
		select?: string[];
		ttl?: number;
	} = {}
): Promise<T[]> {
	if (USE_PAYLOAD) {
		// Map Contentful content types to Payload fetchers
		switch (contentType) {
			case 'program':
				return fetchProgrammes() as Promise<T[]>;
			case 'portfolio':
				return fetchProjects() as Promise<T[]>;
			case 'event':
				return fetchEvents() as Promise<T[]>;
			case 'news':
				return fetchNews() as Promise<T[]>;
			case 'publications':
				return fetchPublications() as Promise<T[]>;
			case 'blogPost':
				return fetchBlogPosts() as Promise<T[]>;
			case 'video':
				return fetchVideos() as Promise<T[]>;
			case 'staff':
				return fetchTeams() as Promise<T[]>;
			case 'speaker':
				return fetchSpeakers() as Promise<T[]>;
			case 'partners':
				return fetchPartners() as Promise<T[]>;
			case 'newsletter':
				return fetchNewsletters() as Promise<T[]>;
			case 'landingPage':
				return PayloadClient.getAdaptedLandingPage() as Promise<T[]>;
			case 'about':
				return PayloadClient.getAdaptedAboutPage() as Promise<T[]>;
			case 'unfssCop26':
			case 'eventSeries':
			case 'event-series':
				return fetchEventSeries() as Promise<T[]>;
			case 'publicationFeature':
				return PayloadClient.getAdaptedPublicationFeatures() as Promise<T[]>;
			default:
				console.warn(`No Payload mapping for content type: ${contentType}`);
				return [];
		}
	}

	return ContentfulClient.fetchContentfulData<T>(contentType, options);
}

// ============================================================================
// RE-EXPORTS FOR CONVENIENCE
// ============================================================================

export {
	fetchProgrammes as getProgrammes,
	fetchProjects as getProjects,
	fetchEvents as getEvents,
	fetchNews as getNews,
	fetchPublications as getPublications,
	fetchBlogPosts as getBlogPosts,
	fetchVideos as getVideos,
	fetchTeams as getTeams,
	fetchSpeakers as getSpeakers,
	fetchPartners as getPartners
};

// Re-export getEntryByDOINumber from Contentful client (Payload equivalent if needed)
export async function getEntryByDOINumber(doiNumber: string): Promise<Types.Publication | null> {
	if (USE_PAYLOAD) {
		return PayloadClient.getPayloadEntryByDOINumber(doiNumber).then((pub) => {
			if (pub) {
				// Import adapter dynamically to avoid circular deps
				const adapter = require('./payloadAdapter');
				return adapter.adaptPayloadPublication(pub);
			}
			return null;
		});
	}
	return ContentfulClient.getEntryByDOINumber(doiNumber);
}
