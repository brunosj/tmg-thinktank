<script lang="ts">

	import { MinusSmIcon, PlusSmIcon } from '@rgossiaux/svelte-heroicons/outline';
	import { Disclosure, DisclosurePanel, DisclosureButton } from '@rgossiaux/svelte-headlessui';
	interface Props {
		heading: string;
		children?: import('svelte').Snippet;
	}

	let { heading, children }: Props = $props();

	const children_render = $derived(children);
</script>

<Disclosure defaultOpen  class="text-white">
	{#snippet children({ open })}
		<div>
			<DisclosureButton
				class="bgGradientBR group relative flex w-full items-center justify-between rounded-md p-4 text-left"
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
					{@render children_render?.()}
				</DisclosurePanel>
			{/if}
		</div>
	{/snippet}
</Disclosure>
