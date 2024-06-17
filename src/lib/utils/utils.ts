import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import type { CalendarEvent, Event, Publication, Video } from '$lib/types/types';

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

export function formatTz(date: string) {
	return dayjs(date).format('zzz');
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

// Contentful
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import * as contentfulTypes from '@contentful/rich-text-types';
const { BLOCKS, INLINES } = contentfulTypes;

export function renderRichText(richText) {
	const renderNode = {
		[BLOCKS.PARAGRAPH]: (node, next) => {
			return `<p>${next(node.content)}</p>`;
		},
		[BLOCKS.HEADING_1]: (node, next) => {
			return `<h1>${next(node.content)}</h1>`;
		},
		[BLOCKS.HEADING_2]: (node, next) => {
			return `<h2>${next(node.content)}</h2>`;
		},
		[BLOCKS.HEADING_3]: (node, next) => {
			return `<h3>${next(node.content)}</h3>`;
		},
		[BLOCKS.HEADING_4]: (node, next) => {
			return `<h4>${next(node.content)}</h4>`;
		},
		[BLOCKS.HEADING_5]: (node, next) => {
			return `<h5>${next(node.content)}</h5>`;
		},
		[BLOCKS.HEADING_6]: (node, next) => {
			return `<h6>${next(node.content)}</h6>`;
		},
		[BLOCKS.LIST_ITEM]: (node, next) => {
			return `<li>${next(node.content)}</li>`;
		},
		[BLOCKS.UL_LIST]: (node, next) => {
			return `<ul>${next(node.content)}</ul>`;
		},
		[BLOCKS.QUOTE]: (node, next) => {
			return `<blockquote>${next(node.content)}</blockquote>`;
		},
		[BLOCKS.EMBEDDED_ASSET]: (node) => {
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
		},

		[INLINES.HYPERLINK]: (node) => {
			const url = node.data.uri;
			const text = node.content[0].value;
			const isExternalLink = url.includes('http') || url.includes('https') || url.includes('www');
			const targetAttribute = isExternalLink ? 'target="_blank" rel="noopener noreferrer"' : '';
			return `<a href="${ensureHttps(url)}" ${targetAttribute}>${text}</a>`;
		}
	};

	return documentToHtmlString(richText, { renderNode });
}

//////  Util function to format strings
export function slugify(text: string) {
	return text
		.toLowerCase()
		.replace(/ /g, '-')
		.replace(/[^\w-]+/g, '');
}

//////  Util function to intersect and render transitions conditionally
export function observeIntersection(targetSelector, callback, threshold = 0.5, margin = '0px') {
	const options = {
		rootMargin: margin,
		threshold: threshold
	};

	const handleIntersection = (entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				callback();
			}
		});
	};

	const observer = new IntersectionObserver(handleIntersection, options);
	const target = document.querySelector(targetSelector);

	if (target) {
		observer.observe(target);
	}

	return () => {
		if (target) {
			observer.unobserve(target);
		}
	};
}

//////  Util function to process Markdown links
export function processMarkdownLinks(markdownRef) {
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

export function transformPublicationToNews(publication: Publication) {
	return {
		fields: {
			programme: publication.fields.programme,
			secondProgramme: null,
			project: [publication.fields.project],
			dateFormat: publication.fields.publicationDate,
			type: 'Publication', // or any default type
			author: publication.fields.author,
			authorTmg: publication.fields.authorTmg,
			title: publication.fields.title,
			summary: publication.fields.summary,
			image: publication.fields.thumbnail,
			imageCdn: publication.fields.thumbnailCdn,
			descriptionRich: publication.fields.automatedNewsEntry,
			source: null,
			sourceUrl: null,
			publication: publication,
			publicationReferenceTMG: publication,
			externalPublicationThumbnail: null,
			externalPublicationUrl: null,
			video: null,
			relatedNews: [],
			relatedPublications: [],
			slug: publication.fields.slug
		}
	};
}

export function transformVideoToNews(video: Video) {
	return {
		fields: {
			programme: video.fields.programmes ? video.fields.programmes[0] : null,
			secondProgramme: video.fields.programmes?.length > 1 ? video.fields.programmes[1] : null,
			project: video.fields.projects,
			dateFormat: video.fields.date,
			type: 'Video',
			author: null,
			authorTmg: [],
			title: video.fields.title,
			summary: video.fields.summary,
			image: video.fields.image,
			imageCdn: video.fields.imageCdn,
			descriptionRich: video.fields.automatedNewsEntry,
			source: null,
			sourceUrl: null,
			publication: null,
			publicationReferenceTMG: null,
			externalPublicationThumbnail: null,
			externalPublicationUrl: video.fields.url,
			video: {
				fields: {
					videoId: video.fields.videoId,
					url: video.fields.url,
					imageCdn: video.fields.imageCdn,
					image: video.fields.image,
					summary: video.fields.summary,
					title: video.fields.title
				}
			},
			relatedNews: [],
			relatedPublications: [],
			slug: video.fields.slug || slugify(video.fields.title)
		}
	};
}
