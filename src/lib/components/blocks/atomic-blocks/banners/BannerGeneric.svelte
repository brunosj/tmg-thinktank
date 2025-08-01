<script lang="ts">
	import Button from '../PayloadButton.svelte';
	import type { Post, Initiative, BannerBlock } from '$types/payload-types';
	import { onMount } from 'svelte';

	interface Props {
		block: BannerBlock;
		reportColors?: {
			primary?: string | null;
			primaryLight?: string | null;
			secondary?: string | null;
			secondaryLight?: string | null;
			tertiary?: string | null;
			tertiaryLight?: string | null;
		};
	}

	let { block, reportColors }: Props = $props();

	// Extract values from block
	let heading = $derived(block.heading);
	let contentType = $derived(block.contentType);
	let description = $derived(block.description);
	let display = $derived(block.display);
	let height = $derived((block as any).height || 'medium');
	let textAlignment = $derived(block.textAlignment || 'left');
	let insideContainer = $derived(block.insideContainer !== false);

	let isVisible = $state(false);
	let bannerElement: HTMLElement;

	// Get content item
	let contentItem = $derived(() => {
		switch (contentType) {
			case 'post':
				return block.post as Post;
			case 'initiative':
				return block.initiative as Initiative;
			default:
				return null;
		}
	});

	// Get colors from reportColors or fallback to defaults
	let backgroundColor = $derived(() => {
		const colorKey = display?.backgroundColor;
		if (colorKey?.startsWith('#')) return colorKey;
		if (colorKey === 'transparent') return 'transparent';
		if (reportColors?.[colorKey as keyof typeof reportColors]) {
			return reportColors[colorKey as keyof typeof reportColors];
		}
		return '#2563eb'; // fallback
	});

	let textColor = $derived(() => {
		const colorKey = display?.textColor;
		if (colorKey?.startsWith('#')) return colorKey;
		if (reportColors?.[colorKey as keyof typeof reportColors]) {
			return reportColors[colorKey as keyof typeof reportColors];
		}
		return '#ffffff'; // fallback
	});

	let imageDisplay = $derived(display?.imageDisplay || 'background');
	let imagePosition = $derived(display?.imagePosition || 'right');
	let showOverlay = $derived(display?.showOverlay !== false);
	let overlayOpacity = $derived(display?.overlayOpacity || 0.7);

	// Get image URL based on content type
	let imageUrl = $derived(() => {
		// First check if there's a custom image for background display
		if (imageDisplay === 'background' && display?.customImage) {
			if (typeof display.customImage === 'object' && display.customImage.url) {
				return display.customImage.url;
			}
		}

		const item = contentItem();
		if (!item) return null;

		switch (contentType) {
			case 'post':
				const post = item as Post;
				if (post.heroImage && typeof post.heroImage === 'object' && post.heroImage.url) {
					return post.heroImage.url;
				}
				break;
			case 'initiative':
				const initiative = item as Initiative;
				if (
					initiative.basic?.banner &&
					typeof initiative.basic.banner === 'object' &&
					initiative.basic.banner.url
				) {
					return initiative.basic.banner.url;
				}
				break;
		}
		return null;
	});

	// Get default URL for content
	let defaultUrl = $derived(() => {
		const item = contentItem();
		if (!item) return '#';

		switch (contentType) {
			case 'post':
				const post = item as Post;
				return `/news/${post.slug}`;
			case 'initiative':
				const initiative = item as Initiative;
				return `/initiatives/${initiative.slug}`;
			default:
				return '#';
		}
	});

	// Get button URL (custom or default)
	let buttonUrl = $derived(() => {
		return block.customButton?.url || defaultUrl();
	});

	// Get button text
	let buttonText = $derived(() => {
		if (block.customButton?.text) {
			return block.customButton.text;
		}
		return 'Learn More';
	});

	// Map button appearance
	let buttonAppearance = $derived(() => {
		const appearance = block.customButton?.appearance;
		if (appearance === 'ghost') return 'text';
		if (appearance === 'filled') return 'filled';
		return 'outline'; // default
	});

	// Helper function to get button color
	let getButtonColor = $derived(() => {
		const colorKey = block.customButton?.color;
		if (!colorKey) return undefined;
		const color = reportColors?.[colorKey as keyof typeof reportColors];
		return color || colorKey || undefined;
	});

	// CSS classes for different height options
	let heightClass = $derived(() => {
		const classes: Record<string, string> = {
			auto: 'min-h-[0vh]',
			small: 'max-h-[40vh] h-[40vh]	',
			medium: 'max-h-[50vh] h-[50vh]',
			large: 'max-h-[60vh] h-[60vh]',
			xl: 'max-h-[70vh] h-[70vh]'
		};
		return classes[height] || classes.medium;
	});

	let alignmentClass = $derived(() => {
		const classes: Record<string, string> = {
			left: 'text-left',
			center: 'text-center',
			right: 'text-right'
		};
		return classes[textAlignment] || classes.left;
	});

	// Animation on mount
	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setTimeout(() => {
						isVisible = true;
					}, 200);
					observer.disconnect();
				}
			},
			{ threshold: 0.2 }
		);

		if (bannerElement) {
			observer.observe(bannerElement);
		}

		return () => {
			observer.disconnect();
		};
	});
</script>

<section
	bind:this={bannerElement}
	class="relative overflow-hidden {insideContainer
		? 'mx-auto max-w-7xl rounded-2xl px-4 sm:px-6 lg:px-8'
		: ''} {heightClass()}"
>
	{#if imageDisplay === 'background' && imageUrl()}
		<!-- Background Image -->
		<div
			class="absolute inset-0 bg-cover bg-center"
			style="background-image: url('{imageUrl()}')"
		></div>

		{#if showOverlay}
			<!-- Overlay -->
			<div
				class="absolute inset-0"
				style="background-color: {backgroundColor()}; opacity: {overlayOpacity}"
			></div>
		{/if}
	{:else}
		<!-- Solid Background -->
		<div class="absolute inset-0" style="background-color: {backgroundColor()}"></div>
	{/if}

	<!-- Content -->
	<div class="layout relative z-10 flex h-full items-center py-12">
		{#if imageDisplay === 'container'}
			<!-- Container Layout with Image -->
			<div class="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-20">
				{#if imagePosition === 'left'}
					<!-- Image Left -->
					{#if imageUrl()}
						<div class="order-1 flex items-center justify-center lg:order-1">
							<div
								class="relative w-full overflow-hidden rounded-xl transition-all duration-700"
								class:translate-y-0={isVisible}
								class:opacity-100={isVisible}
								class:translate-y-8={!isVisible}
								class:opacity-0={!isVisible}
							>
								<img
									src={imageUrl()}
									alt={(typeof contentItem() === 'object'
										? (contentItem() as any)?.title
										: heading) || heading}
									class="w-full object-contain"
									loading="lazy"
								/>
							</div>
						</div>
					{/if}

					<!-- Text Right -->
					<div
						class="order-2 lg:order-2 {alignmentClass()} transition-all delay-200 duration-700"
						class:translate-y-0={isVisible}
						class:opacity-100={isVisible}
						class:translate-y-8={!isVisible}
						class:opacity-0={!isVisible}
					>
						<div class="space-y-6">
							<h2 class="text-3xl font-bold leading-tight lg:text-5xl" style="color: {textColor()}">
								{heading}
							</h2>

							{#if description}
								<div class="text-lg opacity-90" style="color: {textColor()}">
									{description}
								</div>
							{/if}

							{#if buttonUrl() && buttonUrl() !== '#'}
								<div class="pt-4">
									<Button
										href={buttonUrl()}
										appearance={buttonAppearance()}
										backgroundColor={getButtonColor()}
									>
										{buttonText()}
									</Button>
								</div>
							{/if}
						</div>
					</div>
				{:else}
					<!-- Text Left, Image Right (default) -->
					<div
						class="order-2 lg:order-1 {alignmentClass()} transition-all duration-700"
						class:translate-y-0={isVisible}
						class:opacity-100={isVisible}
						class:translate-y-8={!isVisible}
						class:opacity-0={!isVisible}
					>
						<div class="space-y-6">
							<h2 class="text-3xl font-bold leading-tight lg:text-5xl" style="color: {textColor()}">
								{heading}
							</h2>

							{#if description}
								<div class="text-lg opacity-90" style="color: {textColor()}">
									{description}
								</div>
							{/if}

							{#if buttonUrl() && buttonUrl() !== '#'}
								<div class="pt-4">
									<Button
										href={buttonUrl()}
										appearance={buttonAppearance()}
										backgroundColor={getButtonColor()}
									>
										{buttonText()}
									</Button>
								</div>
							{/if}
						</div>
					</div>

					{#if imageUrl()}
						<div class="order-1 flex items-center justify-center lg:order-2">
							<div
								class="relative overflow-hidden rounded-xl transition-all delay-200 duration-700"
								class:translate-y-0={isVisible}
								class:opacity-100={isVisible}
								class:translate-y-8={!isVisible}
								class:opacity-0={!isVisible}
							>
								<img
									src={imageUrl()}
									alt={(typeof contentItem() === 'object'
										? (contentItem() as any)?.title
										: heading) || heading}
									class=" w-full object-contain"
									loading="lazy"
								/>
							</div>
						</div>
					{/if}
				{/if}
			</div>
		{:else}
			<!-- Background Image Layout - Centered Text -->
			<div class="w-full {alignmentClass()}">
				<div
					class="space-y-6 transition-all duration-700"
					class:translate-y-0={isVisible}
					class:opacity-100={isVisible}
					class:translate-y-8={!isVisible}
					class:opacity-0={!isVisible}
				>
					<h2 class="text-4xl font-bold leading-tight lg:text-6xl" style="color: {textColor()}">
						{heading}
					</h2>

					{#if description}
						<div class="text-xl opacity-90" style="color: {textColor()}">
							{description}
						</div>
					{/if}

					{#if buttonUrl() && buttonUrl() !== '#'}
						<div class="pt-6">
							<Button
								href={buttonUrl()}
								appearance={buttonAppearance()}
								size="large"
								backgroundColor={getButtonColor()}
							>
								{buttonText()}
							</Button>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</section>
