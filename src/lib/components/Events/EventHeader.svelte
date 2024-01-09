<script lang="ts">
	export let item;
</script>

<section class="container border-b border-green-normal">
	<div class="overflow-hidden">
		<h1 class="pb-6 text-base font-bold text-white lg:text-lg">
			<span
				class="rounded-lg bg-gray-900 px-2 py-1 duration-200 ease-in-out group-hover:bg-green-normal"
			>
				{item.fields.type}
			</span>
		</h1>
		<h1 class="pb-6 pt-3 text-2xl font-bold leading-tight text-green-normal lg:text-5xl">
			{item.fields.title}
		</h1>
		<p class="pb-6 text-lg text-black lg:pb-12 lg:text-2xl">
			{item.fields.summary}
		</p>

		{#if item.fields.titleSecondLanguage}
			<h1
				class="pb-6 text-lg font-bold italic leading-tight text-green-normal lg:pb-12 lg:text-3xl"
			>
				{item.fields.titleSecondLanguage}
			</h1>
		{/if}
	</div>
</section>
