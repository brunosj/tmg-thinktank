<script lang="ts">
	import type { Media, PictureBlock } from '$lib/types/payload-types';
	import { clsx } from 'clsx';

	interface PictureProps {
		block: PictureBlock;
		reportColors?: {
			primary?: string | null;
			primaryLight?: string | null;
			secondary?: string | null;
			secondaryLight?: string | null;
			tertiary?: string | null;
			tertiaryLight?: string | null;
		};
		className?: string;
	}

	let { block, reportColors, className = '' }: PictureProps = $props();

	const {
		image,
		width,
		insideContainer,
		position, // Now directly available instead of positioning.position
		showCaption,
		showOverlay,
		captionSettings,
		overlaySettings
	} = block;

	// Helper to resolve color values
	function resolveColor(colorValue: string | null | undefined): string | undefined {
		if (!colorValue) return undefined;

		// If it's a direct hex color or transparent, use it
		if (colorValue.startsWith('#') || colorValue === 'transparent') {
			return colorValue;
		}

		// Map to report colors
		switch (colorValue) {
			case 'primary':
				return reportColors?.primary || undefined;
			case 'primaryLight':
				return reportColors?.primaryLight || undefined;
			case 'secondary':
				return reportColors?.secondary || undefined;
			case 'secondaryLight':
				return reportColors?.secondaryLight || undefined;
			case 'tertiary':
				return reportColors?.tertiary || undefined;
			case 'tertiaryLight':
				return reportColors?.tertiaryLight || undefined;
			default:
				return colorValue;
		}
	}

	// Helper to get image URL
	function getImageUrl(img: string | Media): string {
		if (typeof img === 'string') return img;
		return img.url || img.thumbnailURL || '';
	}

	// Helper to get image alt text
	function getImageAlt(img: string | Media): string {
		if (typeof img === 'object' && img.alt) return img.alt;
		return '';
	}

	// Picture wrapper classes using clsx
	const wrapperClasses = $derived(() => {
		return clsx('picture-wrapper', insideContainer && 'layout');
	});

	// Picture block classes using clsx
	const pictureBlockClasses = $derived(() => {
		return clsx(
			'picture-block block w-full',
			// Width classes - full width on mobile, constrained on desktop
			width === 'half' && 'md:w-1/2',
			width === 'two-thirds' && 'md:w-2/3',
			width === 'full' && 'w-full',
			// Position classes (only for non-full width on desktop)
			width !== 'full' && position === 'left' && 'md:ml-0 md:mr-auto',
			width !== 'full' && position === 'center' && 'md:mx-auto',
			width !== 'full' && position === 'right' && 'md:ml-auto md:mr-0',
			width !== 'full' && !position && 'md:mx-auto', // default center
			className
		);
	});

	// Caption classes using clsx with Tailwind positioning
	const captionClasses = $derived(() => {
		const position = (captionSettings?.captionPosition as string) || 'bottom-center';

		return clsx(
			'absolute text-xs md:text-sm px-2 md:px-4 py-1',
			// Background for better readability using Tailwind
			'bg-black/40 text-white ',

			// Top positions using Tailwind spacing
			position === 'top-left' && 'top-1  left-1 md:left-2 text-left',
			position === 'top-center' && 'top-1  left-1/2 -translate-x-1/2 text-center',
			position === 'top-right' && 'top-1  right-1 md:right-2 text-right',

			// Bottom positions using Tailwind spacing
			position === 'bottom-left' && 'bottom-1  left-1 md:left-2 text-left',
			position === 'bottom-center' && 'bottom-1  left-1/2 -translate-x-1/2 text-center',
			position === 'bottom-right' && 'bottom-1  right-1 md:right-2 text-right',

			// Legacy support for old values
			position === 'left' && 'bottom-1  left-1 md:left-2 text-left',
			position === 'center' && 'bottom-1  left-1/2 -translate-x-1/2 text-center',
			position === 'right' && 'bottom-1  right-1 md:right-2 text-right'
		);
	});

	// Overlay styles
	const overlayStyles = $derived(() => {
		if (!showOverlay || !overlaySettings) return '';

		const overlayColor = resolveColor(overlaySettings.overlayColor);
		const opacity = overlaySettings.overlayOpacity || 50;

		if (!overlayColor) return '';

		// Convert hex to rgb for opacity
		const hex = overlayColor.replace('#', '');
		const r = parseInt(hex.substr(0, 2), 16);
		const g = parseInt(hex.substr(2, 2), 16);
		const b = parseInt(hex.substr(4, 2), 16);

		return `background-color: rgba(${r}, ${g}, ${b}, ${opacity / 100});`;
	});
</script>

<div class={wrapperClasses()}>
	<div class={pictureBlockClasses()}>
		<div class="relative">
			<img
				src={getImageUrl(image)}
				alt={getImageAlt(image)}
				class="block h-auto w-full object-cover"
				loading="lazy"
			/>
			{#if showOverlay && overlayStyles()}
				<div class="absolute inset-0" style={overlayStyles()}></div>
			{/if}
			{#if showCaption && getImageAlt(image)}
				<div class={captionClasses()}>
					{getImageAlt(image)}
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- No custom styles needed - using Tailwind classes -->
