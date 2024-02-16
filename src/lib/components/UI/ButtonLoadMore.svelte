<script lang="ts">
	export let onClick: () => void;
</script>

<button class="w-full" on:click={onClick}>
	<div
		class="focus:shadow-outline group flex items-center justify-around rounded-md border border-green-normal bg-white align-middle text-sm text-green-normal duration-300 hover:bg-green-normal hover:text-white focus:outline-none md:text-base"
	>
		<div class="flex">
			<div class="py-3 pl-3 font-bold leading-snug">
				<slot />
			</div>
		</div>
	</div>
</button>
