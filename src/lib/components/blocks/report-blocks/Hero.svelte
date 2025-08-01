<script lang="ts">
	import type { Media, HeroBlock } from '$lib/types/payload-types';
	import Heading from '../atomic-blocks/Heading.svelte';
	import Picture from '../atomic-blocks/Picture.svelte';
	import { clsx } from 'clsx';

	interface HeroProps {
		block: HeroBlock;
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

	let { block, reportColors, className = '' }: HeroProps = $props();

	const { content, metadata, authors, styling } = block;

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

	// Extract background image from content layout
	const backgroundImage = $derived(() => {
		if (!content?.layout) return null;
		const pictureBlock = content.layout.find((item) => item.blockType === 'picture');
		return pictureBlock?.image;
	});

	// Get heading blocks from content layout
	const headingBlocks = $derived(() => {
		if (!content?.layout) return [];
		return content.layout.filter((item) => item.blockType === 'heading');
	});

	// Get background image data for img element
	const backgroundImageData = $derived(() => {
		const img = backgroundImage();
		if (!img) return null;

		if (typeof img === 'string') {
			return { url: img, alt: 'Hero background' };
		}

		return {
			url: img.url,
			alt: img.alt || 'Hero background',
			width: img.width,
			height: img.height
		};
	});

	// Hero section classes using clsx
	const heroClasses = $derived(() => {
		return clsx(
			'hero-block relative min-h-screen flex items-center w-full overflow-hidden',
			// Fallback gradient when no background image
			!backgroundImage() && 'bg-gradient-to-br from-indigo-500 to-purple-600',
			className
		);
	});

	// Background image classes using clsx
	const backgroundImageClasses = $derived(() => {
		return clsx('absolute inset-0 w-full h-full object-cover');
	});

	// Hero overlay classes using clsx
	const overlayClasses = $derived(() => {
		return clsx(
			'absolute inset-0 flex items-center justify-center',
			// Lighter overlay when there's a background image, darker when there isn't
			backgroundImage() ? 'bg-black bg-opacity-30' : 'bg-black bg-opacity-50'
		);
	});

	// Metadata classes using clsx
	const metadataClasses = $derived(() => {
		return clsx('flex gap-4 md:gap-2 justify-center flex-wrap');
	});

	// Tag classes using clsx
	const tagClasses = $derived(() => {
		return clsx(
			'bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30',
			'px-4 py-2 md:px-3 md:py-1.5 rounded-full',
			'text-sm md:text-xs font-medium uppercase tracking-wide'
		);
	});

	// Authors section classes using clsx
	const authorsClasses = $derived(() => {
		return clsx('mt-8');
	});

	// Authors list classes using clsx
	const authorsListClasses = $derived(() => {
		return clsx('flex flex-wrap gap-6 md:gap-4 justify-center');
	});

	// Author item classes using clsx
	const authorItemClasses = $derived(() => {
		return clsx(
			'flex items-center gap-3 bg-white bg-opacity-10 backdrop-blur-sm',
			'border border-white border-opacity-20 px-5 py-3 md:px-4 md:py-2',
			'rounded-full transition-all duration-200',
			'hover:transform hover:-translate-y-0.5 hover:bg-opacity-15'
		);
	});

</script>

<section class={heroClasses()} style={styleString()}>
	<!-- Background Image -->
	{#if backgroundImageData()}
		{@const imgData = backgroundImageData()!}
		<img src={imgData.url} alt={imgData.alt} class={backgroundImageClasses()} loading="lazy" />
	{/if}

	<!-- Overlay and Content -->
	<div class="w-full">
		<div>
			<!-- Heading blocks with styling -->
			{#if headingBlocks().length > 0}
				<div class="flex flex-col gap-4">
					{#each headingBlocks() as heading}
						<Heading block={heading} {reportColors} className="hero-heading" />
					{/each}
				</div>
			{/if}

			<!-- Authors section -->
			{#if authors && authors.length > 0}
				<div class={authorsClasses()}>
					<h3 class="mb-4 text-xl font-semibold text-white text-opacity-90">Authors</h3>
					<div class={authorsListClasses()}>
						{#each authors as author}
							<div class={authorItemClasses()}>
								{#if author.logo}
									<div
										class="author-logo h-10 w-10 flex-shrink-0 overflow-hidden rounded-full md:h-8 md:w-8"
									>
										<Picture
											block={{
												blockType: 'picture',
												image: author.logo,
												width: 'full',
												insideContainer: false,
												position: 'center',
												showCaption: false,
												showOverlay: false
											}}
											{reportColors}
											className="author-avatar"
										/>
									</div>
								{/if}
								<div class="author-info">
									{#if author.url}
										<a
											href={author.url}
											target="_blank"
											rel="noopener noreferrer"
											class="text-sm font-medium text-white no-underline transition-opacity duration-200 hover:underline hover:opacity-80"
										>
											{author.name}
										</a>
									{:else}
										<div class="text-sm font-medium text-white">
											{author.name}
										</div>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	/* CSS Variables for dynamic styling */
	.hero-block {
		color: var(--text-color, inherit);
		background-color: var(--bg-color, transparent);
	}
</style>
