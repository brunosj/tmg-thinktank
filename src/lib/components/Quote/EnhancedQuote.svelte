<script lang="ts">
	interface QuoteProps {
		quoteText: string;
		quotePerson: string;
		quotePersonOrganization: string;
		quotePersonPictureUrl: string;
		color?: string;
	}
	let {
		quoteText,
		quotePerson,
		quotePersonOrganization,
		quotePersonPictureUrl,
		color = '#333'
	}: QuoteProps = $props();
</script>

<div class="bg-white">
	<div class="layout">
		<div class="relative mx-auto max-w-4xl">
			<!-- Decorative quote marks -->
			<div
				class="absolute -left-4 -top-10 font-serif text-8xl opacity-10 md:-left-10 md:-top-16 md:text-9xl"
				style="color: {color}"
			>
				"
			</div>
			<div
				class="absolute -bottom-16 -right-4 font-serif text-8xl opacity-10 md:-bottom-24 md:-right-10 md:text-9xl"
				style="color: {color}"
			>
				"
			</div>

			<!-- Decorative elements -->
			<div
				class="absolute -left-4 -top-4 h-16 w-16 rounded-full opacity-15 md:h-24 md:w-24"
				style="background-color: {color}; filter: blur(25px);"
			></div>
			<div
				class="absolute -bottom-4 -right-4 h-16 w-16 rounded-full opacity-15 md:h-24 md:w-24"
				style="background-color: {color}; filter: blur(25px);"
			></div>

			<div class="relative z-10 rounded-xl border border-gray-100 bg-white p-4 shadow-lg md:p-12">
				<!-- Quote content -->
				<div class="flex flex-col md:flex-row md:gap-8">
					<!-- Person image -->
					{#if quotePersonPictureUrl}
						<div class="mb-6 flex-shrink-0 md:mb-0">
							<div
								class="relative h-20 w-20 overflow-hidden rounded-full border-4 md:h-32 md:w-32"
								style="border-color: {color}"
							>
								<img
									src={quotePersonPictureUrl}
									alt={quotePerson}
									class="h-full w-full object-cover"
								/>
							</div>
						</div>
					{/if}

					<!-- Quote text -->
					<div>
						<p class="mb-6 text-base italic leading-relaxed md:text-2xl" style="color: {color}">
							"{quoteText}"
						</p>

						<div class="flex items-center">
							<div class="h-px w-8" style="background-color: {color}; opacity: 0.4;"></div>
							<div class="ml-4">
								<p class="text-xl font-medium" style="color: {color}">
									{quotePerson}
								</p>
								<p class="text-sm text-gray-600">{quotePersonOrganization}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
