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

<div class="mx-auto py-6">
	{#if initiatives.length > 0}
		{#each [initiatives[currentIndex]] as initiative}
			<div class="relative max-h-[60vh] overflow-hidden">
				<!-- Image section (top) -->
				<div class="relative h-auto w-full overflow-hidden">
					{#if initiative.fields.pageBannerCdn && initiative.fields.pageBannerCdn.length > 0}
						<img
							src={initiative.fields.pageBannerCdn[0].secure_url}
							alt={initiative.fields.title}
							class="h-auto w-full object-contain"
						/>
					{:else if initiative.fields.imageCdn && initiative.fields.imageCdn.length > 0}
						<img
							src={initiative.fields.imageCdn[0].secure_url}
							alt={initiative.fields.title}
							class="h-auto w-full object-contain"
						/>
					{/if}
				</div>

				<!-- Content section (bottom) -->
				<div
					class="relative mx-auto -mt-16 w-11/12 rounded-xl shadow-lg"
					style="background: linear-gradient(135deg, {initiative.fields.color1 ||
						'#3B5F63'}, {initiative.fields.color2 || '#2e2d51'});"
				>
					<!-- Decorative elements -->
					<div class="absolute inset-0 overflow-hidden rounded-xl opacity-20">
						<div class="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-white blur-2xl"></div>
						<div
							class="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-white blur-2xl"
						></div>
					</div>

					<!-- Animated shapes (visible after mount) -->
					{#if animationReady}
						<div class="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
							<div
								class="absolute left-[15%] top-[20%] h-8 w-8 animate-pulse rounded-full bg-white/20"
								style="animation-duration: 3s"
							></div>
							<div
								class="absolute bottom-[30%] right-[20%] h-10 w-10 animate-ping rounded-full bg-white/20"
								style="animation-duration: 4s"
							></div>
						</div>
					{/if}

					<!-- Content -->
					<div class="relative z-10 p-6 text-white">
						<div
							class="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm"
						>
							Featured Initiative
						</div>

						<h2
							class="mb-3 font-heading text-2xl font-bold leading-tight tracking-tight md:text-3xl"
						>
							{initiative.fields.title}
						</h2>

						<div class="mb-3 h-1 w-16 rounded-full bg-white/60"></div>

						<p
							class="mb-4 line-clamp-3 max-w-xl text-sm leading-relaxed text-white/90 md:text-base"
						>
							{initiative.fields.summary}
						</p>

						<div class="flex flex-wrap items-center gap-3">
							<button
								class="group flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-md transition-all duration-300 hover:bg-opacity-90 hover:shadow-lg"
								onclick={() => navigateToInitiative(initiative.fields.slug)}
							>
								Explore Initiative
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
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
						class="h-2 w-2 rounded-full transition-all duration-300"
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
