<script lang="ts">
	export let items: Partner[];

	import type { Partner } from '$lib/types/types';
	import { ensureHttps } from '$utils/utils';
</script>

{#each items as item (item.fields.name)}
	<div>
		<a href={ensureHttps(item.fields.url)} target="_blank">
			<p class="pb-2 hover:underline">{item.fields.name}</p>
		</a>
	</div>
{/each}
