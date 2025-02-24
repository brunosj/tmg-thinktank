<script lang="ts">
	import type { Image, ImageCdn } from '$lib/types/types';
	import logo from '$assets/TMG_logo_white.png';
	import IntersectionObserver from 'svelte-intersection-observer';
	import { fly, fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { renderRichText } from '$utils/utils';

	interface Props {
		quotePicture: Image | ImageCdn;
		quoteAuthor: string;
		quote: string;
		description: string;
		title: string;
	}

	let { title, quoteAuthor, quote, description, quotePicture }: Props = $props();

	let element = $state<HTMLElement | null>(null);
	let intersecting = $state(false);

	let imageUrl: string | undefined = $state();
	if (
		'fields' in quotePicture &&
		'file' in quotePicture.fields &&
		'url' in quotePicture.fields.file
	) {
		imageUrl = quotePicture.fields.file.url;
	} else if ('secure_url' in quotePicture) {
		imageUrl = quotePicture.secure_url;
	}
</script>

<div class="bgGradientBR" bind:this={element}>
	<div class="layout pt-32 font-normal text-white lg:pb-16 lg:pt-48">
		<IntersectionObserver {element} bind:intersecting once>
			{#if intersecting}
				<div class="pb-12">
					<div
						class="pb-8 text-3xl font-bold lg:pb-20 lg:text-7xl
					"
						transition:fly={{ x: -50, duration: 500, delay: 250, easing: cubicInOut }}
					>
						{title}
					</div>
					<div class="grid grid-cols-1 lg:grid-cols-2">
						<div class="richText m-auto pb-12 text-base lg:pb-0 lg:text-lg">
							{@html renderRichText(description)}
						</div>
						<!-- <div class="ml-auto mr-auto h-1/2 w-1/2 lg:mr-0">
							<img loading="lazy" src={logo} alt="TMG Think Tank" class="" />
						</div> -->
					</div>
				</div>
			{/if}
		</IntersectionObserver>
		<div class="grid grid-cols-1 border-b border-t py-8 lg:grid-cols-3">
			<div class="m-auto pb-8 align-middle lg:pb-0">
				<div class="flex-col lg:pb-0">
					<img
						loading="lazy"
						src={imageUrl}
						alt="Klaus Toepfer"
						class="h-24 w-24 lg:h-48 lg:w-48"
					/>
				</div>
			</div>
			<div class="col-span-2 m-auto text-base lg:text-lg">
				<div class="mt-5">
					{quote}
				</div>
				<div class="font-light lg:font-normal">
					{quoteAuthor}
				</div>
			</div>
		</div>
	</div>
</div>
