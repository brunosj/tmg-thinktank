<script lang="ts">
	export let to: string;
	export let textColor = 'white';
</script>

<a href={to}>
	<button class="px-2">
		<div
			class="focus:shadow-outline group flex items-center rounded-lg align-middle text-sm transition duration-300 ease-in-out focus:outline-none"
		>
			<div
				class="rounded-lg bg-green-normal px-3 py-1 font-bold leading-snug"
				style="color: {textColor}"
			>
				<slot />
			</div>
		</div>
	</button>
</a>
