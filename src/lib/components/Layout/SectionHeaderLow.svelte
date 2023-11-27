<script>
	export let title;
	export let subtitle = '';
	export let background;

	import IntersectionObserver from 'svelte-intersection-observer';
	import { fly, fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';

	let element;
	let intersecting = false;
</script>

<section bind:this={element}>
	<IntersectionObserver {element} bind:intersecting once>
		{#if intersecting}
			<div class={background}>
				<div class="container flex h-48 items-center pt-12 lg:h-80">
					<h1
						class="font col-span-2 mb-2 text-center text-4xl font-bold leading-none text-green-light lg:text-6xl"
						transition:fly={{ x: -50, duration: 500, delay: 250, easing: cubicInOut }}
					>
						{title}
					</h1>
					{#if subtitle}
						<h1
							class="text-large mt-10 text-left font-light leading-none text-green-light lg:text-xl"
						>
							{subtitle}
						</h1>
					{/if}
				</div>
			</div>
		{/if}
	</IntersectionObserver>
</section>
