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
		let programmeItems = items.map((item) => {
			return item.fields.programme.fields.title;
		});
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
				(item: News | Publication) => item.fields.programme.fields.title === programme
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

<div>
	<div class="bg-white p-5">
		<h1 class="pb-6 pt-3 text-lg font-bold lg:text-xl">Filter results</h1>

		<div class="w-full">
			<Accordion flush class="w-full bg-white">
				<AccordionItem activeClass="bg-white ">
					<span slot="header" class="text-sm font-medium">Filter by {filterField}</span>
					<div slot="arrowup">
						<MinusSmIcon class="block h-6 w-6 text-green-normal group-hover:text-black" />
					</div>
					<div slot="arrowdown">
						<PlusSmIcon class="block h-6 w-6 text-gray-400 group-hover:text-gray-500" />
					</div>
					{#each filters as filter, index (filter)}
						<button class="relative flex items-center py-2" onclick={() => handleFilters(filter)}>
							<div class="flex h-5 items-center">
								<input
									id="{filterField}-{index}"
									name="filter"
									type="radio"
									checked={selectedFilter === filter}
									class="h-4 w-4 cursor-pointer text-green-normal focus:ring-green-normal"
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
		</div>

		<div class="">
			<Accordion flush class="w-full  bg-white" activeClass="bg-white">
				<AccordionItem activeClass="bg-white ">
					<span slot="header" class="text-sm font-medium">Filter by Programmes</span>
					<div slot="arrowup">
						<MinusSmIcon class="block h-6 w-6 text-green-normal group-hover:text-black" />
					</div>
					<div slot="arrowdown">
						<PlusSmIcon class="block h-6 w-6 text-gray-400 group-hover:text-gray-500" />
					</div>
					{#each programmes as programme, index (index)}
						<button
							class="relative flex items-center py-2"
							onclick={() => handleProgrammes(programme)}
						>
							<div class="flex h-5 items-center">
								<input
									id="programme-{index}"
									name="programme"
									type="radio"
									checked={selectedProgramme === programme}
									class="h-4 w-4 cursor-pointer text-green-normal focus:ring-green-normal"
								/>
							</div>
							<div class="ml-3 min-w-0 text-sm">
								<label
									for="programme-{index}"
									class="cursor-pointer select-none font-medium text-black">{programme}</label
								>
							</div>
						</button>
					{/each}
				</AccordionItem>
			</Accordion>
		</div>
	</div>
</div>
