<script lang="ts">
	export let to: string = '';
	export let colors: 'green' | 'white';
	export let submit: boolean = false;
</script>

<a href={to}>
	<button
		class={colors === 'green'
			? 'rounded-md bg-green-normal px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm duration-300 hover:bg-opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-normal'
			: 'rounded-md border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-green-normal shadow-sm duration-300 hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-normal'}
		type={submit === true ? 'submit' : 'button'}
	>
		<slot />
	</button>
</a>
