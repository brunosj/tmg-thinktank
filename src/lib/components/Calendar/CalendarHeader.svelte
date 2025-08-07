<script lang="ts">
	import type { CalendarEvent } from '$lib/types/types';

	import { onMount } from 'svelte';
	interface Props {
		items: CalendarEvent[];
		currentMonth: Date;
		monthChange: (event: CustomEvent<string>) => void;
		toggleView: () => void;
		isListView: boolean;
	}

	let {
		items,
		currentMonth = $bindable(),
		monthChange,
		toggleView,
		isListView = $bindable()
	}: Props = $props();

	let monthOptions: { value: string; label: string }[] = $state([]);
	let selectedMonth: string = $state('');

	// Watch for currentMonth changes from parent
	$effect(() => {
		if (currentMonth) {
			selectedMonth = `${currentMonth.getFullYear()}-${('0' + (currentMonth.getMonth() + 1)).slice(-2)}-01`;
		}
	});

	onMount(() => {
		// Generate month options without setting currentMonth
		// Generate all options in one go, without reactivity
		const options: { value: string; label: string }[] = [];

		// Add 24 months starting from current date for adequate range
		const today = new Date();
		const startYear = today.getFullYear();
		const startMonth = today.getMonth();

		for (let i = 0; i < 24; i++) {
			const monthDate = new Date(startYear, startMonth + i, 1);
			options.push({
				value: `${monthDate.getFullYear()}-${('0' + (monthDate.getMonth() + 1)).slice(-2)}-01`,
				label: `${monthDate.toLocaleString('en-GB', { month: 'long' })} ${monthDate.getFullYear()}`
			});
		}

		// Sort and set the options
		monthOptions = options.sort((a, b) => a.value.localeCompare(b.value));

		// Set the selected month value based on current month
		if (currentMonth) {
			selectedMonth = `${currentMonth.getFullYear()}-${('0' + (currentMonth.getMonth() + 1)).slice(-2)}-01`;
		}
	});
</script>

<div class="mb-4 flex items-center justify-between">
	<select
		bind:value={selectedMonth}
		onchange={() => monthChange(new CustomEvent('change', { detail: selectedMonth }))}
	>
		{#each monthOptions as { value, label }}
			<option {value}>{label}</option>
		{/each}
	</select>
	<button
		onclick={toggleView}
		class="bgGradientBR hidden rounded-sm px-4 py-2 font-bold text-white md:block"
	>
		{#if isListView}
			Month view
		{:else}
			List view
		{/if}
	</button>
</div>
