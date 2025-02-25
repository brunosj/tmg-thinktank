<script lang="ts">
	import type { ImageCdn } from '$lib/types/types';
	import Gallery from './Gallery.svelte';

	let {
		images = [],
		borderColor = '#333',
		textColor = '#333'
	}: {
		images: ImageCdn[];
		borderColor?: string;
		textColor?: string;
	} = $props();
</script>

<div class="mx-auto py-12">
	<Gallery {images} {borderColor} />
</div>

<style>
	:global(.svelte-lightbox-body img) {
		max-height: 75vh !important;
		width: auto !important;
	}

	:global(.svelte-lightbox-header) {
		margin-bottom: 0.5rem;
	}

	:global(.svelte-lightbox-footer) {
		margin-top: 0.5rem;
		display: none;
	}
</style>
