<script>
	export let image;
	export let title;
	export let subtitle;

	import IntersectionObserver from 'svelte-intersection-observer';
	import { fly, fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';

	let element;
	let intersecting = false;
</script>

<section bind:this={element}>
	<div aria-hidden="true" class="relative">
		<img
			loading="lazy"
			src={image}
			alt={title}
			class="h-[60vh] w-full object-cover object-center"
			decoding="async"
		/>
		<div class="absolute inset-0 bg-gradient-to-t from-white"></div>
	</div>

	<IntersectionObserver {element} bind:intersecting once>
		{#if intersecting}
			<div class="relative mx-auto -mt-24 max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
				<div class="mx-auto text-center">
					<h2
						class="text-4xl font-extrabold leading-tight tracking-tight lg:text-7xl"
						transition:fly={{ y: 50, duration: 500, delay: 250, easing: cubicInOut }}
					>
						{title}
					</h2>
					<p
						class="mt-8 text-lg lg:text-3xl"
						transition:fly={{ y: 50, duration: 500, delay: 500, easing: cubicInOut }}
					>
						{subtitle}
					</p>
				</div>
			</div>
		{/if}
	</IntersectionObserver>
</section>
