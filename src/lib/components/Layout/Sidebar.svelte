<script lang="ts">
	import type { Programme } from '$lib/types/types';
	import { headerMenu } from '$data/menu.js';
	import { fly, fade } from 'svelte/transition';
	import { generateProgrammeLinks } from '$utils/utils';
	import { XIcon, ArrowDownIcon } from '@rgossiaux/svelte-heroicons/outline';

	interface Props {
		sidebarHidden?: boolean;
		programmes: Programme[];
	}

	let { sidebarHidden = $bindable(true), programmes }: Props = $props();

	// Track which dropdowns are open
	let openDropdowns = $state(new Set<string>(['programmes', 'Outreach']));

	const programmeLinks = generateProgrammeLinks(programmes);

	const toggleDropdown = (category: string) => {
		const newOpenDropdowns = new Set(openDropdowns);
		if (newOpenDropdowns.has(category)) {
			newOpenDropdowns.delete(category);
		} else {
			newOpenDropdowns.add(category);
		}
		openDropdowns = newOpenDropdowns;
	};

	const closeSidebar = () => {
		sidebarHidden = true;
		// Reset dropdowns when closing sidebar
		openDropdowns = new Set();
	};
</script>

<!-- Backdrop -->
{#if !sidebarHidden}
	<div
		class="fixed inset-0 z-40 bg-black/50"
		onclick={closeSidebar}
		transition:fade={{ duration: 200 }}
	/>
{/if}

<!-- Sidebar -->
{#if !sidebarHidden}
	<aside
		class="fixed top-0 right-0 z-50 h-full w-[85%] bg-white shadow-xl md:w-[50%] lg:w-[30%]"
		transition:fly={{ x: 320, duration: 200 }}
	>
		<div class="flex h-full flex-col">
			<!-- Header -->
			<div class="flex items-center justify-between border-b border-gray-200 p-4">
				<!-- <h2 class="text-lg font-semibold text-gray-900">Menu</h2> -->
				<button
					type="button"
					aria-label="Close menu"
					onclick={closeSidebar}
					class="ml-auto rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
				>
					<XIcon class="h-6 w-6" />
				</button>
			</div>

			<!-- Content -->
			<div class="flex-1 overflow-y-auto p-4">
				<nav class="space-y-4">
					<!-- Programmes Section -->
					<div class="space-y-2">
						<button
							type="button"
							onclick={() => toggleDropdown('programmes')}
							class="text-blue-normal hover:bg-blue-light flex w-full items-center justify-between rounded-md p-3 text-left text-lg font-semibold transition-colors"
						>
							<span>Programmes</span>
							<ArrowDownIcon
								class="h-5 w-5 transition-transform duration-200 {openDropdowns.has('programmes')
									? 'rotate-180'
									: ''}"
							/>
						</button>
						{#if openDropdowns.has('programmes')}
							<div transition:fly={{ y: -10, duration: 150 }}>
								<ul class="space-y-1 pl-4">
									{#each programmeLinks as programme}
										<li>
											<a
												href={programme.to}
												onclick={closeSidebar}
												class="block rounded-md p-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
											>
												{programme.title}
											</a>
										</li>
									{/each}
								</ul>
							</div>
						{/if}
					</div>

					<!-- Other Menu Categories -->
					{#each headerMenu as category, i}
						<div class="space-y-2">
							<button
								type="button"
								onclick={() => toggleDropdown(category.category)}
								class="text-blue-normal hover:bg-blue-light flex w-full items-center justify-between rounded-md p-3 text-left text-lg font-semibold transition-colors"
							>
								<span>{category.category}</span>
								<ArrowDownIcon
									class="h-5 w-5 transition-transform duration-200 {openDropdowns.has(
										category.category
									)
										? 'rotate-180'
										: ''}"
								/>
							</button>
							{#if openDropdowns.has(category.category)}
								<div transition:fly={{ y: -10, duration: 150 }}>
									<ul class="space-y-1 pl-4">
										{#each category.links as link}
											<li>
												<a
													href={link.to}
													onclick={closeSidebar}
													class="block rounded-md p-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
												>
													{link.title}
												</a>
											</li>
										{/each}
									</ul>
								</div>
							{/if}
						</div>
					{/each}
				</nav>
			</div>
		</div>
	</aside>
{/if}
