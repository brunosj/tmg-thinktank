<script lang="ts">

	import type { News } from '$lib/types/types';
	import PublicationNewsEntry from '$components/News/PublicationNewsEntry.svelte';
	interface Props {
		data: Page;
	}

	let { data }: Props = $props();

	type Page = {
		item: News;
	};

	let item: News = $derived(data.item);

	
</script>

<PublicationNewsEntry {item} />
