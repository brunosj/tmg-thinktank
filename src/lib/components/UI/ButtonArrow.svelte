<script lang="ts">
	export let to: string;
	export let color: string;
	export let textColor: string;
	export let arrowDirection: string = 'right';

	import { ArrowLeftIcon, ArrowRightIcon } from '@rgossiaux/svelte-heroicons/outline';
</script>

<a href={to}>
	<div class="py-2">
		<div
			class="group flex items-center rounded-md border border-transparent align-middle text-xs text-black transition duration-150 ease-in-out focus:outline-none md:text-base"
			style="background-color: {color}"
		>
			{#if arrowDirection === 'right'}
				<ArrowRightIcon
					class="duration-750 block h-6  w-6 transform transition ease-in-out group-hover:-translate-x-1 "
					style="color: {textColor}"
				/>
			{:else}
				<ArrowLeftIcon
					class="duration-750 block h-6  w-6 transform transition ease-in-out group-hover:-translate-x-1 "
					style="color: {textColor}"
				/>
			{/if}

			<div
				class="py-1 pl-0 pr-3 font-bold leading-snug md:py-3 md:pl-2 md:pr-5"
				style="color: {textColor}"
			>
				<slot />
			</div>
		</div>
	</div>
</a>
