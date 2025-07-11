<script lang="ts">
	import { run } from 'svelte/legacy';

	import logo from '$assets/TMG_logo_transparent.png';
	import { MenuIcon, SearchIcon } from '@rgossiaux/svelte-heroicons/outline';

	import { onMount } from 'svelte';
	import { createPostsIndex, searchPostsIndex } from '$lib/search';
	import SearchResults from '$components/Search/SearchResults.svelte';
	import SidebarComponent from '$components/Layout/Sidebar.svelte';
	import type { SearchItem } from '$lib/types/types';

	let { programmes } = $props();

	let search: 'loading' | 'ready' = $state('loading');
	let searchTerm = $state('');
	let results: SearchItem[] = $state([]);
	let posts: SearchItem[] = [];
	let showSearchInput = $state(false);
	let sidebarHidden = $state(true);

	onMount(async () => {
		try {
			const response = await fetch('/search.json');
			posts = await response.json();
			createPostsIndex(posts);
			search = 'ready';
		} catch (error) {
			console.error('Error fetching posts:', error);
		}
	});

	onMount(() => {
		document.addEventListener('keydown', handleKeyDown);
	});

	run(() => {
		if (search === 'ready') {
			results = searchPostsIndex(searchTerm);
		}
	});

	const toggleSearch = () => {
		showSearchInput = !showSearchInput;
	};

	const toggleSidebar = () => {
		sidebarHidden = !sidebarHidden;
		showSearchInput = false;
		searchTerm = '';
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			showSearchInput = false;
			searchTerm = '';
		}
	};

	function init(el: HTMLElement) {
		el.focus();
	}
</script>

<header class="fixed top-0 z-50 w-full bg-white bg-opacity-90 shadow-lg">
	<div class="border-t-4 border-navy-blue">
		<div class="layout mx-auto flex items-center justify-between py-1">
			<div>
				<a href="/" class="m-0 flex h-8 w-16 md:m-auto lg:h-12 lg:w-24">
					<img src={logo} alt="TMG Think Tank for Sustainability" loading="eager" />
				</a>
			</div>
			<div class="flex justify-end gap-3">
				{#if search === 'ready' && showSearchInput}
					<div class=" ml-auto flex justify-end">
						<input
							bind:value={searchTerm}
							use:init
							placeholder="Search"
							autocomplete="off"
							spellcheck="false"
							type="search"
						/>
					</div>
				{/if}
				{#if !showSearchInput}
					<button type="button" aria-label="menu" onclick={toggleSearch}>
						<SearchIcon
							class="h-8 w-8 rounded-md bg-transparent p-1 text-blue-normal duration-300 hover:bg-blue-light"
						/>
					</button>
				{/if}
				<button type="button" aria-label="menu" onclick={toggleSidebar}>
					<MenuIcon
						class="h-8 w-8 rounded-md bg-transparent p-1 text-blue-normal duration-300 hover:bg-blue-light"
					/>
				</button>
			</div>
		</div>
	</div>
</header>

{#if searchTerm.length > 0}
	<SearchResults {results} bind:searchTerm bind:showSearchInput />
{/if}

<SidebarComponent bind:sidebarHidden {programmes} />

<style>
	input {
		border: 1px solid #67797b;
		border-radius: 0.375rem;
		padding: 0.2rem 1rem;
		font-size: 0.9rem;
		width: 80%;
	}

	@media (min-width: 768px) {
		input {
			border-radius: 0.375rem;
			padding: 0.5rem 1rem;
			font-size: 0.9rem;
			width: 100%;
		}
	}
</style>
