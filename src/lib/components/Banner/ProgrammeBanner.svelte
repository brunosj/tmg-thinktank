<!-- ProgrammeBanner.svelte -->
<script lang="ts">
	import IntersectionObserver from 'svelte-intersection-observer';
	import { fly, fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	interface Props {
		image: string;
		intro: string;
		title: string;
		to: string;
		key: number;
	}

	let { image, intro, title, to, key }: Props = $props();

	let element: HTMLDivElement | null = $state(null);
	let intersecting = $state(false);

	const isTextRight = key === 0 || key === 2;
</script>

<a href={to} bind:this={element}>
	<IntersectionObserver {element} bind:intersecting once threshold={0.7}>
		{#if intersecting}
			<div class="relative">
				<img
					loading="lazy"
					src={image}
					class="-z-10 h-32 w-full object-cover object-center lg:h-60"
					alt="Programme Banner"
				/>
				<div
					class="absolute bottom-6 w-full lg:bottom-12"
					transition:fade={{ duration: 500, delay: key * 200, easing: cubicInOut }}
				>
					<div class="layout group m-auto {isTextRight ? 'text-right' : ''}">
						<div>
							<div
								class="rounded-2xl bg-opacity-50 font-bold leading-tight tracking-tight text-white group-hover:bg-opacity-80"
							>
								<h2 class="px-5 py-2 text-lg lg:text-4xl">{intro}</h2>
								<div class="px-5 py-2 text-2xl lg:text-5xl 2xl:text-6xl">
									<h1 class="fromLeftWhite font-bold">{title}</h1>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</IntersectionObserver>
</a>
