<script lang="ts">
	interface Props {
		title: string;
		subtitle?: string;
	}

	let { title, subtitle = '' }: Props = $props();
</script>

<section>
	<div class="pb-6 lg:pb-16">
		<h1
			class="col-span-2 text-left text-4xl font-bold leading-none text-white md:text-6xl lg:text-7xl"
		>
			{title}
		</h1>
		<h1
			class="mt-4 w-full text-left text-lg font-normal leading-normal tracking-wide text-white md:text-xl lg:w-2/3"
		>
			{subtitle}
		</h1>
	</div>
</section>
