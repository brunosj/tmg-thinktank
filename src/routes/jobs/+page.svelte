<script lang="ts">
	export let data;

	import SEO from '$components/SEO/SEO.svelte';
	import { parseISO, isAfter } from 'date-fns';
	import SectionHeaderLow from '$components/Layout/SectionHeaderLow.svelte';
	import JobListing from '$components/Jobs/JobListing.svelte';

	let jobs = data.entries;
	const today = new Date();

	const activeJobs = jobs.filter((job) => {
		const eventDate = parseISO(job.fields.date);
		return isAfter(eventDate, today);
	});
	const noDeadlineJobs = jobs.filter((item) => item.fields.date == null);
	const allActiveJobs = activeJobs.concat(noDeadlineJobs);

	const jobOffers = allActiveJobs.filter((item) => item.fields.category === 'Job');
	const consultancyOffers = allActiveJobs.filter((item) => item.fields.category === 'Consultancy');
</script>

<SEO title="Job Opportunities" description="Join our team!" />
<SectionHeaderLow title="Opportunities at TMG" background="bg-green-normal" />
<div class="container flex flex-col gap-2 pb-6 lg:pb-12">
	<div class="">
		{#if jobOffers.length > 0}
			<h2 class="py-6 text-2xl font-bold underline lg:py-12">Jobs</h2>
			<ul class="space-y-6 pl-0 lg:space-y-12">
				{#each jobOffers as item (item.fields.title)}
					<JobListing {item} />
				{/each}
			</ul>
		{/if}

		{#if consultancyOffers.length > 0}
			<h2 class="py-6 text-2xl font-bold underline lg:py-12">Calls for Tenders</h2>
			<ul class="space-y-6 pl-0 lg:space-y-12">
				{#each consultancyOffers as item (item.fields.title)}
					<JobListing {item} />
				{/each}
			</ul>
		{/if}

		{#if jobOffers.length === 0 && consultancyOffers.length === 0}
			<div class="pb-12 pt-16 font-semibold lg:pb-24 lg:pt-32">
				<p>There are currently no open positions at our organization.</p>
				<p>Please visit this page at a later stage to consult future openings.</p>
			</div>
		{/if}
	</div>
</div>
