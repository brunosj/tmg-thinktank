<script lang="ts">
	import type { Video } from '$lib/types/types';
	import VideoWrapper from '$components/Video/VideoWrapper.svelte';
	import { onMount } from 'svelte';

	interface Props {
		video: Video;
		bgColor: string;
		text: string;
		textColor?: string;
		order?: string;
		textAlignment?: string;
		showPattern?: boolean;
		animationDelay?: number;
	}

	let {
		video,
		bgColor,
		text,
		textColor = 'white',
		order = 'order-last',
		textAlignment = 'text-left',
		showPattern = true,
		animationDelay = 300
	}: Props = $props();

	let isVisible = $state(true);
	let container: HTMLElement;

	// Check if we have valid video data
	let hasValidVideoData = $derived(!!(video?.fields?.url && video?.fields?.title));

	onMount(() => {
		// Set up intersection observer for animation on scroll
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setTimeout(() => {
						isVisible = true;
					}, animationDelay);
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

	// Generate random pattern positions
	const patternElements = Array(6)
		.fill(0)
		.map(() => ({
			top: `${Math.random() * 100}%`,
			left: `${Math.random() * 100}%`,
			size: 20 + Math.random() * 40,
			opacity: 0.05 + Math.random() * 0.1,
			rotation: Math.random() * 45
		}));
</script>

<section bind:this={container} class="relative overflow-hidden">
	<div style="background-color: {bgColor}" class="relative z-10 rounded-3xl">
		<!-- Background pattern elements -->
		{#if showPattern}
			<div class="absolute inset-0 overflow-hidden">
				{#each patternElements as pattern}
					<div
						class="absolute rounded-full"
						style="
							top: {pattern.top}; 
							left: {pattern.left}; 
							width: {pattern.size}px; 
							height: {pattern.size}px; 
							background-color: white; 
							opacity: {pattern.opacity};
							transform: rotate({pattern.rotation}deg);
							filter: blur(15px);
						"
					></div>
				{/each}
			</div>
		{/if}

		<div class="layout relative z-10 grid grid-cols-1 items-center gap-x-8 py-12 lg:grid-cols-2">
			<!-- Text content -->
			<div
				class={`${textAlignment} transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
			>
				<div
					class="mb-6 h-1 w-12 rounded-sm"
					style="background-color: {textColor}; opacity: 0.6;"
				></div>
				<div
					class="pb-10 text-2xl font-bold leading-tight lg:pb-0 lg:text-5xl"
					style="color: {textColor}"
				>
					{text}
				</div>
				<div class="mt-6 h-1 w-24 rounded-sm opacity-30" style="background-color: {textColor}"></div>
			</div>

			<!-- Video content -->
			<div
				class={`${order} transition-all delay-300 duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
			>
				<div class="relative">
					<!-- Video shadow effect -->
					<div
						class="absolute -inset-1 rounded-2xl opacity-30 blur-xl"
						style="background-color: {bgColor}; filter: brightness(1.5);"
					></div>

					<!-- Video container with border -->
					<div
						class="relative overflow-hidden rounded-xl border-2 shadow-2xl"
						style="border-color: {textColor}; border-opacity: 0.2;"
					>
						{#if hasValidVideoData}
							<VideoWrapper
								videoSrcURL={video.fields.url}
								videoTitle={video.fields.title}
								videoImage={video.fields.image?.fields?.file?.url || ''}
							/>
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
											d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
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
						style="border-color: {textColor}"
					></div>
					<div
						class="absolute -right-1 -top-1 h-6 w-6 rounded-tr-lg border-r-2 border-t-2"
						style="border-color: {textColor}"
					></div>
					<div
						class="absolute -bottom-1 -left-1 h-6 w-6 rounded-bl-lg border-b-2 border-l-2"
						style="border-color: {textColor}"
					></div>
					<div
						class="absolute -bottom-1 -right-1 h-6 w-6 rounded-br-lg border-b-2 border-r-2"
						style="border-color: {textColor}"
					></div>
				</div>
			</div>
		</div>
	</div>
</section>
