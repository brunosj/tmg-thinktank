<script lang="ts">

	import type { Partner } from '$lib/types/types';
	interface Props {
		item: Partner;
	}

	let { item }: Props = $props();

	let image =
		$derived(item.fields.logoCdn?.length > 0
			? item.fields.logoCdn[0].secure_url
			: item.fields.logo.fields.file.url);
</script>

{#if image}
	<a href={item.fields.url} target="_blank">
		<div class="w-32 p-2 lg:w-64 lg:p-5">
			<img loading="lazy" src={image} alt={item.fields.name} class="h-full w-full" />
		</div>
	</a>
{/if}
