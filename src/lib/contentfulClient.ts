import type { Publication, ContentfulEntry } from '$lib/types/types';

import { SECRET_CONTENTFUL_SPACE_ID, SECRET_CONTENTFUL_ACCESS_TOKEN } from '$env/static/private';
import { PUBLIC_CONTENTFUL_HOST } from '$env/static/public';

import * as contentful from 'contentful';
const client = contentful.createClient({
	accessToken: SECRET_CONTENTFUL_ACCESS_TOKEN,
	host: PUBLIC_CONTENTFUL_HOST,
	space: SECRET_CONTENTFUL_SPACE_ID
});

// Note: Cache-busting is now handled at the HTTP response level in route files

export async function fetchContentfulData<T>(contentType: string): Promise<T[]> {
	try {
		console.log(`Fetching ${contentType} from Contentful`);
		const response = await client.getEntries({
			content_type: contentType,
			limit: 1000,
			include: 2 // Reduced from 10 to minimize API usage
		});

		return response.items as T[];
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
	contentType: string
): Promise<T | null> {
	try {
		console.log(`Fetching ${contentType} entry with slug: ${slug}`);
		const response = await client.getEntries({
			content_type: contentType,
			'fields.slug': slug,
			limit: 1,
			include: 2
		});

		const entry = (response.items[0] as unknown as T) || null;

		if (!entry) {
			throw new Error('Entry not found');
		}

		return entry;
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}

export async function getEntryByDOINumber(doiNumber: string): Promise<Publication | null> {
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

			if (!entry) {
				throw new Error('Entry not found');
			}

			return entry;
		}

		const entry = (response.items[0] as unknown as Publication) || null;

		if (!entry) {
			throw new Error('Entry not found');
		}

		return entry;
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}
