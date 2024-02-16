<script lang="ts">
	export let item: Project;

	import type { Project } from '$lib/types/types';
	import ProjectPartners from '$components/Project/ProjectPartners.svelte';
</script>

<div class="grid grid-cols-1 gap-x-10 gap-y-0 py-6 lg:grid-cols-2 lg:gap-y-3">
	{#if item.fields.name}
		<div class="lg:col-span-1">
			<div class="">
				<div class="border-b-2 border-gray-900">
					<div class="text-large pb-3 pt-5 text-left font-semibold uppercase text-black">
						Project Name
					</div>
				</div>
			</div>
			<div class="py-5 text-sm font-normal text-black">
				{item.fields.name}
			</div>
		</div>
	{/if}

	{#if item.fields.year}
		<div class="col-span-1">
			<div class="">
				<div class="border-b-2 border-gray-900">
					<div class="text-large pb-3 pt-5 text-left font-semibold uppercase text-black">
						Duration
					</div>
				</div>
			</div>
			<div class="py-5 text-sm font-normal text-black">
				{item.fields.year}
			</div>
		</div>
	{/if}

	{#if item.fields.partnersList}
		<div class="lg:col-span-1">
			<div class="">
				<div class="border-b-2 border-gray-900">
					<div class="text-large pb-3 pt-5 text-left font-semibold uppercase text-black">
						Partners
					</div>
				</div>
			</div>
			<div class="py-5 text-sm font-normal text-black">
				<ProjectPartners items={item.fields.partnersList} />
			</div>
		</div>
	{/if}

	{#if item.fields.fundersList}
		<div class="lg:col-span-1">
			<div class="">
				<div class="border-b-2 border-gray-900">
					<div class="text-large pb-3 pt-5 text-left font-semibold uppercase text-black">
						Funders
					</div>
				</div>
			</div>
			<div class="pb-3 pt-5 text-sm font-normal text-black">
				<ProjectPartners items={item.fields.fundersList} />
			</div>
		</div>
	{/if}
</div>
