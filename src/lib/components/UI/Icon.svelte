<!-- Icon.svelte -->
<script lang="ts">
	export let icon;
	export let label;
	export let classes;
</script>

<span class="sr-only">{label}</span>
{#if icon}
	<svelte:component this={icon} class={classes} />
{/if}
