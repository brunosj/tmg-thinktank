<script lang="ts">

	import IntersectionObserver from 'svelte-intersection-observer';
	import { fly, fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	interface Props {
		image: string;
		title: string;
		subtitle: string;
	}

	let { image, title, subtitle }: Props = $props();

	let element = $state();
	let intersecting = $state(false);
</script>

<section bind:this={element} class="pb-0 lg:pb-0">
	<div aria-hidden="true" class="relative">
		<img
			loading="lazy"
			src={image}
			alt={title}
			class="h-[40vh] w-full object-cover object-center lg:h-[60vh]"
			decoding="async"
		/>
		<div class="absolute inset-0 bg-gradient-to-t from-white"></div>
	</div>

	<IntersectionObserver {element} bind:intersecting once>
		{#if intersecting}
			<div class="relative mx-auto -mt-24 max-w-6xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-12">
				<div class="mx-auto text-center">
					<h2
						class=" text-3xl font-extrabold leading-tight tracking-tight lg:text-6xl"
						transition:fly={{ y: 50, duration: 500, delay: 250, easing: cubicInOut }}
					>
						{title}
					</h2>
					<p
						class="m-auto mt-6 w-full text-lg lg:w-2/3 lg:text-2xl"
						transition:fly={{ y: 50, duration: 500, delay: 500, easing: cubicInOut }}
					>
						{subtitle}
					</p>
				</div>
			</div>
		{/if}
	</IntersectionObserver>
</section>
