import type { Publication, ContentfulEntry } from '$lib/types/types';

import { SECRET_CONTENTFUL_SPACE_ID, SECRET_CONTENTFUL_ACCESS_TOKEN } from '$env/static/private';
import { PUBLIC_CONTENTFUL_HOST } from '$env/static/public';

import * as contentful from 'contentful';
const client = contentful.createClient({
	accessToken: SECRET_CONTENTFUL_ACCESS_TOKEN,
	host: PUBLIC_CONTENTFUL_HOST,
	space: SECRET_CONTENTFUL_SPACE_ID
});

// In-memory cache with TTL
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchContentfulData<T>(contentType: string): Promise<T[]> {
	const cacheKey = contentType;
	const cached = cache.get(cacheKey);

	// Return cached data if still valid
	if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
		console.log(`Cache hit for ${contentType}`);
		return cached.data;
	}

	try {
		console.log(`Fetching ${contentType} from Contentful`);
		const response = await client.getEntries({
			content_type: contentType,
			limit: 1000,
			include: 2 // Reduced from 10 to minimize API usage
		});

		const data = response.items as T[];
		cache.set(cacheKey, { data, timestamp: Date.now() });
		return data;
	} catch (error) {
		console.error('Error fetching content from Contentful:', error);
		// Return cached data if available, even if expired
		return cached?.data || [];
	}
}

export async function listContentTypes() {
	try {
		const response = await client.getContentTypes();
		console.log('Content Types:');
		response.items.forEach((contentType) => {
			console.log(`- ${contentType.name} (ID: ${contentType.sys.id})`);
		});
	} catch (error) {
		console.error('Error listing content types:', error);
	}
}

// listContentTypes();

export async function getEntryBySlug<T extends ContentfulEntry>(
	slug: string,
	contentType: string
): Promise<T | null> {
	const cacheKey = `${contentType}-${slug}`;
	const cached = cache.get(cacheKey);

	// Return cached data if still valid
	if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
		console.log(`Cache hit for ${cacheKey}`);
		return cached.data;
	}

	try {
		console.log(`Fetching ${contentType} entry with slug: ${slug}`);
		const response = await client.getEntries({
			content_type: contentType,
			'fields.slug': slug,
			limit: 1,
			include: 2
		});

		const entry = (response.items[0] as T) || null;
		cache.set(cacheKey, { data: entry, timestamp: Date.now() });

		if (!entry) {
			throw new Error('Entry not found');
		}

		return entry;
	} catch (error) {
		console.error('Error fetching entry data:', error);
		// Return cached data if available, even if expired
		const cachedEntry = cached?.data;
		if (cachedEntry) {
			return cachedEntry;
		}
		throw error;
	}
}

export async function getEntryByDOINumber(doiNumber: string): Promise<Publication | null> {
	const cacheKey = `publications-doi-${doiNumber}`;
	const cached = cache.get(cacheKey);

	// Return cached data if still valid
	if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
		console.log(`Cache hit for ${cacheKey}`);
		return cached.data;
	}

	try {
		console.log(`Fetching publication with DOI: ${doiNumber}`);
		// First try to parse as number for the DOI field
		const doiAsNumber = parseInt(doiNumber, 10);
		let response;

		if (!isNaN(doiAsNumber)) {
			// If it's a valid number, query the doiNumber field
			response = await client.getEntries({
				content_type: 'publications',
				'fields.doiNumber': doiAsNumber,
				limit: 1,
				include: 2
			});
		} else {
			// If it's not a number, fall back to fetching all and filtering
			// This handles edge cases where DOI might be stored differently
			const allPublications = await fetchContentfulData<Publication>('publications');
			const entry = allPublications.find(
				(item) => item.fields.doiNumber && item.fields.doiNumber.toString() === doiNumber
			);

			cache.set(cacheKey, { data: entry || null, timestamp: Date.now() });

			if (!entry) {
				throw new Error('Entry not found');
			}

			return entry;
		}

		const entry = (response.items[0] as Publication) || null;
		cache.set(cacheKey, { data: entry, timestamp: Date.now() });

		if (!entry) {
			throw new Error('Entry not found');
		}

		return entry;
	} catch (error) {
		console.error('Error fetching entry data:', error);
		// Return cached data if available, even if expired
		const cachedEntry = cached?.data;
		if (cachedEntry) {
			return cachedEntry;
		}
		throw error;
	}
}
