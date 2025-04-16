import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import * as brevo from '@getbrevo/brevo';
import { BREVO_API_KEY, BREVO_LIST_ID } from '$lib/server/env';
import { checkRateLimit } from '$lib/server/ratelimit';

if (!BREVO_API_KEY) {
	console.error('BREVO_API_KEY environment variable is not set');
	throw new Error('BREVO_API_KEY environment variable is not set');
}

// Initialize the API client
let apiInstance = new brevo.ContactsApi();
// @ts-ignore
let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = BREVO_API_KEY;

export async function POST({ request, getClientAddress }: RequestEvent) {
	// Check rate limiting
	const clientIp = getClientAddress();
	const rateLimit = checkRateLimit(clientIp);

	if (!rateLimit.allowed) {
		return json(
			{ message: 'Too many requests, please try again later', success: false },
			{
				status: 429,
				headers: {
					'Retry-After': '60'
				}
			}
		);
	}

	try {
		const body = await request.json();
		const { email } = body;

		if (!email) {
			console.warn('No email provided in request');
			return json({ message: 'Email is required', success: false }, { status: 400 });
		}

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return json({ message: 'Invalid email format', success: false }, { status: 400 });
		}

		const createDoiContact = new brevo.CreateDoiContact();
		createDoiContact.email = email;
		createDoiContact.includeListIds = [BREVO_LIST_ID];
		createDoiContact.templateId = 2;
		createDoiContact.redirectionUrl = 'https://tmg-thinktank.com/newsletter-success';
		const result = await apiInstance.createDoiContact(createDoiContact);
		return json({ message: 'Successfully subscribed to newsletter', success: true });
	} catch (error: unknown) {
		console.error('Newsletter subscription error occurred');

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

				if (apiError.code === 'duplicate_parameter') {
					return json(
						{ message: 'This email is already subscribed', success: false },
						{ status: 400 }
					);
				}
			} catch {
				console.error('Failed to parse API error response');
			}
		}

		return json(
			{ message: 'An error occurred while subscribing to the newsletter', success: false },
			{ status: 500 }
		);
	}
}
