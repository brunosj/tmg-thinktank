<script lang="ts">
	import type { Project } from '$lib/types/payload-types';
	interface Props {
		item: Project;
	}
	import { ensureHttps } from '$utils/utils';

	let { item }: Props = $props();
</script>

<div class="space-y-6">
	{#if item.name}
		<div class="space-y-2 text-sm">
			<div class="">
				<div class="border-b-[1px] border-gray-900 pb-1">
					<div class=" text-left font-semibold text-black">Project Name</div>
				</div>
			</div>
			<div class=" font-normal text-black">
				{item.name}
			</div>
		</div>
	{/if}

	{#if item.info?.year}
		<div class="space-y-2 text-sm">
			<div class="">
				<div class="border-b-[1px] border-gray-900 pb-1">
					<div class=" text-left font-semibold text-black">Duration</div>
				</div>
			</div>
			<div class=" font-normal text-black">
				{item.info.year}
			</div>
		</div>
	{/if}

	{#if item.info?.partnersList && item.info.partnersList.length > 0}
		<div class="space-y-2 text-sm">
			<div class="">
				<div class="border-b-[1px] border-gray-900 pb-1">
					<div class=" text-left font-semibold text-black">
						{item.info.partnersList.length > 1 ? 'Partners' : 'Partner'}
					</div>
				</div>
			</div>
			<div class="font-normal text-black">
				{#each item.info.partnersList as partner (partner.id)}
					<div>
						<p class="text-sm">{partner.partner || ''}</p>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if item.info?.fundersList && item.info.fundersList.length > 0}
		<div class="space-y-2 text-sm">
			<div class="">
				<div class="border-b-[1px] border-gray-900 pb-1">
					<div class=" text-left font-semibold text-black">
						{item.info.fundersList.length > 1 ? 'Funders' : 'Funder'}
					</div>
				</div>
			</div>
			<div class="font-normal text-black">
				{#each item.info.fundersList as funder (funder.id)}
					<div>
						<p class="text-sm">{funder.funder || ''}</p>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if item.info?.contractingAuthorityList && item.info.contractingAuthorityList.length > 0}
		<div class="space-y-2 text-sm">
			<div class="">
				<div class="border-b-[1px] border-gray-900 pb-1">
					<div class=" text-left font-semibold text-black">
						{item.info.contractingAuthorityList.length > 1
							? 'Contracting Authorities'
							: 'Contracting Authority'}
					</div>
				</div>
			</div>
			<div class="font-normal text-black">
				{#each item.info.contractingAuthorityList as authority (authority.id)}
					<div>
						<p class="text-sm">{authority.authority || ''}</p>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
