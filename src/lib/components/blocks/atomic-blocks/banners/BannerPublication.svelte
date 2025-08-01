<script lang="ts">
	import Button from '../PayloadButton.svelte';
	import type { Publication, Document, BannerBlock } from '$types/payload-types';
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
	let description = $derived(block.description);
	let display = $derived(block.display);
	let height = $derived((block as any).height || 'medium');
	let textAlignment = $derived(block.textAlignment || 'left');
	let insideContainer = $derived(block.insideContainer !== false);
	let publication = $derived(block.publication as Publication);

	let isVisible = $state(false);
	let bannerElement: HTMLElement;

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

	// Get image URL
	let imageUrl = $derived(() => {
		// First check if there's a custom image for background display
		if (imageDisplay === 'background' && display?.customImage) {
			if (typeof display.customImage === 'object' && display.customImage.url) {
				return display.customImage.url;
			}
		}

		if (!publication) return null;

		// For publications, use thumbnail from content.pdf thumbnailPath
		if (
			publication.content?.pdf &&
			typeof publication.content.pdf === 'object' &&
			publication.content.pdf.thumbnailPath
		) {
			return publication.content.pdf.thumbnailPath;
		}
		return null;
	});

	// Get publication URL
	let publicationUrl = $derived(() => {
		if (!publication) return '#';
		const pdfUrl =
			publication.content?.pdf && typeof publication.content.pdf === 'object'
				? publication.content.pdf.url
				: null;
		return block.customButton?.url || pdfUrl || `/publications/${publication.slug}`;
	});

	// Get button text
	let buttonText = $derived(() => {
		return block.customButton?.text || 'Download';
	});

	// Map button appearance and color
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
		? 'mx-auto max-w-7xl rounded-2xl   px-4 sm:px-6 lg:px-8'
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
	<div class="layout z-10 flex h-full items-center py-12">
		{#if imageDisplay === 'container'}
			<!-- Container Layout with Image -->
			<div class="flex h-full w-full items-center justify-around gap-8">
				{#if imagePosition === 'left'}
					<!-- Image Left -->
					{#if imageUrl()}
						<div class="order-1 h-full items-center lg:order-1">
							<div
								class={`relative h-full w-full overflow-hidden rounded-xl py-12 transition-all duration-700 ${heightClass()}`}
								class:translate-y-0={isVisible}
								class:opacity-100={isVisible}
								class:translate-y-8={!isVisible}
								class:opacity-0={!isVisible}
							>
								<img
									src={imageUrl()}
									alt={(typeof publication === 'object' ? publication?.title : heading) || heading}
									class="max-h-full max-w-full object-contain"
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

							{#if publicationUrl() && publicationUrl() !== '#'}
								<div class="pt-4">
									<Button
										href={publicationUrl()}
										appearance={buttonAppearance()}
										backgroundColor={getButtonColor()}
									>
										{buttonText()}
									</Button>
								</div>
							{/if}

							{#if block.extraDocuments && block.extraDocuments.length > 0}
								<div class="space-y-4 pt-2">
									<div class="flex flex-wrap gap-3">
										{#each block.extraDocuments || [] as doc}
											<Button
												href={(doc as Document).url || '#'}
												appearance={buttonAppearance()}
												size="small"
												backgroundColor={getButtonColor()}
											>
												{block.extraDocumentsButtonText || 'Download'}: {(doc as Document).title ||
													(doc as Document).filename}
											</Button>
										{/each}
									</div>
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

							{#if publicationUrl() && publicationUrl() !== '#'}
								<div class="pt-4">
									<Button
										href={publicationUrl()}
										appearance={buttonAppearance()}
										backgroundColor={getButtonColor()}
									>
										{buttonText()}
									</Button>
								</div>
							{/if}

							{#if block.extraDocuments && block.extraDocuments.length > 0}
								<div class="space-y-4 pt-2">
									<div class="flex flex-wrap gap-3">
										{#each block.extraDocuments || [] as doc}
											<Button
												href={(doc as Document).url || '#'}
												appearance={buttonAppearance()}
												size="small"
												backgroundColor={getButtonColor()}
											>
												{block.extraDocumentsButtonText || 'Download'}: {(doc as Document).title ||
													(doc as Document).filename}
											</Button>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					</div>

					{#if imageUrl()}
						<div class="order-1 flex h-full items-center justify-center lg:order-2">
							<div
								class="flex h-full w-full items-center justify-center rounded-xl p-4 transition-all delay-200 duration-700"
								class:translate-y-0={isVisible}
								class:opacity-100={isVisible}
								class:translate-y-8={!isVisible}
								class:opacity-0={!isVisible}
							>
								<img
									src={imageUrl()}
									alt={(typeof publication === 'object' ? publication?.title : heading) || heading}
									class="max-h-full max-w-full object-contain"
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

					{#if publicationUrl() && publicationUrl() !== '#'}
						<div class="pt-6">
							<Button
								href={publicationUrl()}
								appearance={buttonAppearance()}
								size="large"
								backgroundColor={getButtonColor()}
							>
								{buttonText()}
							</Button>
						</div>
					{/if}

					{#if block.extraDocuments && block.extraDocuments.length > 0}
						<div class="space-y-3 pt-4">
							<p class="text-base font-medium opacity-75" style="color: {textColor()}">
								Additional Documents:
							</p>
							<div class="flex flex-wrap gap-4">
								{#each block.extraDocuments || [] as doc}
									<Button
										href={(doc as Document).url || '#'}
										appearance={buttonAppearance()}
										backgroundColor={getButtonColor()}
									>
										{block.extraDocumentsButtonText || 'Download'}: {(doc as Document).title ||
											(doc as Document).filename}
									</Button>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</section>
