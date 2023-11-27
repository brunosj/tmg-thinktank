<script>
	export let landingPage;
	export let newsletter;
	export let events;

	import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@rgossiaux/svelte-headlessui';
	import LatestEvents from '$components/Latest/LatestEvents.svelte';
	import Carousel from '$components/Carousel/Carousel.svelte';
	import LatestBlog from '$components/Latest/LatestBlog.svelte';
	import LatestNewsletter from './LatestNewsletter.svelte';

	let slides = [];
	let selected = false;

	$: {
		slides = slides.concat(landingPage?.featuredItem || []);
		slides = slides.concat(landingPage?.featuredItem2 || []);
		slides = slides.concat(landingPage?.featuredItem3 || []);
	}
</script>

<section class="container py-6 lg:py-12">
	<TabGroup>
		<TabList>
			<div class="flex">
				<Tab
					class={({ selected }) =>
						selected
							? 'rounded-tl-md rounded-tr-md border-b-[1px] border-l-[1px] border-r-[1px] border-t-[1px] border-green-normal border-b-white  bg-white text-green-normal'
							: 'border-b-[1px] border-green-normal'}
				>
					<h3 class="px-6 py-2">Featured</h3>
				</Tab>
				<!-- <Tab
					class={({ selected }) =>
						selected
							? 'rounded-tl-md rounded-tr-md border-b-[1px] border-l-[1px] border-r-[1px] border-t-[1px] border-green-normal border-b-white  bg-white text-green-normal'
							: 'border-b-[1px] border-green-normal'}
				>
					<h3 class="px-6 py-2">Blog</h3>
				</Tab> -->
				<Tab
					class={({ selected }) =>
						selected
							? 'rounded-tl-md rounded-tr-md border-b-[1px] border-l-[1px] border-r-[1px] border-t-[1px] border-green-normal border-b-white  bg-white text-green-normal'
							: 'border-b-[1px] border-green-normal'}
				>
					<h3 class="px-6 py-2">Newsletter</h3>
				</Tab>
			</div>
		</TabList>
		<!-- Tab Panels --->
		<TabPanels>
			<TabPanel>
				<section class="pb-6 pt-3 lg:pb-3 lg:pt-12">
					<div class="grid grid-cols-1 lg:grid-cols-3">
						<div class="col-span-2 mr-0 h-full overflow-hidden lg:mr-10">
							<Carousel {slides} />
						</div>
						<div class="col-span-1 ml-0 pt-6 lg:ml-5 lg:pt-0">
							<LatestEvents {events} />
						</div>
					</div>
				</section>
			</TabPanel>
			<!-- <TabPanel>
				<LatestBlog {news} />
			</TabPanel> -->
			<TabPanel>
				<LatestNewsletter {newsletter} />
			</TabPanel>
		</TabPanels>
	</TabGroup>
</section>
