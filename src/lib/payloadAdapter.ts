import type * as PayloadTypes from './types/payload-types';
import type * as ContentfulTypes from './types/types';
import { DEBUG_CMS } from './config/features';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Safely get nested property value
 */
function get(obj: any, path: string, defaultValue: any = null): any {
	if (!obj) return defaultValue;
	const keys = path.split('.');
	let result = obj;
	for (const key of keys) {
		if (result?.[key] === undefined) return defaultValue;
		result = result[key];
	}
	return result;
}

/**
 * Check if relationship is populated (object) or just an ID (string)
 */
function isPopulated(rel: any): boolean {
	return rel && typeof rel === 'object' && !Array.isArray(rel);
}

/**
 * Convert Payload media to Contentful Image format
 */
function adaptMedia(media: any): ContentfulTypes.Image | null {
	if (!media) return null;

	// If it's a string (ID), we can't adapt it properly
	if (typeof media === 'string') {
		return null;
	}

	return {
		fields: {
			title: media.alt || media.filename || '',
			description: media.caption || '',
			file: {
				url: media.url || ''
			}
		}
	};
}

/**
 * Convert Cloudinary URL to Contentful ImageCdn format
 */
function adaptCloudinaryUrl(url: string | null | undefined, caption: string = ''): ContentfulTypes.ImageCdn[] {
	if (!url) return [];

	return [
		{
			secure_url: url,
			context: {
				custom: {
					caption: caption
				}
			}
		}
	];
}

/**
 * Adapt array of media (handles both local uploads and Cloudinary)
 */
function adaptMediaArray(items: any[]): ContentfulTypes.ImageCdn[] {
	if (!items || !Array.isArray(items)) {
		return [];
	}

	return items
		.map((item) => {
			// If item is null or undefined, skip
			if (!item) {
				return null;
			}

			// If item is a Cloudinary URL string
			if (typeof item === 'string') {
				return {
					secure_url: item,
					context: {
						custom: {
							caption: ''
						}
					}
				};
			}

			// If item has an image property (from array field)
			if (item?.image && isPopulated(item.image)) {
				const url = item.image.url || '';
				return {
					secure_url: url,
					context: {
						custom: {
							caption: item.image.caption || item.image.alt || ''
						}
					}
				};
			}

			// If item is a media object directly
			if (isPopulated(item)) {
				const url = item.url || '';
				return {
					secure_url: url,
					context: {
						custom: {
							caption: item.caption || item.alt || ''
						}
					}
				};
			}

			return null;
		})
		.filter(Boolean) as ContentfulTypes.ImageCdn[];
}

/**
 * Convert Lexical rich text to Contentful document format
 * This is a simplified version - for full implementation, parse Lexical JSON
 */
function adaptRichText(richText: any): any {
	if (!richText) return null;

	// If it's already a string, return as-is
	if (typeof richText === 'string') {
		return richText;
	}

	// If it's Lexical format, return as-is for now
	// The frontend's renderRichText will handle it
	return richText;
}

// ============================================================================
// COLLECTION ADAPTERS
// ============================================================================

/**
 * Adapt Payload Category (type: programme) to Contentful Programme
 */
export function adaptPayloadProgramme(
	payload: any
): ContentfulTypes.Programme | null {
	if (!payload || typeof payload === 'string') return null;


	// Adapt topics (direct field in programmes collection)
	const topics = Array.isArray(payload.topics)
		? payload.topics
				.map((t: any) => {
					if (!isPopulated(t)) return null;
					return adaptPayloadTopic(t);
				})
				.filter(Boolean)
		: [];

	// Adapt initiatives (direct field in programmes collection)
	const initiatives = Array.isArray(payload.initiatives)
		? payload.initiatives.map((i: any) => {
				if (!isPopulated(i)) return null;


				// Convert Initiative to match Contentful structure
				return {
					fields: {
						title: i.title || '',
						summary: i.summary || '',
						text1: adaptRichText(i.text1),
						pageBanner: i.pageBanner ? adaptMedia(i.pageBanner) : null,
						pageBannerCdn: i.pageBanner ? adaptMediaArray([i.pageBanner]) : [],
						slug: i.slug || ''
					}
				};
			}).filter(Boolean)
		: [];

	// Adapt flagship output (group field with title/url/description)
	let flagshipOutput = null;
	if (payload.flagshipOutput && typeof payload.flagshipOutput === 'object') {
		const flagship = payload.flagshipOutput;

		flagshipOutput = {
			fields: {
				title: flagship.title || '',
				subtitle: '', // Not in programmes collection
				summary: '', // Not in programmes collection
				text1: adaptRichText(flagship.description),
				image: null, // Not in programmes collection
				imageCdn: [],
				slug: flagship.url?.replace('/initiatives/', '') || ''
			}
		};
	}

	// Adapt featured items (group with separate arrays in programmes collection)
	const featuredItemsGroup = get(payload, 'featuredItems', {});
	const allFeaturedItems: any[] = [];

	// Combine all featured item types
	if (Array.isArray(featuredItemsGroup.featuredNews)) {
		allFeaturedItems.push(...featuredItemsGroup.featuredNews.map((item: any) => {
			if (!isPopulated(item)) return null;
			return adaptPayloadNews(item);
		}).filter(Boolean));
	}
	if (Array.isArray(featuredItemsGroup.featuredEvents)) {
		allFeaturedItems.push(...featuredItemsGroup.featuredEvents.map((item: any) => {
			if (!isPopulated(item)) return null;
			return adaptPayloadEvent(item);
		}).filter(Boolean));
	}
	if (Array.isArray(featuredItemsGroup.featuredProjects)) {
		allFeaturedItems.push(...featuredItemsGroup.featuredProjects.map((item: any) => {
			if (!isPopulated(item)) return null;
			return adaptPayloadProject(item);
		}).filter(Boolean));
	}
	if (Array.isArray(featuredItemsGroup.featuredPublications)) {
		allFeaturedItems.push(...featuredItemsGroup.featuredPublications.map((item: any) => {
			if (!isPopulated(item)) return null;
			return adaptPayloadPublication(item);
		}).filter(Boolean));
	}

	return {
		fields: {
			title: payload.title || '',
			actionVerb: payload.actionVerb || '',
			subtitle: payload.subtitle || '',
			bannerPicture: payload.bannerImage ? adaptMediaArray([payload.bannerImage]) : [],
			quote: payload.quote || '',
			quoteAuthor: payload.quoteAuthor || '',
			description: adaptRichText(payload.description),
			featuredItems: allFeaturedItems,
			topics: topics as ContentfulTypes.Topic[],
			slug: payload.slug || '',
			flagshipOutput: flagshipOutput,
			initiatives: initiatives as any[]
		}
	};
}

/**
 * Adapt Payload Topic to Contentful Topic
 */
export function adaptPayloadTopic(
	payload: any | string
): ContentfulTypes.Topic | null {
	if (!payload || typeof payload === 'string') return null;

	return {
		fields: {
			title: payload.title || '',
			summary: payload.summary || '',
			programmes: Array.isArray(payload.programmes)
				? payload.programmes.map((p: any) => (isPopulated(p) ? adaptPayloadProgramme(p) : null)).filter(Boolean)
				: [],
			descriptionIntro: payload.descriptionIntro || '',
			description: adaptRichText(payload.description),
			image: payload.image ? adaptMedia(payload.image) : null,
			imageCdn: payload.image ? adaptMediaArray([payload.image]) : [],
			projects: Array.isArray(payload.projects)
				? payload.projects.map((p: any) => (isPopulated(p) ? adaptPayloadProject(p) : null)).filter(Boolean)
				: [],
			slug: payload.slug || ''
		}
	};
}

/**
 * Adapt Payload Project to Contentful Project
 */
export function adaptPayloadProject(
	payload: PayloadTypes.Project | string
): ContentfulTypes.Project | null {
	if (!payload || typeof payload === 'string') return null;

	const info = get(payload, 'info', {});
	const content = get(payload, 'content', {});
	const relationships = get(payload, 'relationships', {});

	return {
		fields: {
			name: payload.name || '',
			summary: info.summary || '',
			quote: info.quote || '',
			quoteAuthor: info.quoteAuthor || '',
			description: adaptRichText(content.description),
			programme: isPopulated(info.programme)
				? adaptPayloadProgramme(info.programme as any)
				: null,
			topics: Array.isArray(info.topics)
				? info.topics.map((t: any) => (isPopulated(t) ? adaptPayloadTopic(t) : null)).filter(Boolean)
				: [],
			year: info.year || '',
			partnersList: Array.isArray(info.partnersList)
				? info.partnersList.map((p: any) => ({
						fields: {
							partnerOrFunder: 'Partner',
							name: p.partner || '',
							logo: null,
							logoCdn: [],
							url: ''
						}
					}))
				: [],
			fundersList: Array.isArray(info.fundersList)
				? info.fundersList.map((f: any) => ({
						fields: {
							partnerOrFunder: 'Funder',
							name: f.funder || '',
							logo: null,
							logoCdn: [],
							url: ''
						}
					}))
				: [],
			contractingAuthorityList: Array.isArray(info.contractingAuthorityList)
				? info.contractingAuthorityList.map((a: any) => ({
						fields: {
							partnerOrFunder: 'Authority',
							name: a.authority || '',
							logo: null,
							logoCdn: [],
							url: ''
						}
					}))
				: [],
			thumbnail: content.thumbnail ? adaptMedia(content.thumbnail) : null,
			thumbnailCdn: (payload as any).thumbnailFromCloudinary
				? adaptCloudinaryUrl((payload as any).thumbnailFromCloudinary)
				: content.thumbnail
					? adaptMediaArray([content.thumbnail])
					: [],
			gallery: Array.isArray(content.gallery) ? adaptMediaArray(content.gallery) : [],
			team: Array.isArray(relationships.team)
				? relationships.team.map((t: any) => (isPopulated(t) ? adaptPayloadTeam(t) : null)).filter(Boolean)
				: [],
			url: info.url || '',
			videos: Array.isArray(relationships.videos)
				? relationships.videos.map((v: any) => (isPopulated(v) ? adaptPayloadVideo(v) : null)).filter(Boolean)
				: [],
			relatedProjects: Array.isArray(relationships.relatedProjects)
				? relationships.relatedProjects.map((p: any) => (isPopulated(p) ? adaptPayloadProject(p) : null)).filter(Boolean)
				: [],
			slug: payload.slug || ''
		}
	};
}

/**
 * Adapt Payload Event to Contentful Event
 */
export function adaptPayloadEvent(payload: PayloadTypes.Event | string): ContentfulTypes.Event | null {
	if (!payload || typeof payload === 'string') return null;

	const info = get(payload, 'info', {});
	const content = get(payload, 'content', {});
	const relationships = get(payload, 'relationships', {});

	return {
		fields: {
			topBanner: info.topBanner ? adaptMediaArray(info.topBanner) : [],
			featureOnEventsPage: info.featured || false,
			programme: isPopulated(info.programme)
				? adaptPayloadProgramme(info.programme)
				: null,
			title: payload.title || '',
			secondLanguage: info.secondLanguage || '',
			titleSecondLanguage: info.titleSecondLanguage || '',
			summary: info.summary || '',
			keywords: info.keywords || [],
			tmgMainOrganizer: info.tmgMainOrganizer || false,
			organiser: info.organizer || [],
			type: info.type || '',
			date: payload.date || '', // Top-level field, not in info
			endDate: payload.endDate || '', // Top-level field, not in info
			location: payload.location || '', // Top-level field, not in info
			language: info.language || [],
			eventUrl: info.eventUrl || '',
			description: adaptRichText(content.description),
			background: adaptRichText(content.background),
			video: null,
			speakers: Array.isArray(relationships.speakers)
				? relationships.speakers.map((s: any) => (isPopulated(s) ? adaptPayloadSpeaker(s) : null)).filter(Boolean)
				: [],
			facilitators: Array.isArray(relationships.facilitators)
				? relationships.facilitators
						.map((f: any) => (isPopulated(f) ? adaptPayloadSpeaker(f) : null))
						.filter(Boolean)
				: [],
			image: content.image ? adaptMedia(content.image) : null,
			imageCdn: content.imageCdn ? adaptMediaArray(content.imageCdn) : [],
			contactPerson: Array.isArray(info.contactPerson)
				? info.contactPerson.map((c: any) => (isPopulated(c) ? adaptPayloadTeam(c) : null)).filter(Boolean)
				: [],
			contactPersonEmail: info.contactPersonEmail || '',
			imagePosition: info.imagePosition || 'Top',
			news: Array.isArray(relationships.news)
				? relationships.news.map((n: any) => (isPopulated(n) ? adaptPayloadNews(n) : null)).filter(Boolean)
				: [],
			relatedEvents: Array.isArray(relationships.relatedEvents)
				? relationships.relatedEvents.map((e: any) => (isPopulated(e) ? adaptPayloadEvent(e) : null)).filter(Boolean)
				: [],
			relatedVideos: Array.isArray(relationships.relatedVideos)
				? relationships.relatedVideos.map((v: any) => (isPopulated(v) ? adaptPayloadVideo(v) : null)).filter(Boolean)
				: [],
			relatedDocuments: Array.isArray(relationships.relatedDocuments)
				? relationships.relatedDocuments
						.map((d: any) => (isPopulated(d) ? adaptPayloadPublication(d) : null))
						.filter(Boolean)
				: [],
			eventRecording: null,
			livestreamUrl: info.livestreamUrl || '',
			livestreamPassword: info.livestreamPassword || '',
			livestream: null,
			chat: null,
			thumbnail: content.thumbnail ? adaptMedia(content.thumbnail) : null,
			slug: payload.slug || ''
		}
	};
}

/**
 * Adapt Payload News to Contentful News
 */
export function adaptPayloadNews(payload: PayloadTypes.News | string): ContentfulTypes.News | null {
	if (!payload || typeof payload === 'string') return null;

	const info = get(payload, 'info', {});
	const content = get(payload, 'content', {});
	const relationships = get(payload, 'relationships', {});

	return {
		fields: {
			programme: isPopulated(info.programme)
				? adaptPayloadProgramme(info.programme as any)
				: null,
			secondProgramme: isPopulated(info.secondProgramme)
				? adaptPayloadProgramme(info.secondProgramme as any)
				: null,
			project: Array.isArray(info.project)
				? info.project.map((p: any) => (isPopulated(p) ? adaptPayloadProject(p) : null)).filter(Boolean)
				: [],
			dateFormat: info.dateFormat || '',
			type: (info.type || 'News') as 'Media Coverage' | 'Press Release' | 'News' | 'Publication' | 'Video',
			author: info.author || '',
			authorTmg: Array.isArray(info.authorTmg)
				? info.authorTmg.map((a: any) => (isPopulated(a) ? adaptPayloadTeam(a) : null)).filter(Boolean)
				: [],
			title: payload.title || '',
			summary: info.summary || '',
			keywords: info.keywords || [],
			image: content.image ? adaptMedia(content.image) : null,
			imageCdn: content.imageCdn ? adaptMediaArray(content.imageCdn) : [],
			descriptionRich: adaptRichText(content.descriptionRich),
			source: info.source || null,
			sourceUrl: info.sourceUrl || null,
			publication: isPopulated(relationships.publication)
				? adaptPayloadPublication(relationships.publication as PayloadTypes.Publication)
				: null,
			publicationReferenceTMG: isPopulated(relationships.publicationReferenceTMG)
				? adaptPayloadPublication(relationships.publicationReferenceTMG as PayloadTypes.Publication)
				: null,
			externalPublicationThumbnail: content.externalPublicationThumbnail
				? adaptMedia(content.externalPublicationThumbnail)
				: null,
			externalPublicationUrl: info.externalPublicationUrl || null,
			video: isPopulated(relationships.video)
				? adaptPayloadVideo(relationships.video as PayloadTypes.Video)
				: null,
			relatedNews: Array.isArray(relationships.relatedNews)
				? relationships.relatedNews.map((n: any) => (isPopulated(n) ? adaptPayloadNews(n) : null)).filter(Boolean)
				: [],
			relatedPublications: Array.isArray(relationships.relatedPublications)
				? relationships.relatedPublications
						.map((p: any) => (isPopulated(p) ? adaptPayloadPublication(p) : null))
						.filter(Boolean)
				: [],
			slug: payload.slug || ''
		}
	};
}

/**
 * Adapt Payload Publication to Contentful Publication
 */
export function adaptPayloadPublication(
	payload: PayloadTypes.Publication | string
): ContentfulTypes.Publication | null {
	if (!payload || typeof payload === 'string') return null;

	const info = get(payload, 'info', {});
	const content = get(payload, 'content', {});

	return {
		fields: {
			category: info.category || '',
			programme: isPopulated(info.programme)
				? adaptPayloadProgramme(info.programme as any)
				: null,
			project: isPopulated(info.project) ? adaptPayloadProject(info.project as PayloadTypes.Project) : null,
			title: payload.title || '',
			author: info.author || '',
			authorTmg: Array.isArray(info.authorTmg)
				? info.authorTmg.map((a: any) => (isPopulated(a) ? adaptPayloadTeam(a) : null)).filter(Boolean)
				: [],
			publicationDate: info.publicationDate || '',
			language: info.language || '',
			summary: info.summary || '',
			keywords: info.keywords || [],
			description: adaptRichText(content.description),
			automatedNewsEntry: info.automatedNewsEntry || '',
			thumbnail: content.thumbnail ? adaptMedia(content.thumbnail) : null,
			thumbnailCdn: content.thumbnailCdn ? adaptMediaArray(content.thumbnailCdn) : [],
			pdf: content.pdf
				? {
						fields: {
							file: {
								url: typeof content.pdf === 'string' ? '' : content.pdf.url || ''
							}
						}
					}
				: null,
			slug: payload.slug || '',
			doi: info.doi || false,
			doiNumber: info.doiNumber || 0,
			doiUrl: info.doiUrl || '',
			citation: info.citation || '',
			additionalButtonText: info.additionalButtonText || '',
			additionalButtonFile: content.additionalButtonFile
				? {
						fields: {
							file: {
								url:
									typeof content.additionalButtonFile === 'string'
										? ''
										: content.additionalButtonFile.url || ''
							}
						}
					}
				: null,
			additionalButton2Text: info.additionalButton2Text || '',
			additionalButton2Link: info.additionalButton2Link || ''
		}
	};
}

/**
 * Adapt Payload Post (Blog) to Contentful BlogPost
 */
export function adaptPayloadBlogPost(payload: PayloadTypes.Post | string): ContentfulTypes.BlogPost | null {
	if (!payload || typeof payload === 'string') return null;

	const info = get(payload, 'info', {});
	const content = get(payload, 'content', {});
	const relationships = get(payload, 'relationships', {});

	return {
		fields: {
			programme: isPopulated(info.programme)
				? adaptPayloadProgramme(info.programme as any)
				: null,
			secondProgramme: isPopulated(info.secondProgramme)
				? adaptPayloadProgramme(info.secondProgramme as any)
				: null,
			project: Array.isArray(info.project)
				? info.project.map((p: any) => (isPopulated(p) ? adaptPayloadProject(p) : null)).filter(Boolean)
				: [],
			dateFormat: (payload as any).publishedAt || '',
			author: info.author || '',
			authorTmg: Array.isArray(info.authorTmg)
				? info.authorTmg.map((a: any) => (isPopulated(a) ? adaptPayloadTeam(a) : null)).filter(Boolean)
				: [],
			title: payload.title || '',
			summary: info.summary || '',
			keywords: info.keywords || [],
			image: content.image ? adaptMedia(content.image) : null,
			imageCdn: content.imageCdn ? adaptMediaArray(content.imageCdn) : [],
			descriptionRich: adaptRichText(content.descriptionRich),
			source: info.source || null,
			sourceUrl: info.sourceUrl || null,
			relatedNews: Array.isArray(relationships.relatedNews)
				? relationships.relatedNews.map((n: any) => (isPopulated(n) ? adaptPayloadNews(n) : null)).filter(Boolean)
				: [],
			relatedPublications: Array.isArray(relationships.relatedPublications)
				? relationships.relatedPublications
						.map((p: any) => (isPopulated(p) ? adaptPayloadPublication(p) : null))
						.filter(Boolean)
				: [],
			video: isPopulated(relationships.video)
				? adaptPayloadVideo(relationships.video as PayloadTypes.Video)
				: null,
			slug: payload.slug || ''
		}
	};
}

/**
 * Adapt Payload Video to Contentful Video
 */
export function adaptPayloadVideo(payload: PayloadTypes.Video | string): ContentfulTypes.Video | null {
	if (!payload || typeof payload === 'string') return null;

	const info = get(payload, 'info', {});
	const content = get(payload, 'content', {});
	const relationships = get(payload, 'relationships', {});

	return {
		fields: {
			title: payload.title || '',
			date: info.date || '',
			description: adaptRichText(content.description),
			automatedNewsEntry: info.automatedNewsEntry || '',
			summary: info.summary || '',
			keywords: info.keywords || [],
			url: info.url || '',
			videoId: info.videoId || '',
			image: content.image ? adaptMedia(content.image) : null,
			imageCdn: content.imageCdn ? adaptMediaArray(content.imageCdn) : [],
			programmes: Array.isArray(relationships.programmes)
				? relationships.programmes.map((p: any) => (isPopulated(p) ? adaptPayloadProgramme(p) : null)).filter(Boolean)
				: [],
			projects: Array.isArray(relationships.projects)
				? relationships.projects.map((p: any) => (isPopulated(p) ? adaptPayloadProject(p) : null)).filter(Boolean)
				: [],
			eventSeries: [],
			slug: payload.slug || ''
		}
	};
}

/**
 * Adapt Payload Team to Contentful Team
 */
export function adaptPayloadTeam(payload: PayloadTypes.Team | string): ContentfulTypes.Team | null {
	if (!payload || typeof payload === 'string') return null;

	const info = get(payload, 'info', {});

	return {
		fields: {
			name: payload.name || '',
			position: info.position || '',
			picture: info.picture ? adaptMedia(info.picture) : null,
			pictureCdn: info.pictureCdn ? adaptMediaArray(info.pictureCdn) : [],
			bio: info.bio || '',
			linkedin: info.linkedin || '',
			twitter: info.twitter || '',
			email: info.email || '',
			slug: payload.slug || ''
		}
	};
}

/**
 * Adapt Payload Speaker to Contentful Speaker
 */
export function adaptPayloadSpeaker(payload: PayloadTypes.Speaker | string): ContentfulTypes.Speaker | null {
	if (!payload || typeof payload === 'string') return null;

	const info = get(payload, 'info', {});

	return {
		fields: {
			name: payload.name || '',
			position: info.position || '',
			organisation: info.organisation || '',
			organisationUrl: info.organisationUrl || '',
			bio: info.bio || '',
			picture: info.picture ? adaptMedia(info.picture) : null,
			pictureCdn: info.pictureCdn ? adaptMediaArray(info.pictureCdn) : [],
			twitter: info.twitter || '',
			email: info.email || '',
			slug: payload.slug || ''
		}
	};
}

// ============================================================================
// BATCH ADAPTERS (for arrays)
// ============================================================================

export function adaptPayloadProgrammes(items: any[]): ContentfulTypes.Programme[] {
	return items.map(adaptPayloadProgramme).filter(Boolean) as ContentfulTypes.Programme[];
}

export function adaptPayloadProjects(items: (PayloadTypes.Project | string)[]): ContentfulTypes.Project[] {
	return items.map(adaptPayloadProject).filter(Boolean) as ContentfulTypes.Project[];
}

export function adaptPayloadEvents(items: (PayloadTypes.Event | string)[]): ContentfulTypes.Event[] {
	return items.map(adaptPayloadEvent).filter(Boolean) as ContentfulTypes.Event[];
}

export function adaptPayloadNewsItems(items: (PayloadTypes.News | string)[]): ContentfulTypes.News[] {
	return items.map(adaptPayloadNews).filter(Boolean) as ContentfulTypes.News[];
}

export function adaptPayloadPublications(
	items: (PayloadTypes.Publication | string)[]
): ContentfulTypes.Publication[] {
	return items.map(adaptPayloadPublication).filter(Boolean) as ContentfulTypes.Publication[];
}

export function adaptPayloadBlogPosts(items: (PayloadTypes.Post | string)[]): ContentfulTypes.BlogPost[] {
	return items.map(adaptPayloadBlogPost).filter(Boolean) as ContentfulTypes.BlogPost[];
}

export function adaptPayloadVideos(items: (PayloadTypes.Video | string)[]): ContentfulTypes.Video[] {
	return items.map(adaptPayloadVideo).filter(Boolean) as ContentfulTypes.Video[];
}

export function adaptPayloadTeams(items: (PayloadTypes.Team | string)[]): ContentfulTypes.Team[] {
	return items.map(adaptPayloadTeam).filter(Boolean) as ContentfulTypes.Team[];
}

export function adaptPayloadSpeakers(items: (PayloadTypes.Speaker | string)[]): ContentfulTypes.Speaker[] {
	return items.map(adaptPayloadSpeaker).filter(Boolean) as ContentfulTypes.Speaker[];
}

