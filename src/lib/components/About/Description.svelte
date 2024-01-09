<script lang="ts">
	export let quotePicture: Image | ImageCdn;

	import type { Image, ImageCdn } from '$lib/types/types';
	import logo from '$assets/TMG_logo_white.png';
	import IntersectionObserver from 'svelte-intersection-observer';
	import { fly, fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';

	let element;
	let intersecting = false;

	let imageUrl: string | undefined;
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

<div class="bg-green-normal" bind:this={element}>
	<div class="container pt-32 font-normal text-white lg:pb-16 lg:pt-48 lg:font-semibold">
		<IntersectionObserver {element} bind:intersecting once>
			{#if intersecting}
				<div class="pb-12">
					<div
						class="pb-8 text-3xl font-bold lg:pb-20 lg:text-7xl lg:font-semibold
					"
						transition:fly={{ x: -50, duration: 500, delay: 250, easing: cubicInOut }}
					>
						About Us
					</div>
					<div class="grid grid-cols-1 lg:grid-cols-2">
						<div class="m-auto pb-12 text-base lg:pb-0 lg:text-lg">
							The global community has made major strides in setting goals to limit global warming,
							and achieve sustainable development for all. However, action on these goals is
							insufficient and questions remain on how to achieve them. Through our action-oriented
							research, and with our global and local partners, we explore pathways to deliver on
							these goals.
						</div>
						<div class="ml-auto mr-auto h-1/2 w-1/2 lg:mr-0">
							<img loading="lazy" src={logo} alt="TMG Think Tank" class="" />
						</div>
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
				<div class="">
					We focus on the transformations needed to achieve inclusive and sustainable development.
				</div>
				<div class="mt-5">
					{' '}
					“Politics is the art of turning what is necessary into what is possible”
				</div>
				<div class="font-light lg:font-normal">
					{' '}
					Prof. Klaus Töpfer
				</div>
				<div class="mt-5">
					As a think tank, we see one of our key roles as catalysing such change processes.
				</div>
			</div>
		</div>
	</div>
</div>
