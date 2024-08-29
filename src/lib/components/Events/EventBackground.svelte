<script lang="ts">
	export let item: Event;

	import type { Event } from '$lib/types/types';
	import { MinusSmIcon, PlusSmIcon } from '@rgossiaux/svelte-heroicons/outline';
	import { Disclosure, DisclosurePanel, DisclosureButton } from '@rgossiaux/svelte-headlessui';
	import { renderRichText } from '$utils/utils';
</script>

<Disclosure let:open class="rounded-md bg-green-variation">
	<div>
		<DisclosureButton class="group relative flex w-full items-center justify-between p-4 text-left">
			<h3 class="">Background</h3>
			<span class="ml-6 flex items-center">
				{#if open}
					<MinusSmIcon
						class="block h-6 w-6 text-green-normal group-hover:text-black"
						aria-hidden="true"
					/>
				{:else}
					<PlusSmIcon
						class="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
						aria-hidden="true"
					/>
				{/if}
			</span>
		</DisclosureButton>
		{#if open}
			<DisclosurePanel class="p-4">
				<div class="richText">
					{@html renderRichText(item.fields.background)}
				</div>
			</DisclosurePanel>
		{/if}
	</div>
</Disclosure>
