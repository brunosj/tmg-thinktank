<script lang="ts">
	import { onMount } from 'svelte';
	import type { Initiative } from '$lib/types/types';
	import { goto } from '$app/navigation';

	let { initiatives = [] } = $props<{ initiatives?: Initiative[] }>();

	let animationReady = $state(false);
	let currentIndex = $state(0);

	onMount(() => {
		animationReady = true;

		// Auto-rotate through initiatives if there are multiple
		if (initiatives.length > 1) {
			const interval = setInterval(() => {
				currentIndex = (currentIndex + 1) % initiatives.length;
			}, 8000);

			return () => clearInterval(interval);
		}
	});

	function navigateToInitiative(slug: string) {
		goto(`/initiatives/${slug}`);
	}
</script>

<div class="mx-auto py-8">
	{#if initiatives.length > 0}
		{#each [initiatives[currentIndex]] as initiative}
			<div
				class="relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500"
				style="background: linear-gradient(135deg, {initiative.fields.color1 ||
					'#3B5F63'}, {initiative.fields.color2 || '#67797B'});"
			>
				<!-- Decorative elements -->
				<div class="absolute inset-0 opacity-20">
					<div class="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white blur-3xl"></div>
					<div class="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white blur-3xl"></div>
					<div
						class="absolute left-1/2 top-1/3 h-32 w-32 -translate-x-1/2 rounded-full bg-white blur-xl"
					></div>
				</div>

				<!-- Animated shapes (visible after mount) -->
				{#if animationReady}
					<div class="pointer-events-none absolute inset-0 overflow-hidden">
						<div
							class="absolute left-[15%] top-[20%] h-16 w-16 animate-pulse rounded-full bg-white/20"
							style="animation-duration: 3s"
						></div>
						<div
							class="absolute bottom-[30%] right-[20%] h-20 w-20 animate-ping rounded-full bg-white/20"
							style="animation-duration: 4s"
						></div>
						<div
							class="absolute right-[40%] top-[60%] h-12 w-12 animate-pulse rounded-full bg-white/20"
							style="animation-duration: 2.5s"
						></div>
					</div>
				{/if}

				<div class="relative z-10 flex flex-col md:flex-row">
					<!-- Image section -->
					<div class="relative md:w-1/2">
						{#if initiative.fields.pageBannerCdn && initiative.fields.pageBannerCdn.length > 0}
							<div class="relative h-64 w-full overflow-hidden md:h-full">
								<img
									src={initiative.fields.pageBannerCdn[0].secure_url}
									alt={initiative.fields.title}
									class="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
								/>
								<div
									class="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent md:bg-gradient-to-l"
								></div>
							</div>
						{:else if initiative.fields.imageCdn && initiative.fields.imageCdn.length > 0}
							<div class="relative h-64 w-full overflow-hidden md:h-full">
								<img
									src={initiative.fields.imageCdn[0].secure_url}
									alt={initiative.fields.title}
									class="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
								/>
								<div
									class="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent md:bg-gradient-to-l"
								></div>
							</div>
						{:else}
							<div class="h-64 w-full bg-gray-200 md:h-full"></div>
						{/if}
					</div>

					<!-- Content section -->
					<div class="flex flex-1 flex-col justify-center p-8 text-white md:p-12">
						<div
							class="mb-6 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium backdrop-blur-sm"
						>
							Featured
						</div>

						<h2
							class="mb-4 font-heading text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl"
						>
							{initiative.fields.title}
						</h2>

						<div class="mb-6 h-1 w-20 rounded-full bg-white/60"></div>

						<p class="mb-8 max-w-xl text-lg leading-relaxed text-white/90">
							{initiative.fields.summary}
						</p>

						<div class="flex flex-wrap items-center gap-6">
							<button
								class="group flex items-center rounded-full bg-white px-6 py-3 font-medium text-gray-800 shadow-lg transition-all duration-300 hover:bg-opacity-90 hover:shadow-xl"
								onclick={() => navigateToInitiative(initiative.fields.slug)}
							>
								Explore Initiative
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M14 5l7 7m0 0l-7 7m7-7H3"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		{/each}

		<!-- Initiative selector dots (only if multiple initiatives) -->
		{#if initiatives.length > 1}
			<div class="mt-6 flex justify-center space-x-2">
				{#each initiatives as _, i}
					<button
						class="h-3 w-3 rounded-full transition-all duration-300"
						style="background-color: {i === currentIndex ? '#3B5F63' : '#D1D5DB'}; 
						       transform: {i === currentIndex ? 'scale(1.2)' : 'scale(1)'}"
						onclick={() => (currentIndex = i)}
						aria-label={`View initiative ${i + 1}`}
					></button>
				{/each}
			</div>
		{/if}
	{/if}
</div>

<style>
	@keyframes pulse {
		0%,
		100% {
			opacity: 0.3;
		}
		50% {
			opacity: 0.7;
		}
	}

	@keyframes ping {
		0% {
			transform: scale(1);
			opacity: 0.7;
		}
		75%,
		100% {
			transform: scale(2);
			opacity: 0;
		}
	}

	:global(.animate-pulse) {
		animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	:global(.animate-ping) {
		animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
	}
</style>
