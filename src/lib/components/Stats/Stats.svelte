<script lang="ts">
	export let title;
	export let subtitle;
	export let item1;
	export let number1;
	export let item2;
	export let number2;
	export let item3;
	export let number3;
</script>

<section class="">
	<div class="bg-green-variation pt-12 sm:pt-16">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="mx-auto max-w-4xl text-center">
				<h2 class="text-3xl font-extrabold text-black sm:text-4xl">{title}</h2>
				<p class="mt-3 text-xl text-cop1 sm:mt-4">{subtitle}</p>
			</div>
		</div>
		<div class="mt-10 bg-white pb-12 sm:pb-16">
			<div class="relative">
				<div class="absolute inset-0 h-1/2 bg-green-variation" />
				<div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div class="mx-auto max-w-4xl">
						<dl class="rounded-lg bg-white shadow-lg sm:grid sm:grid-cols-3">
							<div
								class="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r"
							>
								<dt class="order-2 mt-2 text-xl font-medium leading-6 text-cop1">
									{item1}
								</dt>
								<dd class="order-1 text-5xl font-extrabold text-cop2">
									{number1}
								</dd>
							</div>
							<div
								class="flex flex-col border-b border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l sm:border-r"
							>
								<dt class="order-2 mt-2 text-xl font-medium leading-6 text-cop1">
									{item2}
								</dt>
								<dd class="order-1 text-5xl font-extrabold text-cop2">
									{number2}
								</dd>
							</div>
							<div
								class="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l"
							>
								<dt class="order-2 mt-2 text-xl font-medium leading-6 text-cop1">
									{item3}
								</dt>
								<dd class="order-1 text-5xl font-extrabold text-cop2">
									{number3}
								</dd>
							</div>
						</dl>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
