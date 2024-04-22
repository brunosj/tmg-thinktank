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
export function slugify(text) {
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
