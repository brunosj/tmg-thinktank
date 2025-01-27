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

	let { items, currentMonth = $bindable(), monthChange, toggleView, isListView }: Props = $props();

	let monthOptions: { value: string; label: string }[] = $state([]);
	let selectedMonth: string = $state('');

	onMount(() => {
		if (items.length > 0) {
			const earliestEvent = items.reduce((earliest, event) => {
				return event.start < earliest.start ? event : earliest;
			}, items[0]);

			currentMonth = new Date(earliestEvent.start.getFullYear(), earliestEvent.start.getMonth(), 1);
		} else {
			const currentDate = new Date();
			currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
		}

		const monthsInPast = 0;
		const monthsInFuture = 6;

		monthOptions = [...Array(monthsInPast + monthsInFuture)].map((_, index) => {
			const year = currentMonth.getFullYear();
			const month = currentMonth.getMonth() + index - monthsInPast;
			const monthDate = new Date(year, month, 1);

			return {
				value: `${year}-${('0' + (month + 1)).slice(-2)}-01`,
				label: `${monthDate.toLocaleString('en-US', { month: 'long' })} ${year}`
			};
		});

		selectedMonth = `${currentMonth.getFullYear()}-${('0' + (currentMonth.getMonth() + 1)).slice(-2)}-01`;
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
		class="bgGradientBR hidden rounded px-4 py-2 font-bold text-white md:block"
	>
		{#if isListView}
			Month view
		{:else}
			List view
		{/if}
	</button>
</div>
