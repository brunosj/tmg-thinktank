<script lang="ts">
	export let category: string;
	export let links: MenuLink[] = [];

	import type { MenuLink } from '$lib/types/types';
	import { fade } from 'svelte/transition';
	import { Menu, MenuButton, MenuItems, MenuItem } from '@rgossiaux/svelte-headlessui';
	import { ChevronDownIcon } from '@rgossiaux/svelte-heroicons/solid';

	let open = false;

	function togglePopover() {
		open = !open;
	}
</script>

<Menu let:open>
	<MenuButton
		class="group ml-10 inline-flex items-center rounded-md bg-white text-base font-medium text-gray-500 hover:text-black"
		on:click={togglePopover}
	>
		<span>{category}</span>
		<ChevronDownIcon
			class={`${
				open ? ' -rotate-180' : ''
			} ml-2 h-5 w-5  rotate-0 text-gray-400 group-hover:text-gray-500`}
			aria-hidden="true"
		/>
	</MenuButton>

	{#if open}
		<div transition:fade={{ duration: 200 }}>
			<MenuItems
				class="absolute inset-x-0 top-full z-20 hidden transform bg-white shadow-lg md:block"
			>
				<div class="mx-auto mb-6 flex max-w-7xl justify-between gap-y-6">
					{#each links as item, i}
						<MenuItem>
							<a
								href={item.to}
								class="-m-3 flex flex-col justify-between rounded-lg p-3 hover:text-gray-500"
							>
								<div class="flex md:h-full lg:flex-col">
									<div
										class="ml-4 md:flex md:flex-1 md:flex-col md:justify-between lg:ml-0 lg:mt-4"
									>
										<div>
											<p class="text-center text-base font-medium text-gray-500 hover:text-black">
												{item.title}
											</p>
										</div>
									</div>
								</div>
							</a>
						</MenuItem>
					{/each}
				</div>
			</MenuItems>
		</div>
	{/if}
</Menu>
