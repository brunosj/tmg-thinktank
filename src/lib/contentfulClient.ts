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
interface CacheEntry<T> {
	data: T;
	timestamp: number;
	ttl: number;
}

const cache = new Map<string, CacheEntry<any>>();
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const STATIC_TTL = 30 * 60 * 1000; // 30 minutes for static content

function getCacheKey(contentType: string, options?: any): string {
	return `${contentType}:${JSON.stringify(options || {})}`;
}

function isExpired<T>(entry: CacheEntry<T>): boolean {
	return Date.now() - entry.timestamp > entry.ttl;
}

function getFromCache<T>(key: string): T | null {
	const entry = cache.get(key);
	if (!entry || isExpired(entry)) {
		cache.delete(key);
		return null;
	}
	return entry.data;
}

function setCache<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
	cache.set(key, {
		data,
		timestamp: Date.now(),
		ttl
	});
}

export async function fetchContentfulData<T>(
	contentType: string,
	options: {
		limit?: number;
		include?: number;
		select?: string[];
		ttl?: number;
	} = {}
): Promise<T[]> {
	const { limit = 1000, include = 2, select, ttl = STATIC_TTL } = options;
	const cacheKey = getCacheKey(contentType, { limit, include, select });

	// Check cache first
	const cached = getFromCache<T[]>(cacheKey);
	if (cached) {
		console.log(`✅ Cache hit for ${contentType}`);
		return cached;
	}

	try {
		console.log(`🌐 Fetching ${contentType} from Contentful (cache miss)`);
		const queryOptions: any = {
			content_type: contentType,
			limit,
			include
		};

		// Add field selection if specified
		if (select && select.length > 0) {
			queryOptions.select = select.join(',');
		}

		const response = await client.getEntries(queryOptions);
		const data = response.items as T[];

		// Cache the result
		setCache(cacheKey, data, ttl);

		return data;
	} catch (error) {
		console.error('Error fetching content from Contentful:', error);
		return [];
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
	contentType: string,
	options: {
		include?: number;
		select?: string[];
		ttl?: number;
	} = {}
): Promise<T | null> {
	const { include = 2, select, ttl = DEFAULT_TTL } = options;
	const cacheKey = getCacheKey(`${contentType}:slug:${slug}`, { include, select });

	// Check cache first
	const cached = getFromCache<T>(cacheKey);
	if (cached) {
		console.log(`✅ Cache hit for ${contentType} slug: ${slug}`);
		return cached;
	}

	try {
		console.log(`🌐 Fetching ${contentType} entry with slug: ${slug} (cache miss)`);
		const queryOptions: any = {
			content_type: contentType,
			'fields.slug': slug,
			limit: 1,
			include
		};

		// Add field selection if specified
		if (select && select.length > 0) {
			queryOptions.select = select.join(',');
		}

		const response = await client.getEntries(queryOptions);
		const entry = (response.items[0] as unknown as T) || null;

		if (!entry) {
			throw new Error('Entry not found');
		}

		// Cache the result
		setCache(cacheKey, entry, ttl);

		return entry;
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}

export async function getEntryByDOINumber(doiNumber: string): Promise<Publication | null> {
	const cacheKey = getCacheKey(`publications:doi:${doiNumber}`);

	// Check cache first
	const cached = getFromCache<Publication>(cacheKey);
	if (cached) {
		console.log(`✅ Cache hit for DOI: ${doiNumber}`);
		return cached;
	}

	try {
		console.log(`🌐 Fetching publication with DOI: ${doiNumber} (cache miss)`);
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

			if (!entry) {
				throw new Error('Entry not found');
			}

			// Cache the result
			setCache(cacheKey, entry, DEFAULT_TTL);
			return entry;
		}

		const entry = (response.items[0] as unknown as Publication) || null;

		if (!entry) {
			throw new Error('Entry not found');
		}

		// Cache the result
		setCache(cacheKey, entry, DEFAULT_TTL);
		return entry;
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}

// Cache management utilities
export function clearCache(): void {
	cache.clear();
	console.log('🗑️ Contentful cache cleared');
}

export function getCacheStats(): { size: number; keys: string[] } {
	return {
		size: cache.size,
		keys: Array.from(cache.keys())
	};
}

export function clearExpiredCache(): number {
	let cleared = 0;
	for (const [key, entry] of cache.entries()) {
		if (isExpired(entry)) {
			cache.delete(key);
			cleared++;
		}
	}
	console.log(`🧹 Cleared ${cleared} expired cache entries`);
	return cleared;
}

// Auto-cleanup expired cache entries every 10 minutes
setInterval(
	() => {
		clearExpiredCache();
	},
	10 * 60 * 1000
);
