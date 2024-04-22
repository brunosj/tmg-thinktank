<script lang="ts">
	export let hero;

	import { renderRichText } from '$utils/utils';
	import logo from '$assets/TMG_logo_white.png';
	import IntersectionObserver from 'svelte-intersection-observer';
	import { fly, fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import Button from '$components/UI/Button.svelte';

	let element;
	let intersecting = false;

	let { heroPicture, heroText } = hero.fields;
</script>

<div
	class="relative m-auto flex items-start overflow-hidden align-middle lg:h-[50vh] lg:items-center"
	bind:this={element}
>
	<IntersectionObserver {element} bind:intersecting once>
		{#if intersecting}
			<div class="absolute inset-0 z-0">
				<img
					loading="eager"
					src={heroPicture[0].secure_url}
					alt="TMG Think Tank"
					class="object-cover"
					decoding="async"
				/>
			</div>
			<div class="container z-10">
				<div class="grid min-h-fit grid-cols-1 pb-6 pt-12 md:grid-cols-2 lg:pb-0">
					<div class="flex h-full w-full flex-1 items-start align-middle lg:items-center">
						<div class="m-auto w-1/4 lg:w-1/2">
							<img
								loading="lazy"
								alt="TMG Logo"
								src={logo}
								class="object-cover py-8"
								transition:fly={{ x: -50, duration: 500, delay: 250, easing: cubicInOut }}
							/>
						</div>
					</div>
					<div class="m-auto hidden items-center justify-center lg:flex">
						<div>
							<div
								class="richText text-white"
								transition:fly={{ x: 50, duration: 1000, delay: 250, easing: cubicInOut }}
							>
								{@html renderRichText(heroText)}
							</div>
							<div
								class="mt-6 flex items-center gap-x-6"
								in:fade={{ duration: 1000, delay: 750, easing: cubicInOut }}
							>
								<Button to="/about" colors="white">About us</Button>

								<a
									href="/publications"
									class="text-sm font-semibold leading-6 text-white duration-300 hover:text-gray-300"
									>View our publications <span aria-hidden="true">→</span></a
								>
							</div>
						</div>
					</div>
				</div>
				<div class="m-auto items-center justify-center py-6 lg:hidden">
					<div>
						<div
							class="richText"
							transition:fly={{ x: 50, duration: 1000, delay: 250, easing: cubicInOut }}
						>
							{@html renderRichText(heroText)}
						</div>
						<div
							class="mt-6 flex items-center gap-x-6"
							in:fade={{ duration: 1000, delay: 750, easing: cubicInOut }}
						>
							<Button to="/about" colors="green">About us</Button>

							<a
								href="/publications"
								class="text-sm font-semibold leading-6 duration-300 hover:text-gray-300"
								>View our publications <span aria-hidden="true">→</span></a
							>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</IntersectionObserver>
</div>
