<script lang="ts">
	export let data;
	import SEO from '$components/SEO/SEO.svelte';
	import { parseISO } from 'date-fns';
	import SectionHeaderLow from '$components/Layout/SectionHeaderLow.svelte';
	import VideoListing from '$components/Video/VideoListing.svelte';

	let videos = data.entries;

	$: {
		videos = videos.sort((a, b) => {
			const dateA = parseISO(a.fields.date);
			const dateB = parseISO(b.fields.date);
			return dateB - dateA;
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
