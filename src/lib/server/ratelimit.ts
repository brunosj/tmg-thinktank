/**
 * Simple in-memory rate limiter to protect API endpoints
 */

type RateLimitRecord = {
	count: number;
	resetAt: number;
};

const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 5; // 5 requests per minute

// In-memory store for rate limiting
const ipRequests = new Map<string, RateLimitRecord>();

// Clean up old records periodically
setInterval(() => {
	const now = Date.now();
	for (const [ip, record] of ipRequests.entries()) {
		if (now > record.resetAt) {
			ipRequests.delete(ip);
		}
	}
}, 60 * 1000); // Clean every minute

export function checkRateLimit(ip: string): { allowed: boolean; remainingRequests: number } {
	const now = Date.now();
	const record = ipRequests.get(ip);

	// If no record exists or the window has expired, create a new record
	if (!record || now > record.resetAt) {
		ipRequests.set(ip, {
			count: 1,
			resetAt: now + WINDOW_MS
		});
		return { allowed: true, remainingRequests: MAX_REQUESTS_PER_WINDOW - 1 };
	}

	// Check if we're over the limit
	if (record.count >= MAX_REQUESTS_PER_WINDOW) {
		return { allowed: false, remainingRequests: 0 };
	}

	// Increment the counter
	record.count += 1;
	const remainingRequests = MAX_REQUESTS_PER_WINDOW - record.count;

	return { allowed: true, remainingRequests };
}
