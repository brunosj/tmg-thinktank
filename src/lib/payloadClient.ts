// Payload CMS Client - replacement for Contentful client
import { env } from '$env/dynamic/private';
import type {
	Team,
	Job,
	Collaborator,
	Video,
	News,
	Publication,
	Post,
	Event,
	Project,
	PublicationFeature,
	EventSery as EventSeries,
	Initiative,
	Category,
	Homepage,
	PublicationsPage,
	VideosPage,
	Speaker,
	Page
} from './types/payload-types';

export interface PayloadCollectionResponse<T> {
	docs: T[];
	totalDocs: number;
	limit: number;
	totalPages: number;
	page: number;
	pagingCounter: number;
	hasPrevPage: boolean;
	hasNextPage: boolean;
}

export interface PayloadDocumentResponse<T> {
	doc: T;
}

const PAYLOAD_BASE_URL = env.SECRET_PAYLOAD_URL || 'http://localhost:3000';
const API_KEY = env.SECRET_PAYLOAD_API_KEY;

async function fetchFromPayload<T>(endpoint: string): Promise<T> {
	const url = `${PAYLOAD_BASE_URL}/api${endpoint}`;

	const headers: HeadersInit = {
		'Content-Type': 'application/json'
	};

	if (API_KEY) {
		headers['Authorization'] = `Bearer ${API_KEY}`;
	}

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error fetching from Payload:', error);
		throw error;
	}
}

export async function fetchPayloadData<T>(collection: string, limit = 1000): Promise<T[]> {
	try {
		const response = await fetchFromPayload<PayloadCollectionResponse<T>>(
			`/${collection}?limit=${limit}&depth=2`
		);
		return response.docs;
	} catch (error) {
		console.error(`Error fetching ${collection} from Payload:`, error);
		return [];
	}
}

export async function getPayloadEntryBySlug<T>(
	slug: string,
	collection: string
): Promise<T | null> {
	try {
		const response = await fetchFromPayload<PayloadCollectionResponse<T>>(
			`/${collection}?where[slug][equals]=${slug}&limit=1&depth=2`
		);

		if (response.docs.length > 0) {
			return response.docs[0];
		}

		return null;
	} catch (error) {
		console.error(`Error fetching ${collection} entry by slug:`, error);
		return null;
	}
}

export async function getPayloadEntryByDOINumber(doiNumber: string): Promise<Publication | null> {
	try {
		const response = await fetchFromPayload<PayloadCollectionResponse<Publication>>(
			`/publications?where[info.doiNumber][equals]=${doiNumber}&limit=1&depth=2`
		);

		if (response.docs.length > 0) {
			return response.docs[0];
		}

		return null;
	} catch (error) {
		console.error('Error fetching publication by DOI:', error);
		return null;
	}
}

// Helper function to get featured content
export async function getFeaturedContent<T>(
	collection: string,
	featuredField = 'featured'
): Promise<T[]> {
	try {
		const response = await fetchFromPayload<PayloadCollectionResponse<T>>(
			`/${collection}?where[${featuredField}][equals]=true&depth=2`
		);
		return response.docs;
	} catch (error) {
		console.error(`Error fetching featured ${collection}:`, error);
		return [];
	}
}

// Helper function for date-based queries
export async function getContentByDateRange<T>(
	collection: string,
	dateField: string,
	startDate?: string,
	endDate?: string
): Promise<T[]> {
	try {
		let query = `/${collection}?depth=2`;

		if (startDate) {
			query += `&where[${dateField}][greater_than_equal]=${startDate}`;
		}

		if (endDate) {
			query += `&where[${dateField}][less_than_equal]=${endDate}`;
		}

		const response = await fetchFromPayload<PayloadCollectionResponse<T>>(query);
		return response.docs;
	} catch (error) {
		console.error(`Error fetching ${collection} by date range:`, error);
		return [];
	}
}

// Collection-specific helpers for easier frontend migration

export async function getTeamMembers(): Promise<Team[]> {
	return fetchPayloadData<Team>('teams');
}

export async function getTeamMemberBySlug(slug: string): Promise<Team | null> {
	return getPayloadEntryBySlug<Team>(slug, 'teams');
}

export async function getJobs(): Promise<Job[]> {
	return fetchPayloadData<Job>('jobs');
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
	return getPayloadEntryBySlug<Job>(slug, 'jobs');
}

export async function getCollaborators(): Promise<Collaborator[]> {
	return fetchPayloadData<Collaborator>('collaborators');
}

export async function getSpeakers(): Promise<Speaker[]> {
	return fetchPayloadData<Speaker>('speakers');
}

export async function getSpeakerBySlug(slug: string): Promise<Speaker | null> {
	return getPayloadEntryBySlug<Speaker>(slug, 'speakers');
}

export async function getPages(): Promise<Page[]> {
	return fetchPayloadData<Page>('pages');
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
	return getPayloadEntryBySlug<Page>(slug, 'pages');
}

export async function getVideos(): Promise<Video[]> {
	return fetchPayloadData<Video>('videos');
}

export async function getVideoBySlug(slug: string): Promise<Video | null> {
	return getPayloadEntryBySlug<Video>(slug, 'videos');
}

export async function getNews(): Promise<News[]> {
	return fetchPayloadData<News>('news');
}

export async function getNewsBySlug(slug: string): Promise<News | null> {
	return getPayloadEntryBySlug<News>(slug, 'news');
}

export async function getPublications(): Promise<Publication[]> {
	return fetchPayloadData<Publication>('publications');
}

export async function getPublicationBySlug(slug: string): Promise<Publication | null> {
	return getPayloadEntryBySlug<Publication>(slug, 'publications');
}

export async function getBlogPosts(): Promise<Post[]> {
	try {
		// Fetch only published posts
		const response = await fetchFromPayload<PayloadCollectionResponse<Post>>(
			'/posts?where[_status][equals]=published&limit=1000&depth=2'
		);
		console.log(`Fetched ${response.docs.length} published blog posts from Payload`);
		return response.docs;
	} catch (error) {
		console.error('Error fetching published blog posts:', error);
		// Fallback to try without status filter in case of issues
		try {
			const fallbackResponse = await fetchFromPayload<PayloadCollectionResponse<Post>>(
				'/posts?limit=1000&depth=2'
			);
			console.log(
				`Fallback: Fetched ${fallbackResponse.docs.length} total blog posts from Payload`
			);
			// Filter for published posts in JavaScript as backup
			const publishedPosts = fallbackResponse.docs.filter(
				(post) => !post._status || post._status === 'published'
			);
			console.log(`${publishedPosts.length} posts are published or have no status`);
			return publishedPosts;
		} catch (fallbackError) {
			console.error('Error fetching blog posts (fallback):', fallbackError);
			return [];
		}
	}
}

export async function getBlogPostBySlug(slug: string): Promise<Post | null> {
	return getPayloadEntryBySlug<Post>(slug, 'posts');
}

export async function getEvents(): Promise<Event[]> {
	return fetchPayloadData<Event>('events');
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
	return getPayloadEntryBySlug<Event>(slug, 'events');
}

export async function getProjects(): Promise<Project[]> {
	return fetchPayloadData<Project>('projects');
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
	return getPayloadEntryBySlug<Project>(slug, 'projects');
}

export async function getPublicationFeatures(): Promise<PublicationFeature[]> {
	return fetchPayloadData<PublicationFeature>('publication-features');
}

export async function getPublicationFeatureBySlug(
	slug: string
): Promise<PublicationFeature | null> {
	return getPayloadEntryBySlug<PublicationFeature>(slug, 'publication-features');
}

export async function getEventSeries(): Promise<EventSeries[]> {
	return fetchPayloadData<EventSeries>('event-series');
}

export async function getEventSeriesBySlug(slug: string): Promise<EventSeries | null> {
	return getPayloadEntryBySlug<EventSeries>(slug, 'event-series');
}

export async function getInitiatives(): Promise<Initiative[]> {
	return fetchPayloadData<Initiative>('initiatives');
}

export async function getInitiativeBySlug(slug: string): Promise<Initiative | null> {
	return getPayloadEntryBySlug<Initiative>(slug, 'initiatives');
}

export async function getProgrammes(): Promise<Category[]> {
	try {
		const response = await fetchFromPayload<PayloadCollectionResponse<Category>>(
			'/categories?where[type][equals]=programme&depth=2'
		);
		return response.docs;
	} catch (error) {
		console.error('Error fetching programmes:', error);
		return [];
	}
}

export async function getHomepage(): Promise<Homepage | null> {
	try {
		const response = await fetchFromPayload<PayloadCollectionResponse<Homepage>>(
			'/homepage?limit=1&depth=2'
		);

		if (response.docs.length > 0) {
			return response.docs[0];
		}

		return null;
	} catch (error) {
		console.error('Error fetching homepage:', error);
		return null;
	}
}

// Helper for upcoming events
export async function getUpcomingEvents(limit = 4): Promise<Event[]> {
	const today = new Date().toISOString();
	try {
		const response = await fetchFromPayload<PayloadCollectionResponse<Event>>(
			`/events?where[info.date][greater_than_equal]=${today}&sort=info.date&limit=${limit}&depth=2`
		);
		return response.docs;
	} catch (error) {
		console.error('Error fetching upcoming events:', error);
		return [];
	}
}

// Helper for latest blog posts
export async function getLatestBlogPosts(limit = 3): Promise<Post[]> {
	try {
		const response = await fetchFromPayload<PayloadCollectionResponse<Post>>(
			`/posts?sort=-publishedAt&limit=${limit}&depth=2`
		);
		return response.docs;
	} catch (error) {
		console.error('Error fetching latest blog posts:', error);
		return [];
	}
}

// Helper for latest news
export async function getLatestNews(limit = 3): Promise<News[]> {
	try {
		const response = await fetchFromPayload<PayloadCollectionResponse<News>>(
			`/news?sort=-info.dateFormat&limit=${limit}&depth=2`
		);
		return response.docs;
	} catch (error) {
		console.error('Error fetching latest news:', error);
		return [];
	}
}

// Page-specific collection functions

export async function getPublicationsPage(): Promise<PublicationsPage | null> {
	try {
		const response = await fetchFromPayload<PayloadCollectionResponse<PublicationsPage>>(
			'/publications-page?limit=1&depth=2'
		);
		return response.docs.length > 0 ? response.docs[0] : null;
	} catch (error) {
		console.error('Error fetching publications page:', error);
		return null;
	}
}

export async function getVideosPage(): Promise<VideosPage | null> {
	try {
		const response = await fetchFromPayload<PayloadCollectionResponse<VideosPage>>(
			'/videos-page?limit=1&depth=2'
		);
		return response.docs.length > 0 ? response.docs[0] : null;
	} catch (error) {
		console.error('Error fetching videos page:', error);
		return null;
	}
}
