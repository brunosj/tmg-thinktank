<script lang="ts">
	import type { Partner } from '$lib/types/types';
	interface Props {
		item: Partner;
		width?: string;
		lgWidth?: string;
		padding?: string;
		lgPadding?: string;
	}

	let {
		item,
		width = 'w-32',
		lgWidth = 'lg:w-64',
		padding = 'p-2',
		lgPadding = 'lg:p-5'
	}: Props = $props();

	// if item if network use image like this, otherwise use field
	let image = $derived(
		item.fields.logoCdn?.length > 0
			? item.fields.logoCdn[0].secure_url
			: item.fields.logo.fields.file.url
	);
</script>

{#if image !== null}
	<a href={item.fields.url} target="_blank">
		<div class="{width} {padding} {lgWidth} {lgPadding}">
			<img loading="lazy" src={image} alt={item.fields.name} class="h-full w-full" />
		</div>
	</a>
{/if}
