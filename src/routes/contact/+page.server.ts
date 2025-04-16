export const prerender = false;

import { fail } from '@sveltejs/kit';
import { SECRET_BREVO_API_KEY } from '$env/static/private';
import { PUBLIC_BREVO_URL } from '$env/static/public';
import { checkRateLimit } from '$lib/server/ratelimit';

// Simple HTML sanitization function
function sanitizeHtml(input: string): string {
	return input
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

export const actions = {
	default: async ({ request, getClientAddress }) => {
		// Check rate limiting
		const clientIp = getClientAddress();
		const rateLimit = checkRateLimit(clientIp);

		if (!rateLimit.allowed) {
			return fail(429, {
				error: 'Too many requests, please try again later'
			});
		}

		const formData = await request.formData();
		const name = formData.get('name');
		const email = formData.get('email');
		const subject = formData.get('subject');
		const message = formData.get('message');
		const honeypot = formData.get('_gotcha');

		// Check honeypot field - if it's filled, it's likely a bot
		if (honeypot && honeypot.toString().length > 0) {
			// Silently indicate success to the bot, but don't actually send the email
			return {
				status: 200,
				body: {
					message: 'Email sent successfully'
				}
			};
		}

		if (!email) {
			return fail(400, { email, missing: true });
		}

		// Sanitize inputs
		const sanitizedName = name ? sanitizeHtml(name.toString()) : '';
		const sanitizedEmail = email ? sanitizeHtml(email.toString()) : '';
		const sanitizedSubject = subject ? sanitizeHtml(subject.toString()) : '';
		const sanitizedMessage = message ? sanitizeHtml(message.toString()) : '';

		const apiKey = SECRET_BREVO_API_KEY;
		const url = PUBLIC_BREVO_URL;

		const emailData = {
			sender: {
				name: sanitizedName,
				email: sanitizedEmail
			},
			to: [
				{
					email: 'web@tmg-thinktank.com',
					name: 'TMG'
				}
			],
			subject: sanitizedSubject,
			htmlContent: `<html><head></head><body><p>Hello,</p><p>${sanitizedMessage}</p></body></html>`
		};
		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					accept: 'application/json',
					'api-key': apiKey,
					'content-type': 'application/json'
				},
				body: JSON.stringify(emailData)
			});

			if (response.status === 200) {
				const responseData = await response.json();
				return {
					status: 200,
					body: {
						message: 'Email sent successfully',
						messageId: responseData.messageId
					}
				};
			} else {
				return { success: false, message: 'Email sending failed' };
			}
		} catch (error) {
			return fail(500, {
				error: 'Internal server error'
			});
		}
	}
};
