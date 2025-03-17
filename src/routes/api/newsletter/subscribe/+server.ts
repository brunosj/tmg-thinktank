import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import * as brevo from '@getbrevo/brevo';
import { BREVO_API_KEY, BREVO_LIST_ID } from '$lib/server/env';

if (!BREVO_API_KEY) {
	console.error('BREVO_API_KEY environment variable is not set');
	throw new Error('BREVO_API_KEY environment variable is not set');
}

// Initialize the API client
let apiInstance = new brevo.ContactsApi();
// @ts-ignore
let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = BREVO_API_KEY;

export async function POST({ request }: RequestEvent) {
	console.log('📨 Newsletter subscription request received');
	console.log('API Key configured:', !!BREVO_API_KEY);
	console.log('List ID:', BREVO_LIST_ID);

	try {
		const body = await request.json();
		console.log('📧 Request body:', body);
		const { email } = body;
		console.log('📧 Processing subscription for:', { email });

		if (!email) {
			console.warn('⚠️ No email provided in request');
			return json({ message: 'Email is required' }, { status: 400 });
		}

		console.log('📝 Creating contact object');
		const createDoiContact = new brevo.CreateDoiContact();
		createDoiContact.email = email;
		createDoiContact.includeListIds = [BREVO_LIST_ID];
		createDoiContact.templateId = 2;
		createDoiContact.redirectionUrl = 'https://tmg-thinktank.com/newsletter-success';

		console.log('📝 Contact object created:', createDoiContact);

		console.log('📤 Sending request to Brevo API');
		const result = await apiInstance.createDoiContact(createDoiContact);
		console.log('✅ Contact successfully created/updated in Brevo. Result:', result);

		return json({ message: 'Successfully subscribed to newsletter', success: true });
	} catch (error: unknown) {
		console.error('🔥 Newsletter subscription error:', error);
		console.error('Error details:', {
			name: error instanceof Error ? error.name : 'Unknown',
			message: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined
		});

		// Handle specific Brevo API errors
		if (
			typeof error === 'object' &&
			error !== null &&
			'response' in error &&
			typeof error.response === 'object' &&
			error.response !== null &&
			'text' in error.response
		) {
			try {
				const apiError = JSON.parse(error.response.text as string);
				console.log('📦 Brevo API error details:', apiError);

				if (apiError.code === 'duplicate_parameter') {
					return json(
						{ message: 'This email is already subscribed', success: false },
						{ status: 400 }
					);
				}
			} catch {
				console.error('❌ Failed to parse Brevo API error response');
			}
		}

		return json(
			{ message: 'An error occurred while subscribing to the newsletter', success: false },
			{ status: 500 }
		);
	}
}
