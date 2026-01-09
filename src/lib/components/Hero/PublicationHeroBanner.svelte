<script lang="ts">
	import IntersectionObserver from 'svelte-intersection-observer';
	import { fly, fade, scale } from 'svelte/transition';
	import { cubicInOut, elasticOut } from 'svelte/easing';
	import Button from '$components/UI/Button.svelte';

	interface Props {
		title: string;
		subtitle?: string;
		image: string;
		buttonText?: string;
		buttonLink?: string;
		backgroundColor?: string;
		imageOnRight?: boolean;
	}

	let {
		title,
		subtitle,
		image,
		buttonText = 'Download',
		buttonLink,
		backgroundColor = '#1e3a8a',
		imageOnRight = true
	}: Props = $props();

	let element = $state<HTMLElement | null>(null);
	let intersecting = $state(false);
</script>

<section class="relative w-full overflow-hidden" bind:this={element}>
	<!-- Background with gradient overlay -->
	<div
		class="absolute inset-0"
		style={`background: linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor}dd 100%);`}
	></div>

	<!-- Decorative circles for aesthetic appeal -->
	<div class="absolute inset-0 overflow-hidden opacity-5">
		<div
			class="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-white blur-3xl"
			style="transform: translate3d(0, 0, 0);"
		></div>
		<div
			class="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-white blur-3xl"
			style="transform: translate3d(0, 0, 0);"
		></div>
	</div>

	<IntersectionObserver {element} bind:intersecting once threshold={0.2}>
		{#if intersecting}
			<div
				class="relative z-10 layout mx-auto grid min-h-[65vh] grid-cols-1 gap-8 px-6 py-16 lg:grid-cols-12 lg:gap-16 lg:px-12 lg:py-20"
				in:fade={{ duration: 800, easing: cubicInOut }}
			>
				<!-- Content Section -->
				<div
					class="flex items-center justify-center lg:justify-start {imageOnRight
						? 'lg:col-span-7'
						: 'lg:order-last lg:col-span-7'}"
				>
					<div class="w-full space-y-6 text-white lg:space-y-8">
						<!-- Decorative accent line -->
						<div
							class="h-1.5 w-20 rounded-full bg-white"
							in:scale={{ duration: 600, delay: 150, easing: elasticOut, start: 0 }}
						></div>

						<h1
							class="text-3xl leading-tight font-bold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl"
							style="word-wrap: break-word; overflow-wrap: break-word;"
							transition:fly={{
								x: imageOnRight ? -50 : 50,
								duration: 600,
								delay: 250,
								easing: cubicInOut
							}}
						>
							{title}
						</h1>

						{#if subtitle}
							<p
								class="text-lg leading-relaxed font-light text-white/90 sm:text-xl lg:text-2xl"
								in:fly={{
									x: imageOnRight ? -50 : 50,
									duration: 600,
									delay: 350,
									easing: cubicInOut
								}}
							>
								{subtitle}
							</p>
						{/if}

						{#if buttonLink}
							<div
								in:fly={{
									y: 30,
									duration: 600,
									delay: 450,
									easing: cubicInOut
								}}
							>
								<Button to={buttonLink} colors="blue-invert">{buttonText}</Button>
							</div>
						{/if}
					</div>
				</div>

				<!-- Image Section with Creative Layout -->
				<div
					class="relative flex items-center justify-center {imageOnRight
						? 'lg:col-span-5'
						: 'lg:col-span-5'}"
					transition:fly={{
						x: imageOnRight ? 50 : -50,
						duration: 600,
						delay: 250,
						easing: cubicInOut
					}}
				>
					<!-- Decorative background shape behind image -->
					<!-- <div
						class="absolute inset-0 -rotate-6 transform rounded-2xl bg-white/5 backdrop-blur-sm"
						in:scale={{ duration: 800, delay: 200, easing: cubicInOut, start: 0.8 }}
					></div> -->

					<!-- Image container with hover effect -->
					<div
						class="relative z-10 w-full transition-transform duration-500 hover:scale-105"
						in:scale={{ duration: 700, delay: 300, easing: elasticOut, start: 0.8 }}
					>
						<img
							loading="eager"
							src={image}
							alt={title}
							class="h-auto w-full rounded-xl object-contain shadow-2xl"
						/>

						<!-- Decorative corner accent -->
						<!-- <div
							class="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-white/20 blur-2xl"
						></div>
						<div class="absolute -top-4 -left-4 h-32 w-32 rounded-full bg-white/20 blur-2xl"></div> -->
					</div>
				</div>
			</div>
		{/if}
	</IntersectionObserver>
</section>

<style>
	/* Smooth hardware acceleration for animations */
	section {
		will-change: transform;
	}

	/* Enhance blur effect performance */
	.blur-2xl,
	.blur-3xl {
		-webkit-transform: translate3d(0, 0, 0);
		transform: translate3d(0, 0, 0);
	}
</style>
