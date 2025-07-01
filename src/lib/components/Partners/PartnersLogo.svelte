<script lang="ts">
	interface Props {
		item: {
			funder?: string | null;
			partner?: string | null;
			authority?: string | null;
			id?: string | null;
		};
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

	// Get the name from any of the available fields
	let name = $derived(item.funder || item.partner || item.authority || '');
</script>

{#if name}
	<div class="{width} {padding} {lgWidth} {lgPadding}">
		<div
			class="flex h-full w-full items-center justify-center rounded bg-gray-100 p-2 text-center text-sm font-medium text-gray-700"
		>
			{name}
		</div>
	</div>
{/if}
