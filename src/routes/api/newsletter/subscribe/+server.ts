import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import * as brevo from '@getbrevo/brevo';
import { BREVO_API_KEY, BREVO_LIST_ID } from '$lib/server/env';
// import { checkRateLimit } from '$lib/server/ratelimit';

if (!BREVO_API_KEY) {
	console.error('BREVO_API_KEY environment variable is not set');
	throw new Error('BREVO_API_KEY environment variable is not set');
}

// Initialize the API client
let apiInstance = new brevo.ContactsApi();
// @ts-ignore
let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = BREVO_API_KEY;

// Simple debug logger that's safer for production
function debugLog(label: string, details: any) {
	try {
		// Filter out sensitive data
		const safeDetails = { ...details };
		if (safeDetails.apiKey) safeDetails.apiKey = '[FILTERED]';

		console.log(`DEBUG ${label}:`, safeDetails);
	} catch (err) {
		console.log(`DEBUG ${label} (stringifying failed)`);
	}
}

export async function POST({ request, getClientAddress }: RequestEvent) {
	debugLog('Newsletter subscription attempt', { clientIp: getClientAddress() });

	// Rate limiting disabled for testing
	// const clientIp = getClientAddress();
	// const rateLimit = checkRateLimit(clientIp);
	// if (!rateLimit.allowed) {
	// 	debugLog('Rate limit exceeded', { clientIp });
	// 	return json(
	// 		{ message: 'Too many requests, please try again later', success: false },
	// 		{
	// 			status: 429,
	// 			headers: {
	// 				'Retry-After': '60'
	// 			}
	// 		}
	// 	);
	// }

	try {
		const body = await request.json();
		const { email } = body;
		debugLog('Processing subscription', { emailProvided: !!email, email });

		if (!email) {
			console.warn('No email provided in request');
			return json({ message: 'Email is required', success: false }, { status: 400 });
		}

		// Email validation disabled for testing
		// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		// if (!emailRegex.test(email)) {
		// 	debugLog('Invalid email format', { email: email.substring(0, 3) + '...' });
		// 	return json({ message: 'Invalid email format', success: false }, { status: 400 });
		// }

		debugLog('Calling Brevo API', {
			listId: BREVO_LIST_ID,
			templateId: 2,
			apiKeyProvided: !!BREVO_API_KEY,
			emailDomain: email.split('@')[1],
			apiKey: BREVO_API_KEY.substring(0, 5) + '...'
		});

		try {
			const createDoiContact = new brevo.CreateDoiContact();
			createDoiContact.email = email;
			createDoiContact.includeListIds = [BREVO_LIST_ID];
			createDoiContact.templateId = 2;
			createDoiContact.redirectionUrl = 'https://tmg-thinktank.com/newsletter-success';

			debugLog('Brevo request data', { createDoiContact });

			const result = await apiInstance.createDoiContact(createDoiContact);
			debugLog('Brevo API success', { responseReceived: !!result });
			return json({ message: 'Successfully subscribed to newsletter', success: true });
		} catch (apiError) {
			debugLog('Direct API error', {
				error: apiError instanceof Error ? apiError.message : 'Unknown API error',
				stack: apiError instanceof Error ? apiError.stack?.substring(0, 200) : 'No stack'
			});
			throw apiError;
		}
	} catch (error: unknown) {
		console.error('Newsletter subscription error occurred');

		// Log error type
		debugLog('Error type', {
			type: typeof error,
			isError: error instanceof Error,
			name: error instanceof Error ? error.name : 'Unknown',
			message: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack?.substring(0, 200) : 'No stack'
		});

		// Add more HTTP error details
		if (error instanceof Error && 'response' in error) {
			const resp = (error as any).response;
			debugLog('HTTP Error Details', {
				status: resp?.status || 'unknown',
				statusText: resp?.statusText || 'unknown',
				responseText: resp?.text
					? typeof resp.text === 'string'
						? resp.text.substring(0, 100)
						: typeof resp.text
					: 'no response text'
			});
		}

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
				debugLog('Brevo API error', { code: apiError.code, message: apiError.message });

				if (apiError.code === 'duplicate_parameter') {
					return json(
						{ message: 'This email is already subscribed', success: false },
						{ status: 400 }
					);
				}

				// Return the actual error message from Brevo for better debugging
				return json(
					{
						message: `Subscription error: ${apiError.message || 'Unknown error'}`,
						success: false
					},
					{ status: 500 }
				);
			} catch (parseError) {
				console.error('Failed to parse API error response');
				debugLog('Error response parsing failed', {
					responseText:
						typeof error.response.text === 'string'
							? error.response.text.substring(0, 100) + '...'
							: typeof error.response.text
				});
			}
		}

		return json(
			{ message: 'An error occurred while subscribing to the newsletter', success: false },
			{ status: 500 }
		);
	}
}
