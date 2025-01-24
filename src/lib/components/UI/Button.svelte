<script lang="ts">
	interface Props {
		to?: string;
		colors: 'green' | 'white';
		submit?: boolean;
		children?: import('svelte').Snippet;
	}

	let {
		to = '',
		colors,
		submit = false,
		children
	}: Props = $props();
</script>

<a
	href={to}
	target={to.includes('http') ? '_blank' : ''}
	rel={to.includes('http') ? 'noopener noreferrer' : ''}
>
	<button
		class={colors === 'green'
			? 'rounded-md bg-green-normal px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm duration-300 hover:bg-opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-normal'
			: 'rounded-md border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-green-normal shadow-sm duration-300 hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-normal'}
		type={submit === true ? 'submit' : 'button'}
	>
		{@render children?.()}
	</button>
</a>

