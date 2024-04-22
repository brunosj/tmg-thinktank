<script lang="ts">
	export let data: Page;
	import SEO from '$components/SEO/SEO.svelte';
	import SectionHeaderLow from '$components/Layout/SectionHeaderLow.svelte';
	import VideoListing from '$components/Video/VideoListing.svelte';
	import type { Video } from '$lib/types/types';

	type Page = {
		entries: Video[];
	};

	let videos = data.entries;

	$: {
		videos = videos.sort((a, b) => {
			const dateA = new Date(a.fields.date);
			const dateB = new Date(b.fields.date);
			return +dateB - +dateA;
		});
	}
</script>

<SEO title="Videos" />

<article>
	<SectionHeaderLow title="Videos" background="bg-green-normal" />
	<div class="container">
		<VideoListing {videos} />
	</div>
</article>
