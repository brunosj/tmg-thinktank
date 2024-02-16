<script lang="ts">
	export let newsletter: Newsletter[];

	import type { Newsletter } from '$lib/types/types';
</script>

<section class="pb-6 pt-3 text-base lg:pb-3 lg:pt-12 lg:text-lg">
	<div>
		<p>
			Never miss any updates from our research programmes and partner networks by subscribing to our
			<i><b>Enabling Sustainability</b></i> newsletter.
		</p>
		<p class="pt-2 lg:pt-0">
			<a
				href="https://bit.ly/33JpKMa"
				class="font-semibold text-blue-800 hover:text-gray-700"
				target="_blank"
			>
				Sign up
			</a>
			and read the previous editions
			<a class="font-semibold text-blue-800 hover:text-gray-700" href="/newsletter"> here. </a>
		</p>
	</div>
	<div class="mt-6 grid-cols-2 border lg:mt-12 lg:grid">
		<div class="lg:border-r">
			<div class="p-5 text-base font-bold text-white lg:text-lg">
				<span class="bg-gray-900 px-2 py-1 duration-200 ease-in-out group-hover:bg-green-normal">
					Latest
				</span>
			</div>
			<div class="flex items-center justify-around gap-0 py-6">
				<a
					href={newsletter[0].fields.url}
					target="_blank"
					class="transform opacity-100 transition duration-300 hover:opacity-70"
				>
					<img
						loading="lazy"
						src={newsletter[0].fields.thumbnail.fields.file.url}
						alt={`Newsletter #${newsletter[0].fields.number}`}
						class="h-64 w-64 scale-100 object-contain hover:scale-105 lg:h-96 lg:w-96"
					/>
				</a>
			</div>
		</div>

		<div class="hidden lg:block">
			<div class="p-5 text-base font-bold text-white lg:text-lg">
				<span class="bg-gray-900 px-2 py-1 duration-200 ease-in-out group-hover:bg-green-normal">
					Previous editions
				</span>
			</div>
			<div class="flex flex-wrap justify-around gap-12 pb-6">
				{#each newsletter.slice(1, 3) as item (item.fields.number)}
					<a
						href="/newsletter"
						class="transform opacity-100 transition duration-300 hover:opacity-70"
					>
						<img
							loading="lazy"
							src={item.fields.thumbnail.fields.file.url}
							alt={`Newsletter #${item.fields.number}`}
							class="w-48 object-contain"
						/>
					</a>
				{/each}
			</div>
		</div>
	</div>
</section>
