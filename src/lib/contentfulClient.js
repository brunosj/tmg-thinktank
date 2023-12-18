import { SECRET_CONTENTFUL_SPACE_ID, SECRET_CONTENTFUL_ACCESS_TOKEN } from '$env/static/private';
import { PUBLIC_CONTENTFUL_HOST } from '$env/static/public';
import { createClient } from 'contentful';

const client = () => {
	return createClient({
		accessToken: SECRET_CONTENTFUL_ACCESS_TOKEN,
		host: PUBLIC_CONTENTFUL_HOST,
		space: SECRET_CONTENTFUL_SPACE_ID
	});
};

export async function fetchContentfulData(contentType) {
	try {
		const response = await client().getEntries({
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
		const response = await client().getContentTypes();
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
