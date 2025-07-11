<script lang="ts">
	import type {
		GridTextImageBlock,
		Media,
		HeadingBlock,
		PictureBlock,
		TextBlock
	} from '$lib/types/payload-types';
	import RichText from '$lib/components/RichText.svelte';
	import Heading from '../atomic-blocks/Heading.svelte';
	import Picture from '../atomic-blocks/Picture.svelte';
	import { clsx } from 'clsx';

	interface GridTextImageProps {
		block: GridTextImageBlock;
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

	let { block, reportColors, className = '' }: GridTextImageProps = $props();

	// Access properties from the new nested structure
	const stickyImage = (block as any).parameters?.stickyImage || false;
	const invertColumns = (block as any).parameters?.invertColumns || false;
	const insideContainer = (block as any).parameters?.insideContainer !== false; // default true
	const styling = (block as any).styling || {};
	const content = (block as any).content || {};

	// Extract blocks from content
	const heading = content.heading || [];
	const text = content.text || [];
	const image = content.image || [];

	// Extract heading and picture blocks with proper type guards
	const headingBlock: HeadingBlock | undefined =
		Array.isArray(heading) && heading.length > 0 ? (heading[0] as HeadingBlock) : undefined;
	const pictureBlock: PictureBlock | undefined =
		Array.isArray(image) && image.length > 0 ? (image[0] as PictureBlock) : undefined;
	const textBlock: TextBlock | undefined =
		Array.isArray(text) && text.length > 0 ? (text[0] as TextBlock) : undefined;

	// Get heading position from the heading block
	const headingPosition = (headingBlock as any)?.parameters?.layoutPosition || 'topOfText';

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

	// Create CSS custom properties for dynamic styling
	const cssVars = $derived(() => {
		const vars: Record<string, string> = {};
		const backgroundColor = resolveColor(styling?.backgroundColor);
		const textColor = resolveColor(styling?.textColor);

		if (backgroundColor) vars['--bg-color'] = backgroundColor;
		if (textColor) vars['--text-color'] = textColor;
		return vars;
	});

	// Convert CSS vars object to style string
	const styleString = $derived(() => {
		return Object.entries(cssVars())
			.map(([key, value]) => `${key}: ${value}`)
			.join('; ');
	});

	// Section classes using clsx with Tailwind
	const sectionClasses = $derived(() => {
		return clsx(
			'grid-text-image-block w-full',
			// Mobile: auto height, Desktop: min-h-screen with flex centering
			'min-h-0 lg:min-h-screen',
			'flex items-center',
			'py-4 lg:py-0',
			className
		);
	});

	// Grid layout classes using clsx with Tailwind responsive design
	const gridClasses = $derived(() => {
		return clsx(
			// Mobile-first: single column, desktop: two columns
			'grid grid-cols-1 lg:grid-cols-2',
			'gap-4',
			'items-start w-full'
		);
	});

	// Image container classes using clsx with Tailwind
	const imageClasses = $derived(() => {
		return clsx(
			'image-container relative w-full',
			// Sticky positioning only on desktop
			stickyImage && 'lg:sticky lg:top-8',
			// Column order for inversion
			invertColumns && 'lg:order-2'
		);
	});

	// Text container classes using clsx with Tailwind
	const textClasses = $derived(() => {
		return clsx(
			'text-container relative w-full',
			// Use layout container only on desktop when insideContainer is true
			insideContainer && 'layout',
			// Column order for inversion (text goes to first position when inverted)
			invertColumns && 'lg:order-1'
		);
	});
</script>

<section class={sectionClasses()} style={styleString()}>
	<div class={gridClasses()}>
		<!-- Image Column -->
		<div class={imageClasses()}>
			<!-- Heading at top of image -->
			{#if headingBlock && headingPosition === 'topOfImage'}
				<div class="heading-above-image mb-4 lg:mb-6">
					<Heading block={headingBlock} {reportColors} />
				</div>
			{/if}

			<div class="image-content">
				{#if pictureBlock}
					<Picture block={pictureBlock} {reportColors} />
				{/if}
			</div>
		</div>

		<!-- Text Column -->
		<div class={textClasses()}>
			<!-- Heading at top of text -->
			{#if headingBlock && headingPosition === 'topOfText'}
				<div class="heading-above-text mb-4 lg:mb-6">
					<Heading block={headingBlock} {reportColors} />
				</div>
			{/if}

			<!-- Spacer when heading is on image to align text with image -->
			{#if headingBlock && headingPosition === 'topOfImage'}
				<div class="heading-spacer hidden lg:mb-3 lg:block" style="min-height: 4rem;"></div>
			{/if}

			{#if textBlock}
				<div class="text-content my-auto text-base leading-relaxed lg:text-lg">
					<RichText content={textBlock.content} />
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	/* CSS Variables for dynamic styling */
	.grid-text-image-block {
		background-color: var(--bg-color, transparent);
		color: var(--text-color, inherit);
	}

	/* Mobile responsive improvements */
	@media (max-width: 1023px) {
		.grid-text-image-block {
			min-height: auto;
		}

		.text-content {
			font-size: 0.9rem;
			line-height: 1.6;
		}
	}
</style>
