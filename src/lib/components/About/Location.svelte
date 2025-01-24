<script lang="ts">
	interface Props {
		map: string;
	}

	let { map }: Props = $props();
</script>

<div class="bg-green-variation">
	<div class="container pb-12 pt-12 font-bold lg:pb-24">
		<div class="py-6 lg:py-12">
			<img loading="lazy" src={map} alt="Image1" />
		</div>

		<div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
			<div class="py-6 text-lg lg:text-2xl">
				<div>
					{' '}
					Based in Berlin, with a regional office in Nairobi,<br />
					<span class="font-extrabold text-green-normal">
						TMG - Think Tank for Sustainability
					</span>
					<br />
					is made up of two independent companies:
				</div>
			</div>

			<div class="col-start-1">
				<div class="text-lg lg:text-2xl">TMG Research gGmbH</div>
				<div class="text-base font-normal lg:text-lg lg:font-semibold">
					is a not-for-profit, transdisciplinary research organization guided by our overall mission
					of fostering inclusive processes for driving transformative socioeconomic change within
					planetary boundaries.
				</div>
			</div>

			<div>
				<div class="text-lg lg:text-2xl">TMG – Töpfer Müller Gaßner GmbH</div>
				<div class="text-base font-normal lg:text-lg lg:font-semibold">
					is the consultancy arm of TMG, involved in demand-driven strategic advice to governments,
					private firms, and diverse international development organizations.
				</div>
			</div>
		</div>
	</div>
</div>
