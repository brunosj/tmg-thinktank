<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		to?: string;
		colors: 'green' | 'white' | 'blue' | 'blue-invert';
		submit?: boolean;
		children?: Snippet;
		disabled?: boolean;
	}

	let { to = '', colors, submit = false, children, disabled = false }: Props = $props();
</script>

{#if to}
	<a
		href={to}
		target={to.includes('http') ? '_blank' : ''}
		rel={to.includes('http') ? 'noopener noreferrer' : ''}
	>
		<button
			class={colors === 'green'
				? 'rounded-md bg-blue-normal px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm duration-300 hover:bg-opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-normal lg:text-base'
				: colors === 'blue'
					? 'rounded-md bg-navyBlue px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm duration-300 hover:bg-opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navyBlue lg:text-base'
					: colors === 'blue-invert'
						? 'rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-navyBlue shadow-sm duration-300 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navyBlue lg:text-base'
						: 'rounded-md border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-blue-normal shadow-sm duration-300 hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-normal lg:text-base'}
			type={submit === true ? 'submit' : 'button'}
			{disabled}
		>
			{@render children?.()}
		</button>
	</a>
{:else}
	<button
		class={colors === 'green'
			? 'rounded-md bg-blue-normal px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm duration-300 hover:bg-opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-normal lg:text-base'
			: colors === 'blue'
				? 'rounded-md bg-navyBlue px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm duration-300 hover:bg-opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navyBlue lg:text-base'
				: colors === 'blue-invert'
					? 'rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-navyBlue shadow-sm duration-300 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navyBlue lg:text-base'
					: 'rounded-md border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-blue-normal shadow-sm duration-300 hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-normal lg:text-base'}
		type={submit === true ? 'submit' : 'button'}
		{disabled}
	>
		{@render children?.()}
	</button>
{/if}
