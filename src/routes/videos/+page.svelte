<script lang="ts">
	import { run } from 'svelte/legacy';

	import SEO from '$components/SEO/SEO.svelte';
	import SectionHeaderLow from '$components/Layout/SectionHeaderLow.svelte';
	import VideoListing from '$components/Video/VideoListing.svelte';
	import type { Video, VideosPage } from '$lib/types/payload-types';
	interface Props {
		data: Page;
	}

	let { data }: Props = $props();

	type Page = {
		entries: Video[];
		pageData: VideosPage | null;
	};

	let videos = $state(data.entries);
	let pageData = data.pageData;

	run(() => {
		videos = videos.sort((a, b) => {
			const dateA = new Date(a.date || '1970-01-01');
			const dateB = new Date(b.date || '1970-01-01');
			return +dateB - +dateA;
		});
	});
</script>

<SEO
	title={pageData?.meta?.title || pageData?.title || 'Videos'}
	description={pageData?.meta?.description || 'Videos from TMG and its partners'}
	image={pageData?.meta?.image && typeof pageData.meta.image === 'object'
		? pageData.meta.image.url || 'https://tmg-thinktank.com/tmg-seo.jpg'
		: 'https://tmg-thinktank.com/tmg-seo.jpg'}
/>

<article>
	<SectionHeaderLow title={pageData?.title || 'Videos'} background="bgGradientBR" />
	<div class="layout">
		<VideoListing {videos} />
	</div>
</article>
