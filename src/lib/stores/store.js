import { writable } from 'svelte/store';

export const eventsData = writable([]);
export const newsData = writable([]);
export const publicationsData = writable([]);
export const videosData = writable([]);
export const calendarMonth = writable(new Date());
