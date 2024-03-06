import { format } from 'date-fns';
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
		[BLOCKS.EMBEDDED_ASSET]: (node) => {
			if (node.data.target.fields.file.contentType === 'application/pdf') {
				// Assuming title and fileUrl are properties of node.data.target.fields
				const title = node.data.target.fields.title;
				const fileUrl = node.data.target.fields.file.url;

				// Generate HTML string
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

export function formatYear(date) {
	return format(new Date(date), 'yyyy');
}

export function formatMonth(date) {
	return format(new Date(date), 'MMMM');
}

export function formatDay(date) {
	return format(new Date(date), 'dd');
}

export function formatTime(date) {
	return format(new Date(date), 'HH:mm');
}

export function formatDate(date) {
	return format(new Date(date), 'dd.MM.yyyy');
}

export function formatDateNews(date) {
	return format(new Date(date), 'MMM d, yyyy');
}
//////  Util function to ensure external links do not use client navigation

export function ensureHttps(url) {
	if (!url.startsWith('http://') && !url.startsWith('https://')) {
		return 'https://' + url;
	}
	return url;
}
