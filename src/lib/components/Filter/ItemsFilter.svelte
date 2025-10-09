<!-- PublicationFilter.svelte -->

<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import type { News, Publication, Programme, BlogPost } from '$lib/types/types';
	import { Accordion, AccordionItem } from 'flowbite-svelte';
	import { MinusSmIcon, PlusSmIcon } from '@rgossiaux/svelte-heroicons/outline';

	const dispatch = createEventDispatcher<{
		filteredData: News[] | Publication[];
	}>();

	interface Props {
		items: News[] | Publication[];
		filterField?: string;
		allLabel?: string;
		onFilteredData: (items: News[] | Publication[]) => void;
	}

	let { items, filterField = 'category', allLabel = 'All Publications', onFilteredData } = $props();

	let filters: string[] = $state([]);
	let programmes: string[] = $state([]);
	let filteredItems = $state([...items]);
	let selectedFilter = $state(allLabel);
	let selectedProgramme = $state('All Programmes');

	onMount(() => {
		initialize();
	});

	function getFilters(items: News[] | Publication[] | BlogPost[], field: string) {
		let filterItems = items.map((item) => {
			return item.fields[field as keyof typeof item.fields];
		});
		let uniqueFilters = new Set(filterItems);
		return [allLabel, ...Array.from(uniqueFilters)];
	}

	function getProgrammes(items: News[] | Publication[]) {
		let programmeItems = items
			.map((item) => {
				return item.fields.programme?.fields?.title;
			})
			.filter((title) => title !== undefined);
		let uniqueProgrammes = new Set(programmeItems);
		let programmes = Array.from(uniqueProgrammes);
		programmes = ['All Programmes', ...programmes];
		return programmes;
	}

	function handleFilters(filterValue: string) {
		selectedFilter = filterValue;
		if (filterValue === allLabel) {
			filteredItems = [...items];
		} else {
			filteredItems = items.filter(
				(item: News | Publication) =>
					item.fields[filterField as keyof typeof item.fields] === filterValue
			);
		}
		onFilteredData(filteredItems);
	}

	function handleProgrammes(programme: string | Programme) {
		selectedProgramme = programme as string;
		if (programme === 'All Programmes') {
			filteredItems = [...items];
		} else {
			filteredItems = items.filter(
				(item: News | Publication) => item.fields.programme?.fields?.title === programme
			);
		}
		onFilteredData(filteredItems);
	}

	function initialize() {
		filters = getFilters(items, filterField).map(String);
		programmes = getProgrammes(items);
		filteredItems = [...items];
	}
</script>

<div class="bg-white p-5">
	<h1 class="pt-3 pb-6 text-lg font-bold lg:text-xl">Filter results</h1>

	<Accordion flush class="w-full">
		<AccordionItem open tag="div">
			<span slot="header" class="flex text-sm font-bold">Filter by {filterField}</span>
			<div slot="arrowup">
				<MinusSmIcon class="text-blue-normal block h-6 w-6 text-right group-hover:text-black" />
			</div>
			<div slot="arrowdown">
				<PlusSmIcon class="block h-6 w-6 text-right text-gray-400 group-hover:text-gray-500" />
			</div>
			{#each filters as filter, index (filter)}
				<button class="relative flex items-center py-2" onclick={() => handleFilters(filter)}>
					<div class="flex h-5 items-center">
						<input
							id="{filterField}-{index}"
							name="filter"
							type="radio"
							checked={selectedFilter === filter}
							class="text-blue-normal focus:ring-blue-normal h-4 w-4 cursor-pointer"
						/>
					</div>
					<div class="ml-3 min-w-0 text-sm">
						<label
							for="{filterField}-{index}"
							class="cursor-pointer font-medium text-black select-none">{filter}</label
						>
					</div>
				</button>
			{/each}
		</AccordionItem>
	</Accordion>

	<Accordion flush>
		<AccordionItem tag="div">
			<span slot="header" class="text-sm font-bold">Filter by Programmes</span>
			<div slot="arrowup">
				<MinusSmIcon class="text-blue-normal block h-6 w-6 group-hover:text-black" />
			</div>
			<div slot="arrowdown">
				<PlusSmIcon class="block h-6 w-6 text-gray-400 group-hover:text-gray-500" />
			</div>
			{#each programmes as programme, index (index)}
				<button class="relative flex items-center py-2" onclick={() => handleProgrammes(programme)}>
					<div class="flex h-5 items-center">
						<input
							id="programme-{index}"
							name="programme"
							type="radio"
							checked={selectedProgramme === programme}
							class="text-blue-normal focus:ring-blue-normal h-4 w-4 cursor-pointer"
						/>
					</div>
					<div class="ml-3 min-w-0 text-sm">
						<label for="programme-{index}" class="cursor-pointer font-medium text-black select-none"
							>{programme}</label
						>
					</div>
				</button>
			{/each}
		</AccordionItem>
	</Accordion>
</div>
