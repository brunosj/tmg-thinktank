<script lang="ts">
	export let currentMonth: Date;
	export let monthChange: (event: CustomEvent<string>) => void;
	export let toggleView: () => void;
	export let isListView: boolean;

	import { onMount } from 'svelte';

	let monthOptions: { value: string; label: string }[] = [];
	let selectedMonth: string;

	onMount(() => {
		const currentDate = new Date();

		currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

		const monthsInPast = 3;
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
		on:change={() => monthChange(new CustomEvent('change', { detail: selectedMonth }))}
	>
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
