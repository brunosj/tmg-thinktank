<script lang="ts">
	interface Props {
		title: string;
		subtitle: string;
		item1: string;
		number1: number;
		item2: string;
		number2: number;
		item3: string;
		number3: number;
		color?: string;
	}

	let {
		title,
		subtitle,
		item1,
		number1,
		item2,
		number2,
		item3,
		number3,
		color = '#089b61'
	}: Props = $props();
</script>

<section class="">
	<div class="bg-green-variation pt-12 sm:pt-16">
		<div class="layout mx-auto">
			<div class="mx-auto max-w-4xl text-center">
				<h2 class="text-3xl font-extrabold sm:text-4xl" style="color: {color}">{title}</h2>
				<p class="mt-3 text-base text-cop1 sm:mt-4 lg:text-xl">{subtitle}</p>
			</div>
		</div>
		<div class="mt-10 bg-white pb-12 sm:pb-16">
			<div class="relative">
				<div class="absolute inset-0 h-1/2 bg-green-variation"></div>
				<div class="layout relative z-10 mx-auto">
					<div class="mx-auto max-w-4xl">
						<dl class="relative z-10 rounded-md bg-white shadow-lg sm:grid sm:grid-cols-3">
							<div
								class="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r"
							>
								<dt class="order-2 mt-2 text-base font-medium leading-6 text-cop1 lg:text-xl">
									{item1}
								</dt>
								<dd
									class="relative z-10 order-1 text-2xl font-extrabold lg:text-5xl"
									style="color: {color}"
								>
									{number1}
								</dd>
							</div>
							<div
								class="flex flex-col border-b border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l sm:border-r"
							>
								<dt class="order-2 mt-2 text-base font-medium leading-6 text-cop1 lg:text-xl">
									{item2}
								</dt>
								<dd
									class="relative z-10 order-1 text-2xl font-extrabold lg:text-5xl"
									style="color: {color}"
								>
									{number2}
								</dd>
							</div>
							<div
								class="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l"
							>
								<dt class="order-2 mt-2 text-base font-medium leading-6 text-cop1 lg:text-xl">
									{item3}
								</dt>
								<dd
									class="relative z-10 order-1 text-2xl font-extrabold lg:text-5xl"
									style="color: {color}"
								>
									{number3}+
								</dd>
							</div>
						</dl>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
