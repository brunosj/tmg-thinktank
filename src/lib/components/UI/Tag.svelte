<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		to: string;
		textColor?: string;
		children?: Snippet;
	}

	let { to, textColor = 'white', children }: Props = $props();
</script>

<a href={to}>
	<button class="px-2">
		<div
			class="focus:shadow-outline group flex items-center rounded-md align-middle text-sm transition duration-300 ease-in-out focus:outline-hidden"
		>
			<div
				class="bgGradientBR rounded-md px-3 py-1 font-bold leading-snug"
				style="color: {textColor}"
			>
				{@render children?.()}
			</div>
		</div>
	</button>
</a>
