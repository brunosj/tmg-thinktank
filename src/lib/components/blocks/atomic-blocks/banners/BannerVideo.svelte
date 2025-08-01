<script lang="ts">
	import type { Video, BannerBlock } from '$types/payload-types';
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

	// Video wrapper functionality
	let showVideoPlayer = $state(false);
	let showPlayIcon = $state(false);

	function togglePlayIcon(value: boolean) {
		showPlayIcon = value;
	}

	function loadVideo() {
		showVideoPlayer = true;
	}

	// Extract values from block
	let heading = $derived(block.heading);
	let description = $derived(block.description);
	let display = $derived(block.display);
	let textAlignment = $derived(block.textAlignment || 'left');
	let insideContainer = $derived(block.insideContainer !== false);
	let video = $derived(block.video as Video);

	let isVisible = $state(false);
	let container: HTMLElement;

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

	// Check if we have valid video data
	let hasValidVideoData = $derived(!!(video?.url && video?.title));

	onMount(() => {
		// Set up intersection observer for animation on scroll
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setTimeout(() => {
						isVisible = true;
					}, 300);
					observer.disconnect();
				}
			},
			{ threshold: 0.2 }
		);

		if (container) {
			observer.observe(container);
		}

		return () => {
			observer.disconnect();
		};
	});
</script>

<section bind:this={container} class="relative overflow-hidden">
	<div
		style="background-color: {backgroundColor()}"
		class="relative z-10 {insideContainer
			? 'mx-auto max-w-7xl rounded-3xl px-4 sm:px-6 lg:px-8'
			: ''}"
	>
		<div class="layout relative z-10 grid grid-cols-1 items-center gap-x-8 py-12 lg:grid-cols-2">
			<!-- Text content -->
			<div
				class="{textAlignment === 'center'
					? 'text-center'
					: textAlignment === 'right'
						? 'text-right'
						: 'text-left'} transition-all duration-700 {isVisible
					? 'translate-y-0 opacity-100'
					: 'translate-y-8 opacity-0'}"
			>
				<!-- <div
					class="mb-6 h-1 w-24 rounded-sm"
					style="background-color: {textColor()}; opacity: 0.6;"
				></div> -->
				<div
					class="pb-10 text-2xl font-bold leading-tight lg:pb-0 lg:text-5xl"
					style="color: {textColor()}"
				>
					{heading}
				</div>
				{#if description}
					<div class="mt-6 text-lg opacity-90" style="color: {textColor()}">
						{description}
					</div>
				{/if}
				<div class="mt-6 h-1 w-24 rounded-sm" style="background-color: {textColor()}"></div>
			</div>

			<!-- Video content -->
			<div
				class="transition-all delay-300 duration-700 {isVisible
					? 'translate-y-0 opacity-100'
					: 'translate-y-8 opacity-0'}"
			>
				<div class="relative">
					<!-- Video shadow effect -->
					<div
						class="absolute -inset-1 rounded-2xl opacity-30 blur-xl"
						style="background-color: {backgroundColor()}; filter: brightness(1.5);"
					></div>

					<!-- Video container with border -->
					<div
						class="relative overflow-hidden rounded-xl border-2 shadow-2xl"
						style="border-color: {textColor()}; border-opacity: 0.2;"
					>
						{#if hasValidVideoData}
							<!-- Video Wrapper Implementation -->
							<div
								class="relative w-full"
								onmouseenter={() => togglePlayIcon(true)}
								onmouseleave={() => togglePlayIcon(false)}
								role="button"
								tabindex="0"
							>
								{#if showVideoPlayer}
									<div class="relative w-full pt-[56.25%]">
										<iframe
											src={video.url}
											title={video.title || ''}
											class="absolute inset-0 h-full w-full rounded-xl"
											frameborder="0"
											allowfullscreen
										></iframe>
									</div>
								{:else}
									<div class="relative">
										<button
											class="w-full"
											onclick={loadVideo}
											onkeydown={(event) => {
												if (event.key === 'Enter' || event.key === ' ') {
													event.preventDefault();
													loadVideo();
												}
											}}
											style="cursor: pointer;"
										>
											{#if video.image && typeof video.image === 'object' && video.image.url}
												<img
													src={video.image.url}
													alt={video.title || ''}
													class="aspect-video w-full rounded-xl object-cover"
												/>
											{:else}
												<!-- Fallback if no image -->
												<div
													class="flex h-64 w-full flex-col items-center justify-center rounded-xl bg-gray-800"
												>
													<div class="mb-4 text-gray-400">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															class="h-16 w-16"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																stroke-width="1"
																d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2 2v8a2 2 0 002 2z"
															/>
														</svg>
													</div>
													<p class="text-lg font-medium text-white">Video Available</p>
												</div>
											{/if}
										</button>
										<!-- {#if showPlayIcon}
											<div
												class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
											>
												<div
													class="flex h-20 w-20 items-center justify-center rounded-full bg-white bg-opacity-90 shadow-2xl"
												>
													<svg
														class="ml-1 h-8 w-8 text-gray-800"
														fill="currentColor"
														viewBox="0 0 20 20"
													>
														<path
															fill-rule="evenodd"
															d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
															clip-rule="evenodd"
														/>
													</svg>
												</div>
											</div>
										{/if} -->
									</div>
								{/if}
							</div>
						{:else}
							<!-- Fallback content when video data is missing -->
							<div
								class="flex h-64 w-full flex-col items-center justify-center bg-gray-800 p-6 text-center"
							>
								<div class="mb-4 text-gray-400">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-16 w-16"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="1"
											d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2 2v8a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<p class="text-lg font-medium text-white">Video content will be available soon</p>
								<p class="mt-2 text-sm text-gray-400">Check back later for updates</p>
							</div>
						{/if}
					</div>

					<!-- Decorative corner accents -->
					<div
						class="absolute -left-1 -top-1 h-6 w-6 rounded-tl-lg border-l-2 border-t-2"
						style="border-color: {textColor()}"
					></div>
					<div
						class="absolute -right-1 -top-1 h-6 w-6 rounded-tr-lg border-r-2 border-t-2"
						style="border-color: {textColor()}"
					></div>
					<div
						class="absolute -bottom-1 -left-1 h-6 w-6 rounded-bl-lg border-b-2 border-l-2"
						style="border-color: {textColor()}"
					></div>
					<div
						class="absolute -bottom-1 -right-1 h-6 w-6 rounded-br-lg border-b-2 border-r-2"
						style="border-color: {textColor()}"
					></div>
				</div>
			</div>
		</div>
	</div>
</section>
