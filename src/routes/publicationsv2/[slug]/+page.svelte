<script lang="ts">
	export let data: Page;

	import type { News } from '$lib/types/types';
	import PublicationNewsEntry from '$components/News/PublicationNewsEntry.svelte';

	type Page = {
		item: News;
	};

	let item: News;

	$: item = data.item;
</script>

<PublicationNewsEntry {item} />
