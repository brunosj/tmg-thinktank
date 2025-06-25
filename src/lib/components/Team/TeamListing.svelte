<script lang="ts">
	import type { Team } from '$lib/types/payload-types';
	import FaTwitter from 'virtual:icons/fa6-brands/x-twitter';
	import FaLinkedin from 'virtual:icons/fa6-brands/linkedin-in';
	import FaMail from 'virtual:icons/fa6-regular/envelope';
	import Icon from '$components/UI/Icon.svelte';
	import LexicalRenderer from '$components/RichText/LexicalRenderer.svelte';
	import { ensureHttps } from '$utils/utils';

	interface Props {
		items: Team[];
	}

	let { items }: Props = $props();
</script>

<div>
	<ul class="bg-green-light">
		<div class="layout grid grid-cols-1 gap-8 pt-16 md:grid-cols-2 lg:gap-16">
			{#each items.sort((a, b) => (a.name || '').localeCompare(b.name || '')) as item (item.name)}
				<li class=" grid grid-cols-1 pb-6 lg:grid-cols-4 lg:pb-10">
					{#if item.picture && typeof item.picture === 'object'}
						<a href={`/team/${item.slug}`}>
							<div
								class=" mb-3 w-full transition duration-300 ease-in-out hover:opacity-75 lg:mb-0"
							>
								<img
									loading="lazy"
									src={item.picture.url || ''}
									alt={item.name}
									class="aspect-square w-32 rounded-full object-cover lg:w-full"
								/>
							</div>
						</a>
					{/if}
					<div class="justify-between px-2 leading-normal lg:col-span-3 lg:px-8">
						<div class="">
							<a href={`/team/${item.slug}`}>
								<p
									class="hover:text-blue-normal text-2xl font-semibold text-black transition duration-300 ease-in-out"
								>
									{item.name}
								</p>
							</a>
							<h1 class="text-blue-normal pb-4 text-lg font-bold">{item.position}</h1>

							{#if item.bio}
								<div class="pb-4 text-base text-black">
									<LexicalRenderer content={item.bio} />
								</div>
							{/if}

							<ul class="text-blue-normal flex items-center space-x-3 pt-2">
								{#if item.email}
									<a href={`mailto:${item.email}`} class="">
										<Icon icon={FaMail} label="Mail" classes="w-4 h-4" />
									</a>
								{/if}
								{#if item.twitter}
									<a href={ensureHttps(item.twitter)}>
										<Icon icon={FaTwitter} label="Twitter" classes="w-4 h-4" />
									</a>
								{/if}
								{#if item.linkedin}
									<a href={ensureHttps(item.linkedin)}>
										<Icon icon={FaLinkedin} label="LinkedIn" classes="w-4 h-4" />
									</a>
								{/if}
							</ul>
						</div>
					</div>
				</li>
			{/each}
		</div>
	</ul>
</div>
