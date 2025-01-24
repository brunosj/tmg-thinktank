<!-- Icon.svelte -->
<script lang="ts">
	interface Props {
		icon: any;
		label: string;
		classes?: string;
	}

	let { icon, label, classes = '' }: Props = $props();
</script>

<span class="sr-only">{label}</span>
{#if icon}
	{@const SvelteComponent = icon}
	<SvelteComponent class={classes} />
{/if}
