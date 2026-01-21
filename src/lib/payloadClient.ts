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
	// PublicationsPage,
	// VideosPage,
	Speaker,
	Page,
	ReportBuilder
} from '$lib/types/payload-types';

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

// In-memory cache to prevent repeated fetches during HMR
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5000; // 5 seconds (reduced for debugging)

async function fetchFromPayload<T>(endpoint: string): Promise<T> {
	// Check cache first
	const cached = cache.get(endpoint);
	if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
		return cached.data;
	}

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
			const errorText = await response.text();
			console.error(`❌ Payload API error (${response.status}): ${url}`, errorText);
			throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
		}

		const data = await response.json();

		// Store in cache
		cache.set(endpoint, { data, timestamp: Date.now() });

		return data;
	} catch (error) {
		console.error('❌ Error fetching from Payload:', url, error);
		throw error;
	}
}

export async function fetchPayloadData<T>(collection: string, limit = 1000): Promise<T[]> {
	try {
		const response = await fetchFromPayload<PayloadCollectionResponse<T>>(
			`/${collection}?limit=${limit}&depth=1`
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
			`/${collection}?where[slug][equals]=${slug}&limit=1&depth=4`
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
	try {
		const response = await fetchFromPayload<PayloadCollectionResponse<Publication>>(
			'/publications?limit=1000&depth=3'
		);
		return response.docs;
	} catch (error) {
		console.error('Error fetching publications from Payload:', error);
		return [];
	}
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
		return response.docs;
	} catch (error) {
		console.error('Error fetching published blog posts:', error);
		// Fallback to try without status filter in case of issues
		try {
			const fallbackResponse = await fetchFromPayload<PayloadCollectionResponse<Post>>(
				'/posts?limit=1000&depth=2'
			);
			// Filter for published posts in JavaScript as backup
			const publishedPosts = fallbackResponse.docs.filter(
				(post) => !post._status || post._status === 'published'
			);
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

export async function getCollaborators(): Promise<any[]> {
	try {
		const response = await fetchFromPayload<PayloadCollectionResponse<any>>(
			'/collaborators?limit=1000&depth=2'
		);
		return response.docs;
	} catch (error) {
		console.error('Error fetching collaborators:', error);
		return [];
	}
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

export async function getProgrammes(): Promise<any[]> {
	try {
		// Fetch from programmes collection with depth=5 to populate all nested relationships including media
		const response = await fetchFromPayload<PayloadCollectionResponse<any>>(
			'/programmes?depth=5&limit=1000'
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

// export async function getPublicationsPage(): Promise<PublicationsPage | null> {
// 	try {
// 		const response = await fetchFromPayload<PayloadCollectionResponse<PublicationsPage>>(
// 			'/publications-page?limit=1&depth=2'
// 		);
// 		return response.docs.length > 0 ? response.docs[0] : null;
// 	} catch (error) {
// 		console.error('Error fetching publications page:', error);
// 		return null;
// 	}
// }

// export async function getVideosPage(): Promise<VideosPage | null> {
// 	try {
// 		const response = await fetchFromPayload<PayloadCollectionResponse<VideosPage>>(
// 			'/videos-page?limit=1&depth=2'
// 		);
// 		return response.docs.length > 0 ? response.docs[0] : null;
// 	} catch (error) {
// 		console.error('Error fetching videos page:', error);
// 		return null;
// 	}
// }

// Report Builder functions

export async function getReports(): Promise<ReportBuilder[]> {
	return fetchPayloadData<ReportBuilder>('report-builder');
}

export async function getReportBySlug(slug: string): Promise<ReportBuilder | null> {
	return getPayloadEntryBySlug<ReportBuilder>(slug, 'report-builder');
}

export async function getPublishedReports(): Promise<ReportBuilder[]> {
	try {
		const response = await fetchFromPayload<PayloadCollectionResponse<ReportBuilder>>(
			'/report-builder?where[_status][equals]=published&limit=1000&depth=2'
		);
		return response.docs;
	} catch (error) {
		console.error('Error fetching published reports:', error);
		return [];
	}
}

// ============================================================================
// ADAPTED GETTERS - Transform Payload to Contentful Format
// ============================================================================

import * as Adapter from './payloadAdapter';
import type * as ContentfulTypes from './types/types';

// Collection getters (return arrays)

export async function getAdaptedProgrammes(): Promise<ContentfulTypes.Programme[]> {
	const programmes = await getProgrammes();
	return Adapter.adaptPayloadProgrammes(programmes);
}

export async function getAdaptedProjects(): Promise<ContentfulTypes.Project[]> {
	const projects = await getProjects();
	return Adapter.adaptPayloadProjects(projects);
}

export async function getAdaptedEvents(): Promise<ContentfulTypes.Event[]> {
	const events = await getEvents();
	const adapted = Adapter.adaptPayloadEvents(events);
	return adapted;
}

export async function getAdaptedNews(): Promise<ContentfulTypes.News[]> {
	const news = await getNews();
	return Adapter.adaptPayloadNewsItems(news);
}

export async function getAdaptedPublications(): Promise<ContentfulTypes.Publication[]> {
	const publications = await getPublications();
	return Adapter.adaptPayloadPublications(publications);
}

export async function getAdaptedBlogPosts(): Promise<ContentfulTypes.BlogPost[]> {
	const posts = await getBlogPosts();
	return Adapter.adaptPayloadBlogPosts(posts);
}

export async function getAdaptedVideos(): Promise<ContentfulTypes.Video[]> {
	const videos = await getVideos();
	return Adapter.adaptPayloadVideos(videos);
}

export async function getAdaptedTeams(): Promise<ContentfulTypes.Team[]> {
	const teams = await getTeamMembers();
	return Adapter.adaptPayloadTeams(teams);
}

export async function getAdaptedSpeakers(): Promise<ContentfulTypes.Speaker[]> {
	const speakers = await getSpeakers();
	return Adapter.adaptPayloadSpeakers(speakers);
}

export async function getAdaptedCollaborators(): Promise<ContentfulTypes.Partner[]> {
	const collaborators = await getCollaborators();
	return Adapter.adaptPayloadCollaborators(collaborators);
}

// Single entry getters (by slug)

export async function getAdaptedProgrammeBySlug(
	slug: string
): Promise<ContentfulTypes.Programme | null> {
	try {
		const response = await fetchFromPayload<PayloadCollectionResponse<any>>(
			`/programmes?where[slug][equals]=${slug}&limit=1&depth=5`
		);
		if (response.docs.length > 0) {
			return Adapter.adaptPayloadProgramme(response.docs[0]);
		}
		return null;
	} catch (error) {
		console.error('Error fetching programme by slug:', error);
		return null;
	}
}

export async function getAdaptedProjectBySlug(
	slug: string
): Promise<ContentfulTypes.Project | null> {
	const project = await getProjectBySlug(slug);
	return project ? Adapter.adaptPayloadProject(project) : null;
}

export async function getAdaptedEventBySlug(slug: string): Promise<ContentfulTypes.Event | null> {
	const event = await getEventBySlug(slug);
	return event ? Adapter.adaptPayloadEvent(event) : null;
}

export async function getAdaptedNewsBySlug(slug: string): Promise<ContentfulTypes.News | null> {
	const news = await getNewsBySlug(slug);
	return news ? Adapter.adaptPayloadNews(news) : null;
}

export async function getAdaptedPublicationBySlug(
	slug: string
): Promise<ContentfulTypes.Publication | null> {
	const publication = await getPublicationBySlug(slug);
	return publication ? Adapter.adaptPayloadPublication(publication) : null;
}

export async function getAdaptedBlogPostBySlug(
	slug: string
): Promise<ContentfulTypes.BlogPost | null> {
	const post = await getBlogPostBySlug(slug);
	return post ? Adapter.adaptPayloadBlogPost(post) : null;
}

export async function getAdaptedVideoBySlug(slug: string): Promise<ContentfulTypes.Video | null> {
	const video = await getVideoBySlug(slug);
	return video ? Adapter.adaptPayloadVideo(video) : null;
}

export async function getAdaptedTeamBySlug(slug: string): Promise<ContentfulTypes.Team | null> {
	const team = await getTeamMemberBySlug(slug);
	return team ? Adapter.adaptPayloadTeam(team) : null;
}

export async function getAdaptedSpeakerBySlug(
	slug: string
): Promise<ContentfulTypes.Speaker | null> {
	const speaker = await getSpeakerBySlug(slug);
	return speaker ? Adapter.adaptPayloadSpeaker(speaker) : null;
}

export async function getAdaptedEventSeriesBySlug(
	slug: string
): Promise<ContentfulTypes.EventSeries | null> {
	const eventSeries = await getEventSeriesBySlug(slug);
	return eventSeries ? Adapter.adaptPayloadEventSeries(eventSeries) : null;
}

export async function getAdaptedEventSeries(): Promise<ContentfulTypes.EventSeries[]> {
	const eventSeries = await getEventSeries();
	return Adapter.adaptPayloadEventSeriesItems(eventSeries);
}

export async function getAdaptedPublicationFeatures(): Promise<ContentfulTypes.PublicationFeature[]> {
	const features = await getPublicationFeatures();
	return Adapter.adaptPayloadPublicationFeatures(features);
}

// Legacy page getters
export async function getAdaptedLandingPage(): Promise<ContentfulTypes.LandingPage[]> {
	// Fetch with depth=2 to get newsletter banner relationship
	const response = await fetchFromPayload<PayloadCollectionResponse<any>>(
		'/legacy-landing-page?limit=1&depth=2'
	);
	const pages = response.docs;

	// Return in Contentful format with fields wrapper
	return pages.map((page) => {
		// Handle hero picture - can be a media object or string ID
		let heroPictureArray: any[] = [];
		if (page.heroPicture) {
			const heroPicture = typeof page.heroPicture === 'object' ? page.heroPicture : null;
			if (heroPicture?.url) {
				const imageUrl = heroPicture.url.startsWith('http')
					? heroPicture.url
					: `${PAYLOAD_BASE_URL}${heroPicture.url}`;
				heroPictureArray = [{ secure_url: imageUrl }];
			}
		}

		// Handle newsletter banner - it's a relationship to the banners collection
		let newsletterBanner: any = {
			fields: {
				title: '',
				subtitle: '',
				buttonText: 'Subscribe',
				buttonPath: '/newsletter',
				imageCdn: [],
				publications: []
			}
		};

		if (page.newsletterBanner && typeof page.newsletterBanner === 'object') {
			const banner = page.newsletterBanner;

			// Handle link field - the structure is banner.link.link (outer group, inner link field)
			let buttonPath = '/newsletter';
			let buttonText = 'Subscribe';

			// Try different possible structures for the link field
			const linkData = banner.link?.link || banner.link;
			if (linkData) {
				if (linkData.label) {
					buttonText = linkData.label;
				}
				if (linkData.type === 'custom' && linkData.url) {
					buttonPath = linkData.url;
				} else if (linkData.type === 'reference' && linkData.reference) {
					// Handle reference type - construct URL from referenced document
					const ref = typeof linkData.reference === 'object' ? linkData.reference : null;
					if (ref?.slug) {
						buttonPath = `/${ref.slug}`;
					}
				}
			}

			newsletterBanner = {
				fields: {
					title: banner.title || '',
					subtitle: banner.subtitle || '',
					buttonText: buttonText,
					buttonPath: buttonPath,
					imageCdn: [],
					publications: []
				}
			};
		}

		// Handle featured items - polymorphic relationship to news, events, posts, videos
		const featuredItems: any[] = [];
		if (page.featuredItems && Array.isArray(page.featuredItems)) {
			for (const item of page.featuredItems) {
				if (!item || typeof item !== 'object') continue;

				// Determine the type and adapt accordingly
				const relationTo = item.relationTo;
				const value = item.value;

				if (!value || typeof value !== 'object') continue;

				try {
					let adaptedItem = null;
					switch (relationTo) {
						case 'news':
							adaptedItem = Adapter.adaptPayloadNews(value);
							break;
						case 'events':
							adaptedItem = Adapter.adaptPayloadEvent(value);
							break;
						case 'posts':
							adaptedItem = Adapter.adaptPayloadBlogPost(value);
							break;
						case 'videos':
							adaptedItem = Adapter.adaptPayloadVideo(value);
							break;
					}

					if (adaptedItem) {
						featuredItems.push(adaptedItem);
					}
				} catch (error) {
					console.error(`Failed to adapt featured item of type ${relationTo}:`, error);
				}
			}
		}

		return {
			fields: {
				title: page.title || '',
				heroTitle: page.heroTitle || '',
				heroPicture: heroPictureArray,
				heroPictureAspectRatio: page.heroPictureAspectRatio || false,
				heroText: page.heroText || '',
				heroSubtitle: page.heroSubtitle || '',
				heroLink: page.heroLink || '',
				heroBackgroundColor: page.heroBackgroundColor || '',
				latestSectionTitle: page.latestSectionTitle || '',
				latestSectionSubtitle: page.latestSectionSubtitle || '',
				featuredItems: featuredItems,
				programmeSectionTitle: page.programmeSectionTitle || '',
				eventSectionTitle: page.eventSectionTitle || '',
				eventSectionSubtitle: page.eventSectionSubtitle || '',
				eventSeriesBanner: { fields: { title: '', description: '', file: { url: '' } } },
				blogSectionTitle: page.blogSectionTitle || '',
				blogSectionSubtitle: page.blogSectionSubtitle || '',
				newsletterBanner: newsletterBanner,
				networksSectionTitle: page.networksSectionTitle || '',
				networksSectionSubtitle: page.networksSectionSubtitle || ''
			}
		};
	});
}

export async function getAdaptedAboutPage(): Promise<ContentfulTypes.AboutPage[]> {
	// Fetch with depth=1 to avoid circular references
	const response = await fetchFromPayload<PayloadCollectionResponse<any>>(
		'/legacy-about-page?limit=1&depth=1'
	);
	const pages = response.docs;

	// Return in Contentful format with fields wrapper
	return pages.map((page) => {
		// Handle quote picture - can be a media object or string ID
		let quotePicture: any = null;
		if (page.quotePicture) {
			const quotePic = typeof page.quotePicture === 'object' ? page.quotePicture : null;
			if (quotePic?.url) {
				// Return in Contentful format
				quotePicture = {
					fields: {
						file: {
							url: `${PAYLOAD_BASE_URL}${quotePic.url}`
						}
					}
				};
			}
		}

		return {
			fields: {
				title: page.title || '',
				description: page.description || '',
				teamSectionText: page.teamSectionText || '',
				slug: page.slug || 'about',
				quote: page.quote || '',
				quoteAuthor: page.quoteAuthor || '',
				quotePicture: quotePicture
			}
		};
	});
}
