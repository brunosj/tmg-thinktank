<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		onClick: () => void;
		children?: Snippet;
	}

	let { onClick, children }: Props = $props();
</script>

<button class="w-full" onclick={onClick}>
	<div
		class="focus:shadow-outline border-blue-normal text-blue-normal hover:bg-blue-normal group flex items-center justify-around rounded-md border bg-white align-middle text-sm duration-300 hover:text-white focus:outline-hidden md:text-base"
	>
		<div class="flex">
			<div class="py-3 pl-3 font-bold leading-snug">
				{@render children?.()}
			</div>
		</div>
	</div>
</button>
