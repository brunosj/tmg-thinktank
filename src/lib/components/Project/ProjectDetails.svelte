<script lang="ts">
	import type { Project } from '$lib/types/types';
	import ProjectPartners from '$components/Project/ProjectPartners.svelte';
	interface Props {
		item: Project;
	}
	import { ensureHttps } from '$utils/utils';

	let { item }: Props = $props();
</script>

<div class="space-y-6">
	{#if item.fields.name}
		<div class="space-y-2 text-sm">
			<div class="">
				<div class="border-b border-gray-900 pb-1">
					<div class=" text-left font-semibold text-black">Project Name</div>
				</div>
			</div>
			<div class=" font-normal text-black">
				{item.fields.name}
			</div>
		</div>
	{/if}

	{#if item.fields.year}
		<div class="space-y-2 text-sm">
			<div class="">
				<div class="border-b border-gray-900 pb-1">
					<div class=" text-left font-semibold text-black">Duration</div>
				</div>
			</div>
			<div class=" font-normal text-black">
				{item.fields.year}
			</div>
		</div>
	{/if}

	{#if item.fields.partnersList}
		<div class="space-y-2 text-sm">
			<div class="">
				<div class="border-b border-gray-900 pb-1">
					<div class=" text-left font-semibold text-black">
						{item.fields.partnersList.length > 1 ? 'Partners' : 'Partner'}
					</div>
				</div>
			</div>
			<div class="font-normal text-black">
				{#each item.fields.partnersList as partner (partner.fields.name)}
					<div>
						<a href={ensureHttps(partner.fields.url)} target="_blank" class="inline-block">
							<p class="text-sm duration-300 ease-in-out hover:underline">{partner.fields.name}</p>
						</a>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if item.fields.fundersList}
		<div class="space-y-2 text-sm">
			<div class="">
				<div class="border-b border-gray-900 pb-1">
					<div class=" text-left font-semibold text-black">
						{item.fields.fundersList.length > 1 ? 'Funders' : 'Funder'}
					</div>
				</div>
			</div>
			<div class="font-normal text-black">
				{#each item.fields.fundersList as funder (funder.fields.name)}
					<div>
						<a href={ensureHttps(funder.fields.url)} target="_blank" class="inline-block">
							<p class="text-sm duration-300 ease-in-out hover:underline">{funder.fields.name}</p>
						</a>
					</div>
				{/each}
			</div>
		</div>
	{/if}
	{#if item.fields.contractingAuthorityList}
		<div class="space-y-2 text-sm">
			<div class="">
				<div class="border-b border-gray-900 pb-1">
					<div class=" text-left font-semibold text-black">
						{item.fields.contractingAuthorityList.length > 1
							? 'Contracting Authorities'
							: 'Contracting Authority'}
					</div>
				</div>
			</div>
			<div class="font-normal text-black">
				{#each item.fields.contractingAuthorityList as authority (authority.fields.name)}
					<div>
						<a href={ensureHttps(authority.fields.url)} target="_blank" class="inline-block">
							<p class="text-sm duration-300 ease-in-out hover:underline">
								{authority.fields.name}
							</p>
						</a>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
