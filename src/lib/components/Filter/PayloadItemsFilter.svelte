<!-- PayloadItemsFilter.svelte -->
<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import type { News, Publication } from '$lib/types/payload-types';
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

	let {
		items,
		filterField = 'category',
		allLabel = 'All Publications',
		onFilteredData
	}: Props = $props();

	let filters: string[] = $state([]);
	let programmes: string[] = $state([]);
	let filteredItems = $state([...items]);
	let selectedFilter = $state(allLabel);
	let selectedProgramme = $state('All Programmes');

	onMount(() => {
		initialize();
	});

	function getFieldValue(item: News | Publication, field: string): string {
		// Handle nested field paths like "info.category"
		const fieldParts = field.split('.');
		let value: any = item;

		for (const part of fieldParts) {
			value = value?.[part];
		}

		return value || '';
	}

	function getFilters(items: News[] | Publication[], field: string) {
		let filterItems = items
			.map((item) => {
				return getFieldValue(item, field);
			})
			.filter(Boolean); // Remove empty values

		let uniqueFilters = new Set(filterItems);
		return [allLabel, ...Array.from(uniqueFilters)];
	}

	function getProgrammes(items: News[] | Publication[]) {
		let programmeItems = items
			.map((item) => {
				// For Publications, programme is in info.programme
				// For News, programme is in info.programme
				const programme = item.info?.programme;
				if (typeof programme === 'object' && programme?.title) {
					return programme.title;
				}
				return null;
			})
			.filter((item): item is string => Boolean(item)); // Remove null values with type guard

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
				(item: News | Publication) => getFieldValue(item, filterField) === filterValue
			);
		}
		onFilteredData(filteredItems as News[] | Publication[]);
	}

	function handleProgrammes(programme: string) {
		selectedProgramme = programme;
		if (programme === 'All Programmes') {
			filteredItems = [...items];
		} else {
			filteredItems = items.filter((item: News | Publication) => {
				const itemProgramme = item.info?.programme;
				if (typeof itemProgramme === 'object' && itemProgramme?.title) {
					return itemProgramme.title === programme;
				}
				return false;
			});
		}
		onFilteredData(filteredItems as News[] | Publication[]);
	}

	function initialize() {
		filters = getFilters(items, filterField).map(String);
		programmes = getProgrammes(items);
		filteredItems = [...items];
	}
</script>

<div class="bg-white p-5">
	<h1 class="pb-6 pt-3 text-lg font-bold lg:text-xl">Filter results</h1>

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
							class="cursor-pointer select-none font-medium text-black">{filter}</label
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
						<label for="programme-{index}" class="cursor-pointer select-none font-medium text-black"
							>{programme}</label
						>
					</div>
				</button>
			{/each}
		</AccordionItem>
	</Accordion>
</div>
