<script lang="ts">
	import { getTextColor } from '$lib/utils/getTextColor';
	import { getTextColorForWhiteBackground } from '$lib/utils/getTextColor';

	interface Props {
		link?: any; // Payload link object
		href?: string; // Direct href if not using payload link
		appearance?: 'text' | 'filled' | 'outline';
		size?: 'small' | 'medium' | 'large';
		disabled?: boolean;
		className?: string;
		ariaLabel?: string;
		// Color customization props
		backgroundColor?: string;
	}

	let {
		link = null,
		href = '',
		appearance = 'filled',
		size = 'medium',
		disabled = false,
		className = '',
		ariaLabel = '',
		backgroundColor = ''
	}: Props = $props();

	// Get URL from payload link or direct href
	function getLinkUrl(linkObj: any): string {
		if (!linkObj) return href;

		if (linkObj.type === 'reference' && linkObj.reference) {
			if (typeof linkObj.reference === 'string') return `/${linkObj.reference}`;
			return linkObj.reference.slug ? `/${linkObj.reference.slug}` : '/';
		}
		return linkObj.url || href || '#';
	}

	// Get link label
	function getLinkLabel(linkObj: any): string {
		return linkObj?.label || '';
	}

	// Check if link should open in new tab
	function shouldOpenNewTab(linkObj: any): boolean {
		return linkObj?.newTab === true;
	}

	// Check if this is an external link
	function isExternalLink(url: string): boolean {
		return url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('tel:');
	}

	let finalUrl = $derived(getLinkUrl(link));
	let isExternal = $derived(isExternalLink(finalUrl));
	let openNewTab = $derived(shouldOpenNewTab(link) || isExternal);
	let label = $derived(link ? getLinkLabel(link) : '');

	// Base button classes
	let baseClasses = $derived(
		`inline-flex items-center justify-center gap-2 font-medium no-underline rounded-lg transition-all duration-300 cursor-pointer border-2 font-inherit leading-tight whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`
	);

	// Size classes
	let sizeClasses = $derived({
		small: 'px-4 py-2 text-sm uppercase',
		medium: 'px-6 py-3 text-base uppercase',
		large: 'px-8 py-4 text-lg uppercase'
	});

	// Appearance classes
	let appearanceClasses = $derived({
		filled: 'bg-tmg-blue text-white border-tmg-blue hover:bg-tmg-blue/80 hover:border-tmg-blue/80',
		outline: 'bg-transparent text-tmg-blue border-tmg-blue hover:bg-tmg-blue hover:text-white',
		text: 'bg-transparent text-tmg-blue border-transparent px-0 hover:bg-tmg-blue/10 hover:text-tmg-blue'
	});

	// Color variant classes - these can be added via className prop
	let colorVariants = $derived({
		success: {
			filled: 'bg-green-600 text-white border-green-600 hover:bg-green-700 hover:border-green-700',
			outline: 'bg-transparent text-green-600 border-green-600 hover:bg-green-600 hover:text-white',
			text: 'bg-transparent text-green-600 border-transparent hover:bg-green-50 hover:text-green-700'
		},
		warning: {
			filled:
				'bg-orange-600 text-white border-orange-600 hover:bg-orange-700 hover:border-orange-700',
			outline:
				'bg-transparent text-orange-600 border-orange-600 hover:bg-orange-600 hover:text-white',
			text: 'bg-transparent text-orange-600 border-transparent hover:bg-orange-50 hover:text-orange-700'
		},
		danger: {
			filled: 'bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700',
			outline: 'bg-transparent text-red-600 border-red-600 hover:bg-red-600 hover:text-white',
			text: 'bg-transparent text-red-600 border-transparent hover:bg-red-50 hover:text-red-700'
		}
	});

	// Check if className contains color variants
	let isSuccess = $derived(className.includes('success'));
	let isWarning = $derived(className.includes('warning'));
	let isDanger = $derived(className.includes('danger'));

	// Derive text color from background color
	// Simple approach: use inline styles for custom colors, classes for defaults
	let hasCustomColors = $derived(backgroundColor);
	let textColor = $derived(hasCustomColors && getTextColor(backgroundColor));

	// Use default appearance classes when no custom colors
	let defaultAppearanceClasses = $derived(
		isSuccess
			? colorVariants.success[appearance]
			: isWarning
				? colorVariants.warning[appearance]
				: isDanger
					? colorVariants.danger[appearance]
					: appearanceClasses[appearance]
	);

	// Base classes without colors when using custom colors
	let baseClassesOnly = $derived(
		`hover:opacity-80 inline-flex items-center justify-center gap-2 font-medium no-underline rounded-lg transition-all duration-300 cursor-pointer border-2 font-inherit leading-tight whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`
	);

	// Combined classes
	let buttonClasses = $derived(
		hasCustomColors
			? `${baseClassesOnly} ${sizeClasses[size]} ${className}`
			: `${baseClasses} ${sizeClasses[size]} ${defaultAppearanceClasses} ${className}`
	);

	let buttonBorderColor = $derived(hasCustomColors ? backgroundColor : 'transparent');

	// Inline styles for custom colors
	let buttonStyles = $derived(() => {
		if (!hasCustomColors) return '';

		const styles = [];
		if (backgroundColor) styles.push(`background-color: ${backgroundColor}`);
		if (textColor) styles.push(`color: ${textColor}`);
		if (buttonBorderColor) styles.push(`border-color: ${buttonBorderColor}`);

		return styles.join('; ');
	});

	// Responsive adjustments for mobile
	let mobileClasses = $derived(
		size === 'large'
			? 'md:px-8 md:py-4 md:text-lg px-7 py-3.5 text-base'
			: size === 'medium'
				? 'md:px-6 md:py-3 md:text-base px-5 py-2.5 text-sm'
				: 'md:px-4 md:py-2 md:text-sm px-3.5 py-2 text-xs'
	);
</script>

{#if finalUrl && finalUrl !== '#'}
	<a
		href={finalUrl}
		class="{buttonClasses} {mobileClasses}"
		style={buttonStyles()}
		target={openNewTab ? '_blank' : undefined}
		rel={openNewTab ? 'noopener noreferrer' : undefined}
		aria-label={ariaLabel || label}
		tabindex={disabled ? -1 : 0}
	>
		<slot>{label}</slot>
		{#if isExternal && openNewTab}
			<svg class="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
				<path
					fill-rule="evenodd"
					d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
					clip-rule="evenodd"
				/>
				<path
					fill-rule="evenodd"
					d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
					clip-rule="evenodd"
				/>
			</svg>
		{/if}
	</a>
{:else}
	<button
		class="{buttonClasses} {mobileClasses}"
		style={buttonStyles()}
		{disabled}
		aria-label={ariaLabel}
	>
		<slot>{label}</slot>
	</button>
{/if}
