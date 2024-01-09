<script lang="ts">
	export let image: string;
	export let text: string;
	export let person: string;
	export let organisation: string;
	export let bgColor: string;
</script>

<section>
	<div class="relative mx-auto">
		<div
			class="relative overflow-hidden px-8 py-6 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:px-16 lg:py-24"
			style="background-color: {bgColor}"
		>
			<div class="absolute inset-0 opacity-50 mix-blend-multiply saturate-0 filter">
				<img loading="lazy" src={image} class="h-full w-full object-cover" alt="" />
			</div>
			<div class="container relative col-span-3">
				<blockquote class="mt-6 text-white">
					<h2 class="text-base font-medium lg:text-2xl">{text}</h2>
					<div class="mt-6 flex flex-col text-sm font-light">
						<h3>{person}</h3>
						<h3>{organisation}</h3>
					</div>
				</blockquote>
			</div>
		</div>
	</div>
</section>
