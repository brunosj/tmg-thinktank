<script lang="ts">
	interface Props {
		image?: string;
		text: string;
		person: string;
		organisation: string;
		bgColor?: string;
	}

	let { image = '', text, person, organisation, bgColor = '#2e2d51' }: Props = $props();
</script>

<section>
	<div class="relative" style="background-color: {bgColor}">
		<div
			class="m-auto w-full overflow-hidden px-8 py-6 lg:grid lg:w-3/4 lg:grid-cols-3 lg:gap-x-8 lg:px-16 lg:py-12"
		>
			<div class="absolute inset-0 opacity-50 mix-blend-multiply saturate-0 filter">
				<!-- <img loading="lazy" src={image} class="h-full w-full object-cover" alt="" /> -->
			</div>
			<div class="layout relative col-span-3">
				<blockquote class="mt-6 text-white">
					<h2 class="">{text}</h2>
					<div class="mt-6 flex flex-col text-sm font-light">
						<h3>{person}</h3>
						<h3>{organisation}</h3>
					</div>
				</blockquote>
			</div>
		</div>
	</div>
</section>
