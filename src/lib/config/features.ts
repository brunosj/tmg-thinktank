// Payload CMS - No Contentful fallback
import { env } from '$env/dynamic/private';

export const USE_PAYLOAD = true; // Always use Payload
export const PAYLOAD_URL = env.SECRET_PAYLOAD_URL || 'http://localhost:3000';
export const DEBUG_CMS = true; // Temporarily enable for debugging

// Log once on startup
console.log('🔧 CMS: Payload only');
console.log(`   URL: ${PAYLOAD_URL}`);
