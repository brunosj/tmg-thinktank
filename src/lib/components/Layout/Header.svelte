<script>
	import {
		Drawer,
		Button,
		CloseButton,
		Sidebar,
		SidebarBrand,
		SidebarCta,
		SidebarDropdownItem,
		SidebarDropdownWrapper,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper
	} from 'flowbite-svelte';
	import logo from '$assets/TMG_logo_transparent.png';
	import { MenuIcon, XIcon } from '@rgossiaux/svelte-heroicons/outline';
	import { headerMenu, footerMenu } from '$data/menu.js';
	import { sineIn } from 'svelte/easing';

	let hidden2 = true;
	let spanClass = 'flex-1 ml-3 whitespace-nowrap';
	let transitionParamsRight = {
		x: 320,
		duration: 200,
		easing: sineIn
	};
</script>

<header class="fixed top-0 z-50 w-full bg-white bg-opacity-90 shadow-lg">
	<div class="border-t-4 border-green-normal">
		<div class="container mx-auto flex items-center justify-between py-1">
			<div>
				<a href="/" class="m-0 flex h-8 w-16 md:m-auto lg:h-12 lg:w-24">
					<img src={logo} alt="TMG Think Tank for Sustainability" loading="eager" />
				</a>
			</div>
			<button type="button" aria-label="menu" on:click={() => (hidden2 = false)}>
				<MenuIcon class="textHover h-6 w-6 text-green-normal" />
			</button>
		</div>
	</div>
</header>
<Drawer
	placement="right"
	transitionType="fly"
	transitionParams={transitionParamsRight}
	bind:hidden={hidden2}
	id="sidebar2"
	width="w-[85%] lg:w-[30%]"
>
	<div class="flex items-center">
		<CloseButton on:click={() => (hidden2 = true)} class="mb-4 dark:text-white" />
	</div>
	<Sidebar class=" z-50 w-full">
		<SidebarWrapper class="overflow-y-auto bg-white py-6 lg:py-12">
			<SidebarGroup class="flex h-full flex-col justify-between">
				{#each headerMenu as category, i}
					{#if i === 0 || i === 1}
						<li class="list-none" key={i}>
							<SidebarDropdownWrapper
								label={category.category}
								class="group flex w-full items-center rounded-lg p-1 text-lg font-semibold text-green-normal  transition duration-75 hover:bg-green-variation lg:p-2 lg:text-2xl"
								isOpen
							>
								<ul>
									{#each category.links as link}
										<li>
											<SidebarDropdownItem
												label={link.title}
												href={link.to}
												class="flex items-center rounded-lg p-1 pl-12 text-sm font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 lg:text-base"
												on:click={() => (hidden2 = true)}
											/>
										</li>
									{/each}
								</ul>
							</SidebarDropdownWrapper>
						</li>
					{:else}
						<li key={i}>
							<SidebarDropdownWrapper
								label={category.category}
								class="group flex w-full items-center rounded-lg p-1 text-lg font-semibold text-green-normal  transition duration-75 hover:bg-green-variation lg:p-2 lg:text-2xl"
							>
								<ul>
									{#each category.links as link}
										<li>
											<SidebarDropdownItem
												label={link.title}
												href={link.to}
												class="flex items-center rounded-lg p-1 pl-12 text-sm font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 lg:text-base"
												on:click={() => (hidden2 = true)}
											/>
										</li>
									{/each}
								</ul>
							</SidebarDropdownWrapper>
						</li>
					{/if}
				{/each}
			</SidebarGroup>
			<!-- <SidebarGroup border>
				<SidebarItem
					class="text-sm"
					label="About TMG"
					href="/about"
					on:click={() => (hidden2 = true)}
				></SidebarItem>
				<SidebarItem
					class="text-sm"
					label="Contact"
					href="/contact"
					on:click={() => (hidden2 = true)}
				></SidebarItem>
			</SidebarGroup> -->
		</SidebarWrapper>
	</Sidebar>
</Drawer>
