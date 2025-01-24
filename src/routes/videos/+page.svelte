<script lang="ts">
	import { run } from 'svelte/legacy';

	import SEO from '$components/SEO/SEO.svelte';
	import SectionHeaderLow from '$components/Layout/SectionHeaderLow.svelte';
	import VideoListing from '$components/Video/VideoListing.svelte';
	import type { Video } from '$lib/types/types';
	interface Props {
		data: Page;
	}

	let { data }: Props = $props();

	type Page = {
		entries: Video[];
	};

	let videos = $state(data.entries);

	run(() => {
		videos = videos.sort((a, b) => {
			const dateA = new Date(a.fields.date);
			const dateB = new Date(b.fields.date);
			return +dateB - +dateA;
		});
	});
</script>

<SEO title="Videos" />

<article>
	<SectionHeaderLow title="Videos" background="bgGradientBR" />
	<div class="container">
		<VideoListing {videos} />
	</div>
</article>
