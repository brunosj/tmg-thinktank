<script>
	export let data;
	import ContactForm from '$components/Forms/ContactForm.svelte';
	import Location from '$components/About/Location.svelte';
	import GuidingPrinciples from '$components/About/GuidingPrinciples.svelte';
	import Team from '$components/About/Team.svelte';
	import Description from '$components/About/Description.svelte';
	import SEO from '$components/SEO/SEO.svelte';

	let about = data.about[0];
</script>

<SEO title={about.fields.title} description={about.fields.description} />
<Description quotePicture={about.fields.quotePicture} />
<Location map={about.fields.map.fields.file.url} />
<GuidingPrinciples pictures={about.fields.pictures} />
<Team />
<ContactForm />
