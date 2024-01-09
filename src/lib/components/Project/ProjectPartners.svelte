<script lang="ts">
	export let items;

	import { ensureHttps } from '$lib/utils/utils';
</script>

{#each items as item (item.fields.name)}
	<div>
		<a href={ensureHttps(item.fields.url)} target="_blank">
			<p class="pb-2 hover:underline">{item.fields.name}</p>
		</a>
	</div>
{/each}
