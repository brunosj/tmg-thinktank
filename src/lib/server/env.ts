import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

export const BREVO_API_KEY = privateEnv.SECRET_BREVO_API_KEY;
export const BREVO_LIST_ID = parseInt(publicEnv.PUBLIC_BREVO_LIST_ID || '19', 10);

// Payload CMS configuration
export const PAYLOAD_URL = privateEnv.SECRET_PAYLOAD_URL;
export const PAYLOAD_API_KEY = privateEnv.SECRET_PAYLOAD_API_KEY;
