import { createClient } from 'contentful';

export function createContentfulClient(spaceId, accessToken) {
	return createClient({
		space: spaceId,
		accessToken: accessToken
	});
}

export async function fetchContentfulDataServer(client, contentType) {
	try {
		const response = await client.getEntries({
			content_type: contentType,
			limit: 1000,
			include: 10
		});
		return response.items;
	} catch (error) {
		console.error('Error fetching content from Contentful:', error);
		return [];
	}
}

// Previous approach
export async function fetchContentfulData(contentType) {
	try {
		const response = await client.getEntries({
			content_type: contentType,
			limit: 1000,
			include: 10
		});
		return response.items;
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

export async function getEntryBySlug(slug, contentType) {
	try {
		const entries = await fetchContentfulData(contentType);
		const entry = entries.find((p) => p.fields.slug === slug);

		if (entry) {
			return entry;
		} else {
			throw new Error('Entry not found');
		}
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}

export async function getEntryByDOINumber(slug) {
	try {
		const entries = await fetchContentfulData('publications');
		const entry = entries.find(
			(item) => item.fields.doiNumber && item.fields.doiNumber.toString() === slug
		);

		if (entry) {
			return entry;
		} else {
			throw new Error('Entry not found');
		}
	} catch (error) {
		console.error('Error fetching entry data:', error);
		throw error;
	}
}
