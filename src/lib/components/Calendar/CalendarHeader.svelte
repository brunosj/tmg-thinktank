<script lang="ts">
	export let currentMonth;
	export let monthChange;
	export let toggleView;
	export let isListView;

	import { onMount } from 'svelte';
	import { format, addMonths, subMonths } from 'date-fns';

	let monthOptions = [];
	let value;

	let selectedMonth = format(currentMonth, 'yyyy-MM');

	onMount(() => {
		const monthsInPast = 3;
		const monthsInFuture = 6;

		monthOptions = [...Array(monthsInPast + monthsInFuture + 1)].map((_, index) => {
			const monthDate =
				index <= monthsInPast
					? subMonths(currentMonth, monthsInPast - index)
					: addMonths(currentMonth, index - monthsInPast);

			return {
				value: format(monthDate, 'yyyy-MM'),
				label: format(monthDate, 'MMMM yyyy')
			};
		});
	});
</script>

<div class="mb-4 flex items-center justify-between">
	<select bind:value={selectedMonth} on:change={() => monthChange({ detail: selectedMonth })}>
		{#each monthOptions as { value, label }}
			<option {value}>{label}</option>
		{/each}
	</select>
	<button
		on:click={toggleView}
		class="hidden rounded bg-green-normal px-4 py-2 font-bold text-white md:block"
	>
		{#if isListView}
			Month view
		{:else}
			List view
		{/if}
	</button>
</div>
