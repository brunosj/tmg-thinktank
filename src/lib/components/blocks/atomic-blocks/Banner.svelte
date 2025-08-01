<script lang="ts">
	import BannerVideo from './banners/BannerVideo.svelte';
	import BannerPublication from './banners/BannerPublication.svelte';
	import BannerGeneric from './banners/BannerGeneric.svelte';
	import type { BannerBlock } from '$types/payload-types';

	interface Props {
		block: BannerBlock;
		reportColors?: {
			primary?: string | null;
			primaryLight?: string | null;
			secondary?: string | null;
			secondaryLight?: string | null;
			tertiary?: string | null;
			tertiaryLight?: string | null;
		};
	}

	let { block, reportColors }: Props = $props();

	// Extract content type
	let contentType = $derived(block.contentType);
</script>

<!-- Route to appropriate banner component based on content type -->
{#if contentType === 'video'}
	<BannerVideo {block} {reportColors} />
{:else if contentType === 'publication'}
	<BannerPublication {block} {reportColors} />
{:else}
	<BannerGeneric {block} {reportColors} />
{/if}
