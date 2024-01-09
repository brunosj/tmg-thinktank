<!-- PublicationFilter.svelte -->

<script>
	import { onMount } from 'svelte';
	import { parseISO } from 'date-fns';
	import { Disclosure, DisclosurePanel, DisclosureButton } from '@rgossiaux/svelte-headlessui';
	import { MinusSmIcon, PlusSmIcon } from '@rgossiaux/svelte-heroicons/outline';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let items;
	export let filterField = 'category'; // Default to category
	export let allLabel = 'All Publications'; // Default label

	let filters = [];
	let programmes = [];
	let filteredItems = [];

	onMount(() => {
		initialize();
	});

	function getFilters(items, field) {
		let filterItems = items.map((item) => {
			return item.fields[field];
		});
		let uniqueFilters = new Set(filterItems);
		return [allLabel, ...Array.from(uniqueFilters)];
	}

	function getProgrammes(items) {
		let programmeItems = items.map((item) => {
			return item.fields.programme.fields.title;
		});
		let uniqueProgrammes = new Set(programmeItems);
		let programmes = Array.from(uniqueProgrammes);
		programmes = ['All Programmes', ...programmes];
		return programmes;
	}

	function handleFilters(filterField, filterValue) {
		if (filterValue === allLabel) {
			filteredItems = [...items];
		} else {
			filteredItems = [...items.filter((item) => item.fields[filterField] === filterValue)];
		}
		dispatch('filteredData', filteredItems);
	}

	function handleProgrammes(programme) {
		if (programme === 'All Programmes') {
			filteredItems = [...items];
		} else {
			filteredItems = [...items.filter((item) => item.fields.programme.fields.title === programme)];
		}
		dispatch('filteredData', filteredItems);
	}

	function initialize() {
		filters = getFilters(items, filterField);
		programmes = getProgrammes(items);
		filteredItems = [...items];
	}
</script>

<div>
	<div class="bg-white p-5">
		<h1 class="pb-6 pt-3 text-lg font-bold lg:text-xl">Filter results</h1>

		<div class="divide-y divide-gray-200 border-t">
			<Disclosure let:open defaultOpen>
				<div>
					<h3>
						<DisclosureButton
							class="group relative flex w-full items-center justify-between pb-6 pt-3 text-left"
						>
							<span class="text-sm font-medium">Filter by {filterField}</span>
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
					</h3>
					<DisclosurePanel class="prose prose-sm pb-6">
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						{#each filters as filter, index (filter)}
							<div
								class="relative flex items-center py-2"
								on:click={() => handleFilters(filterField, filter)}
								key={index}
							>
								<div class="flex h-5 items-center">
									<input
										id="{filterField}-{index}"
										name="filter"
										type="radio"
										defaultChecked={index === null}
										class="h-4 w-4 cursor-pointer border-gray-300 text-green-normal focus:ring-green-normal"
									/>
								</div>
								<div class="ml-3 min-w-0 text-sm">
									<label
										for="{filterField}-{index}"
										class="cursor-pointer select-none font-medium text-gray-700">{filter}</label
									>
								</div>
							</div>
						{/each}
					</DisclosurePanel>
				</div>
			</Disclosure>
		</div>

		<!-- Filter by Programmes section -->
		<div class="divide-y divide-gray-200 border-t">
			<Disclosure let:open>
				<div>
					<h3>
						<DisclosureButton
							class="group relative flex w-full items-center justify-between pb-6 pt-3 text-left"
						>
							<span class="text-sm font-medium">Filter by Programmes</span>
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
					</h3>
					<DisclosurePanel class="prose prose-sm pb-6">
						{#each programmes as programme, index}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<div
								class="relative flex items-center py-2"
								on:click={() => handleProgrammes(programme)}
								key={index}
							>
								<div class="flex h-5 items-center">
									<input
										id="programme-{index}"
										name="programme"
										type="radio"
										defaultChecked={index === null}
										class="h-4 w-4 cursor-pointer border-gray-300 text-green-normal focus:ring-green-normal"
									/>
								</div>
								<div class="ml-3 min-w-0 text-sm">
									<label
										for="programme-{index}"
										class="cursor-pointer select-none font-medium text-gray-700">{programme}</label
									>
								</div>
							</div>
						{/each}
					</DisclosurePanel>
				</div>
			</Disclosure>
		</div>
	</div>
</div>
