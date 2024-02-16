<script lang="ts">
	export let items: Team[];

	import type { Team } from '$lib/types/types';
	import FaTwitter from 'virtual:icons/fa6-brands/x-twitter';
	import FaLinkedin from 'virtual:icons/fa6-brands/linkedin-in';
	import FaMail from 'virtual:icons/fa6-regular/envelope';
	import Icon from '$components/UI/Icon.svelte';
	import { ensureHttps } from '$utils/utils.js';
</script>

<div>
	<ul class="bg-green-light">
		<div class="container grid grid-cols-1 gap-8 pt-16 md:grid-cols-2 lg:gap-16">
			{#each items.sort( (a, b) => (a.fields.name || '').localeCompare(b.fields.name || '') ) as item (item.fields.name)}
				<li class=" grid grid-cols-1 pb-6 lg:grid-cols-4 lg:pb-10">
					{#if item.fields.picture}
						<a href={`/team/${item.fields.slug}`}>
							<div
								class=" mb-3 w-full transition duration-300 ease-in-out hover:opacity-75 lg:mb-0"
							>
								<img
									loading="lazy"
									src={item.fields.picture.fields.file.url}
									alt={item.fields.name}
									class="aspect-square w-32 rounded-full object-cover lg:w-full"
								/>
							</div>
						</a>
					{/if}
					<div class="justify-between px-2 leading-normal lg:col-span-3 lg:px-8">
						<div class="">
							<a href={`/team/${item.fields.slug}`}>
								<p
									class="text-2xl font-semibold text-gray-700 transition duration-300 ease-in-out hover:text-green-normal"
								>
									{item.fields.name}
								</p>
							</a>
							<h1 class="pb-4 text-lg font-bold text-green-normal">{item.fields.position}</h1>

							{#if item.fields.bio}
								<p class="pb-4 text-base text-gray-700">
									{item.fields.bio}
								</p>
							{/if}

							<ul class="flex items-center space-x-3 pt-2 text-green-normal">
								{#if item.fields.email}
									{@const mailWithoutAt = item.fields.email.replace('@', ' [at] ')}
									<a href={`mailto:${mailWithoutAt}`} class="">
										<Icon icon={FaMail} label="Mail" classes="w-4 h-4" />
									</a>
								{/if}
								{#if item.fields.twitter}
									<a href={ensureHttps(item.fields.twitter)}>
										<Icon icon={FaTwitter} label="Twitter" classes="w-4 h-4" />
									</a>
								{/if}
								{#if item.fields.linkedin}
									<a href={ensureHttps(item.fields.linkedin)}>
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
