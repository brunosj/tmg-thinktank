<script lang="ts">
	let {
		title,
		color = '#333',
		marginBottom = 'mb-6'
	}: {
		title: string;
		color?: string;
		marginBottom?: string;
	} = $props();
</script>

<div class={`${marginBottom} flex items-center`}>
	<div class="mr-3 h-5 w-1.5 rounded-sm" style="background-color: {color}"></div>
	<h3 class="font-heading text-lg font-semibold tracking-wide text-gray-800 lg:text-2xl">
		{title}
	</h3>
</div>
