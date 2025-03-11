<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		hasBorder?: boolean;
		extraClasses?: string;
		children?: Snippet;
	}

	let { title, hasBorder = true, extraClasses = '', children } = $props();

	const sectionClass = `${hasBorder ? 'pb-6 border-t border-gray-300' : ''} ${extraClasses}`;
</script>

<section class={sectionClass}>
	<div class="pt-6 text-xl font-semibold lg:text-2xl">{title}</div>
	{#if children}
		{@render children()}
	{/if}
</section>
