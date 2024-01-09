export const prerender = false;

import { fail } from '@sveltejs/kit';
import { SECRET_BREVO_API_KEY } from '$env/static/private';
import { PUBLIC_BREVO_URL } from '$env/static/public';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name');
		const email = formData.get('email');
		const subject = formData.get('subject');
		const message = formData.get('message');

		if (!email) {
			return fail(400, { email, missing: true });
		}

		const apiKey = SECRET_BREVO_API_KEY;
		const url = PUBLIC_BREVO_URL;

		const emailData = {
			sender: {
				name: name,
				email: email
			},
			to: [
				{
					email: 'info@tmg-thinktank.com',
					name: 'TMG'
				}
			],
			subject: subject,
			htmlContent: `<html><head></head><body><p>Hello,</p>${message}</body></html>`
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
				return {
					status: 200,
					body: {
						message: 'Email sent successfully',
						messageId: info.messageId
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
