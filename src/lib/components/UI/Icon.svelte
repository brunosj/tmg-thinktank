<!-- Icon.svelte -->
<script lang="ts">
	export let icon: any;
	export let label: string;
	export let classes: string = '';
</script>

<span class="sr-only">{label}</span>
{#if icon}
	<svelte:component this={icon} class={classes} />
{/if}
