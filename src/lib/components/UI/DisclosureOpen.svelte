<script lang="ts">
	export let heading;

	import { MinusSmIcon, PlusSmIcon } from '@rgossiaux/svelte-heroicons/outline';
	import { Disclosure, DisclosurePanel, DisclosureButton } from '@rgossiaux/svelte-headlessui';
</script>

<Disclosure defaultOpen let:open class="text-white">
	<div>
		<DisclosureButton
			class="group relative flex w-full items-center justify-between rounded-lg bg-green-normal p-4 text-left"
		>
			<h3 class="">{heading}</h3>
			<span class="ml-6 flex items-center">
				{#if open}
					<MinusSmIcon class="block h-6 w-6  group-hover:text-green-variation" aria-hidden="true" />
				{:else}
					<PlusSmIcon class="block h-6 w-6  group-hover:text-green-variation" aria-hidden="true" />
				{/if}
			</span>
		</DisclosureButton>
		{#if open}
			<DisclosurePanel class="p-4">
				<slot />
			</DisclosurePanel>
		{/if}
	</div>
</Disclosure>
