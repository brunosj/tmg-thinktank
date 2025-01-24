<script lang="ts">

	import { renderRichText } from '$utils/utils';
	import Button from '$components/UI/Button.svelte';
	import IntersectionObserver from 'svelte-intersection-observer';
	import { fly, fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	let { hero } = $props();

	let visible = $state(false);

	let { heroPicture, heroText } = hero;
	onMount(() => {
		visible = true;
	});
</script>

<section class="overflow-hidden bg-white">
	<div class="relative min-h-[50vh]">
		{#if visible}
			<div class="order-1 h-full bg-gray-50 lg:absolute lg:inset-y-0 lg:right-0 lg:block lg:w-1/2">
				<img
					loading="eager"
					class="aspect-[3/2] object-cover lg:aspect-auto lg:h-full lg:w-full"
					src={heroPicture[0].secure_url}
					alt="TMG Think Tank"
				/>
			</div>
			<div class="mx-auto max-w-7xl">
				<div class="relative z-10 pt-14 lg:w-full lg:max-w-2xl">
					<svg
						class="absolute inset-y-0 right-8 hidden h-full w-80 translate-x-1/2 transform fill-white lg:block"
						viewBox="0 0 100 100"
						preserveAspectRatio="none"
						aria-hidden="true"
					>
						<polygon points="0,0 90,0 50,100 0,100" />
					</svg>
					<div class=" relative px-6 py-16 lg:px-8 lg:py-24 lg:pr-0">
						<div class="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
							<h1
								class="font-bold leading-tight tracking-tight text-gray-900"
								in:fly={{ x: -50, duration: 500, delay: 500, easing: cubicInOut }}
							>
								TMG Think Tank for Sustainability
							</h1>
							<p
								class="richText mt-6 text-sm leading-7 text-black lg:text-lg"
								in:fly={{ x: 50, duration: 1000, delay: 750, easing: cubicInOut }}
							>
								{#if heroText}
									{@html renderRichText(heroText)}
								{/if}
							</p>
							<div
								class="mt-10 flex items-center gap-x-6"
								in:fade={{ duration: 1000, delay: 750, easing: cubicInOut }}
							>
								<Button to="/about" colors="green">About us</Button>

								<a
									href="/publications"
									class="text-sm font-semibold leading-6 text-gray-900 duration-300 hover:text-black"
									>View our publications <span aria-hidden="true">→</span></a
								>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</section>
