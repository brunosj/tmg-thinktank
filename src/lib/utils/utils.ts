import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import type { BlogPost, CalendarEvent, Event, Publication, Video } from '$lib/types/types';
// Import new Payload types
import type {
	Post,
	Publication as PayloadPublication,
	Video as PayloadVideo,
	Category as Programme
} from '$lib/types/payload-types';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

// Time
export function isSameDay(dateStr1: string, dateStr2: string): boolean {
	const date1 = dayjs(dateStr1).utc();
	const date2 = dayjs(dateStr2).utc();

	return date1.isSame(date2, 'day');
}

export function formatDateDayJS(dateStr: string): string {
	const date = dayjs(dateStr).utc();
	return date.format('DD.MM.YY');
}

export function formatLocalTimeWithTZ(startDateStr: string, endDateStr: string): string {
	const startTime = dayjs(startDateStr).format('HH:mm');
	const endTime = dayjs(endDateStr).format('HH:mm');
	return `${startTime} - ${endTime}`;
}

export function formatUTCTime(startDateStr: string, endDateStr: string): string {
	const utcStartTime = dayjs(startDateStr).utc().format('HH:mm');
	const utcEndTime = dayjs(endDateStr).utc().format('HH:mm');
	return `${utcStartTime} - ${utcEndTime}`;
}

// Mapping of timezone offsets to acronyms
const timezoneAcronyms: { [key: string]: string } = {
	'+00:00': 'UTC',
	'+01:00': 'CET', // Central European Time
	'+02:00': 'EET', // Eastern European Time
	'+03:00': 'MSK', // Moscow Standard Time
	'+04:00': 'GST', // Gulf Standard Time
	'+05:00': 'PKT', // Pakistan Standard Time
	'+06:00': 'BST', // Bangladesh Standard Time
	'+07:00': 'ICT', // Indochina Time
	'+08:00': 'SGT', // Singapore Time
	'+09:00': 'JST', // Japan Standard Time
	'+10:00': 'AEST', // Australian Eastern Standard Time
	'+11:00': 'AEDT', // Australian Eastern Daylight Time
	'+12:00': 'NZST', // New Zealand Standard Time
	'-01:00': 'AZOT', // Azores Standard Time
	'-02:00': 'GST', // South Georgia Time
	'-03:00': 'ART', // Argentina Time
	'-04:00': 'AST', // Atlantic Standard Time
	'-05:00': 'EST', // Eastern Standard Time
	'-06:00': 'CST', // Central Standard Time
	'-07:00': 'MST', // Mountain Standard Time
	'-08:00': 'PST', // Pacific Standard Time
	'-09:00': 'AKST', // Alaska Standard Time
	'-10:00': 'HST', // Hawaii-Aleutian Standard Time
	'-11:00': 'SST' // Samoa Standard Time
};

export function formatTz(date: string): string {
	const offset = dayjs(date).format('Z'); // Get the timezone offset
	return timezoneAcronyms[offset] || offset; // Return the acronym or the offset if not found
}

function isCalendarEvent(event: any): event is CalendarEvent {
	return 'start' in event && 'end' in event;
}

export function generateICalData(event: CalendarEvent | Event): string {
	const dtstart =
		new Date(isCalendarEvent(event) ? event.start : event.fields.date)
			.toISOString()
			.replace(/[-:]/g, '')
			.split('.')[0] + 'Z';
	const dtend =
		new Date(isCalendarEvent(event) ? event.end : event.fields.endDate)
			.toISOString()
			.replace(/[-:]/g, '')
			.split('.')[0] + 'Z';
	const title = isCalendarEvent(event) ? event.title : event.fields.title;
	const description = isCalendarEvent(event) ? event.subtitle : event.fields.summary;
	const location = isCalendarEvent(event)
		? `https://tmg-thinktank.com/events/${event.slug}`
		: `https://tmg-thinktank.com/events/${event.fields.slug}`;

	return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
DTSTART:${dtstart}
DTEND:${dtend}
END:VEVENT
END:VCALENDAR`;
}

export function downloadICal(evt: CalendarEvent | Event) {
	const icsData = generateICalData(evt);
	const blob = new Blob([icsData], { type: 'text/calendar' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `${isCalendarEvent(evt) ? evt.title : evt.fields.title}.ics`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

// Contentful rich text rendering (legacy - for existing Contentful data)
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import * as contentfulTypes from '@contentful/rich-text-types';
const { BLOCKS, INLINES } = contentfulTypes;

export function renderRichText(richText: any) {
	// Add null/undefined check to prevent errors
	if (!richText || !richText.content) {
		return '';
	}

	const renderNode = {
		[BLOCKS.PARAGRAPH]: (node: any, next: any) => {
			return `<p>${next(node.content)}</p>`;
		},
		[BLOCKS.HEADING_1]: (node: any, next: any) => {
			return `<h1>${next(node.content)}</h1>`;
		},
		[BLOCKS.HEADING_2]: (node: any, next: any) => {
			return `<h2>${next(node.content)}</h2>`;
		},
		[BLOCKS.HEADING_3]: (node: any, next: any) => {
			return `<h3>${next(node.content)}</h3>`;
		},
		[BLOCKS.HEADING_4]: (node: any, next: any) => {
			return `<h4>${next(node.content)}</h4>`;
		},
		[BLOCKS.HEADING_5]: (node: any, next: any) => {
			return `<h5>${next(node.content)}</h5>`;
		},
		[BLOCKS.HEADING_6]: (node: any, next: any) => {
			return `<h6>${next(node.content)}</h6>`;
		},
		[BLOCKS.LIST_ITEM]: (node: any, next: any) => {
			return `<li>${next(node.content)}</li>`;
		},
		[BLOCKS.UL_LIST]: (node: any, next: any) => {
			return `<ul>${next(node.content)}</ul>`;
		},
		[BLOCKS.QUOTE]: (node: any, next: any) => {
			return `<blockquote>${next(node.content)}</blockquote>`;
		},
		[BLOCKS.EMBEDDED_ASSET]: (node: any) => {
			if (!node.data?.target?.fields?.file?.contentType) {
				return '';
			}

			if (node.data.target.fields.file.contentType === 'application/pdf') {
				const title = node.data.target.fields.title;
				const fileUrl = node.data.target.fields.file.url;
				return `<a href="${fileUrl}" target="_blank">${title}</a>`;
			} else if (node.data.target.fields.file.contentType === 'image/jpeg') {
				const assetUrl = node.data.target.fields.file.url;
				const altText = node.data.target.fields.description;
				const imgCaption = altText ? altText : '';
				return `<img loading='lazy' src="${assetUrl}" alt="${altText}" /><h6 style="text-align:right; font-style:italic;" >${imgCaption}</h6>`;
			} else if (node.data.target.fields.file.contentType === 'image/png') {
				const assetUrl = node.data.target.fields.file.url;
				const altText = node.data.target.fields.description;
				const imgCaption = altText ? altText : '';
				return `<img loading='lazy' src="${assetUrl}" alt="${altText}" /><h6 style="text-align:right; font-style:italic;" >${imgCaption}</h6>`;
			}
			return '';
		},
		[INLINES.HYPERLINK]: (node: any) => {
			if (!node.data?.uri || !node.content?.[0]?.value) {
				return '';
			}

			const url = node.data.uri;
			const text = node.content[0].value;
			const isExternalLink = url.includes('http') || url.includes('https') || url.includes('www');
			const targetAttribute = isExternalLink ? 'target="_blank" rel="noopener noreferrer"' : '';
			return `<a href="${ensureHttps(url)}" ${targetAttribute}>${text}</a>`;
		}
	};

	try {
		return documentToHtmlString(richText, { renderNode });
	} catch (error) {
		console.error('Error rendering rich text:', error);
		return '';
	}
}

// Lexical rich text rendering (for Payload CMS)
export function renderLexicalRichText(lexicalData: any): string {
	if (!lexicalData || !lexicalData.root || !lexicalData.root.children) {
		return '';
	}

	function renderNode(node: any): string {
		if (!node) return '';

		switch (node.type) {
			case 'paragraph':
				const children = node.children?.map(renderNode).join('') || '';
				return `<p>${children}</p>`;

			case 'heading':
				const headingChildren = node.children?.map(renderNode).join('') || '';
				const level = node.tag || 'h2';
				return `<${level}>${headingChildren}</${level}>`;

			case 'list':
				const listChildren = node.children?.map(renderNode).join('') || '';
				const listTag = node.listType === 'number' ? 'ol' : 'ul';
				return `<${listTag}>${listChildren}</${listTag}>`;

			case 'listitem':
				const listItemChildren = node.children?.map(renderNode).join('') || '';
				return `<li>${listItemChildren}</li>`;

			case 'quote':
				const quoteChildren = node.children?.map(renderNode).join('') || '';
				return `<blockquote>${quoteChildren}</blockquote>`;

			case 'text':
				let text = node.text || '';
				if (node.format) {
					if (node.format & 1) text = `<strong>${text}</strong>`;
					if (node.format & 2) text = `<em>${text}</em>`;
					if (node.format & 4) text = `<u>${text}</u>`;
					if (node.format & 8) text = `<s>${text}</s>`;
				}
				return text;

			case 'link':
				const linkChildren = node.children?.map(renderNode).join('') || '';
				const url = node.url || '#';
				const isExternal = url.startsWith('http') || url.startsWith('https');
				const target = isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';
				return `<a href="${url}" ${target}>${linkChildren}</a>`;

			case 'linebreak':
				return '<br>';

			default:
				// For unknown node types, try to render children
				if (node.children) {
					return node.children.map(renderNode).join('');
				}
				return '';
		}
	}

	try {
		return lexicalData.root.children.map(renderNode).join('');
	} catch (error) {
		console.error('Error rendering Lexical rich text:', error);
		return '';
	}
}

export function slugify(text: string) {
	return text
		.toString()
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-')
		.replace(/[^\w\-]+/g, '')
		.replace(/\-\-+/g, '-');
}

export function observeIntersection(
	targetSelector: string,
	callback: () => void,
	threshold = 0.5,
	margin = '0px'
) {
	const target = document.querySelector(targetSelector);
	if (!target) return;

	const handleIntersection = (entries: IntersectionObserverEntry[]) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				callback();
			}
		});
	};

	const observer = new IntersectionObserver(handleIntersection, {
		threshold,
		rootMargin: margin
	});

	observer.observe(target);

	return () => {
		if (target) {
			observer.unobserve(target);
		}
	};
}

//////  Util function to process Markdown links
export function processMarkdownLinks(markdownRef: HTMLElement) {
	const links = markdownRef.querySelectorAll('a[href^="http://"],a[href^="https://"]');
	links.forEach((link) => {
		link.setAttribute('target', '_blank');
		link.setAttribute('rel', 'noopener noreferrer');
	});
}

export function formatYear(date: string) {
	return new Date(date).getFullYear().toString();
}

export function formatMonth(date: string) {
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	return months[new Date(date).getMonth()];
}

export function formatDay(date: string) {
	return ('0' + new Date(date).getDate()).slice(-2);
}

export function formatTime(date: string) {
	const hours = ('0' + new Date(date).getHours()).slice(-2);
	const minutes = ('0' + new Date(date).getMinutes()).slice(-2);
	return `${hours}:${minutes}`;
}

export function formatDate(date: string) {
	const day = formatDay(date);
	const month = formatMonth(date);
	const year = formatYear(date);
	return `${day}.${month}.${year}`;
}

export function formatDateNews(date: string) {
	const day = formatDay(date);
	const month = formatMonth(date).slice(0, 3);
	const year = formatYear(date);
	return `${month} ${day}, ${year}`;
}

export function ensureHttps(url: string) {
	if (!url.startsWith('http://') && !url.startsWith('https://')) {
		return 'https://' + url;
	}
	return url;
}

export function formatDateLong(date: string) {
	const formattedDate = new Date(date);
	const day = formattedDate.getDate();
	const month = formattedDate.toLocaleString('en', { month: 'long' });
	const year = formattedDate.getFullYear();
	return `${day} ${month} ${year}`;
}

// Updated transformation functions for Payload CMS data structure

export function transformPublicationToNews(publication: PayloadPublication) {
	return {
		fields: {
			programme: publication.info?.programme,
			secondProgramme: null,
			project: publication.info?.project ? [publication.info.project] : [],
			dateFormat: publication.info?.publicationDate,
			type: 'Publication',
			author: publication.info?.author,
			authorTmg: publication.info?.authorTmg || [],
			title: publication.title,
			summary: publication.info?.summary,
			image: publication.content?.thumbnail,
			imageCdn: publication.thumbnailFromCloudinary,
			descriptionRich: publication.automatedNewsEntry,
			source: null,
			sourceUrl: null,
			publication: publication,
			publicationReferenceTMG: publication,
			externalPublicationThumbnail: null,
			externalPublicationUrl: null,
			video: null,
			relatedNews: [],
			relatedPublications: [],
			slug: publication.slug
		}
	};
}

export function transformBlogPostToNews(blogPost: Post) {
	return {
		fields: {
			programme: blogPost.Info?.programme,
			secondProgramme: blogPost.Info?.secondProgramme,
			project: blogPost.Info?.project || [],
			dateFormat: blogPost.Info?.dateFormat,
			type: 'Blog Post',
			author: null,
			authorTmg:
				blogPost.authors?.filter((a) => a.authorType === 'team').map((a) => a.teamMember) || [],
			title: blogPost.title,
			summary: blogPost.Info?.summary,
			image: blogPost.heroImage,
			imageCdn: blogPost.imageFromCloudinary,
			descriptionRich: blogPost.content,
			source: blogPost.Info?.source,
			sourceUrl: blogPost.Info?.sourceUrl,
			relatedNews: blogPost.relatedNews || [],
			relatedPublications: blogPost.relatedPublications || [],
			slug: blogPost.slug
		}
	};
}

export function transformVideoToNews(video: PayloadVideo) {
	return {
		fields: {
			programme: video.programmes && video.programmes.length > 0 ? video.programmes[0] : null,
			secondProgramme: video.programmes && video.programmes.length > 1 ? video.programmes[1] : null,
			project: video.projects || [],
			dateFormat: video.date,
			type: 'Video',
			author: null,
			authorTmg: [],
			title: video.title,
			summary: video.summary,
			image: video.image,
			imageCdn: null,
			descriptionRich: video.automatedNewsEntry,
			source: null,
			sourceUrl: null,
			publication: null,
			publicationReferenceTMG: null,
			externalPublicationThumbnail: null,
			externalPublicationUrl: video.url,
			video: {
				fields: {
					videoId: video.videoId,
					url: video.url,
					imageCdn: null,
					image: video.image,
					summary: video.summary,
					title: video.title
				}
			},
			relatedNews: [],
			relatedPublications: [],
			slug: video.slug || slugify(video.title)
		}
	};
}

export function formatEventLocalTime(startDateStr: string, endDateStr: string): string {
	// Extract the time from the start date string
	const startTime = startDateStr.slice(11, 16); // Get HH:mm from "2024-12-06T11:00+03:00"

	// Extract the timezone from the start date string
	const startTz = startDateStr.slice(19); // Get the timezone from "+03:00"

	// Extract the time from the end date string
	const endTime = endDateStr.slice(11, 16); // Get HH:mm from "2024-12-06T13:00+03:00"

	// Extract the timezone from the end date string (assuming it's the same)
	const endTz = endDateStr.slice(16, 17) + endDateStr.slice(17, 19); // Get the timezone from "+03:00"

	const formattedEndTz = `${endTz.charAt(0)}${endTz.charAt(1) === '0' ? '' : endTz.charAt(1)}${endTz.slice(2)}`;

	// Format the timezone for display
	const formattedTz = `UTC${formattedEndTz}`; // Keep the colon for display

	return `${startTime} - ${endTime} (${formattedTz})`;
}

export function generateProgrammeLinks(programmes: Programme[]) {
	return programmes
		.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
		.map((programme) => ({
			title: programme.title,
			to: `/programmes/${programme.slug}`
		}));
}
