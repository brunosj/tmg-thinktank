<script lang="ts">
	import Button from '$components/UI/Button.svelte';
	import HeadingAbout from '$components/About/HeadingAbout.svelte';

	interface Props {
		teamSectionText: string;
	}

	let { teamSectionText }: Props = $props();
</script>

<div class="bg-white font-bold text-green-normal">
	<div class="container grid grid-cols-1 py-12 lg:grid-cols-2">
		<HeadingAbout text="Our Team" />
		<div>
			<div class="text-lg font-semibold lg:text-2xl">
				<div class="pb-6">
					{teamSectionText}
				</div>
				<div class="pb-6">Visit our team page to meet our staff.</div>
			</div>
			<Button to="/team" colors="green">View our team</Button>
		</div>
	</div>
</div>
