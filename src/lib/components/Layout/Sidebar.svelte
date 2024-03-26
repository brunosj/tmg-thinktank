<script lang="ts">
	export let sidebarHidden = true;

	import { headerMenu } from '$data/menu.js';
	import {
		Drawer,
		CloseButton,
		Sidebar,
		SidebarDropdownItem,
		SidebarDropdownWrapper,
		SidebarGroup,
		SidebarWrapper
	} from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';

	let transitionParamsRight = {
		x: 320,
		duration: 200,
		easing: sineIn
	};

	$: toggleSidebar = () => {
		sidebarHidden = !sidebarHidden;
	};
</script>

<Drawer
	placement="right"
	transitionType="fly"
	transitionParams={transitionParamsRight}
	bind:hidden={sidebarHidden}
	id="sidebar2"
	width="w-[85%] md:w-[50%] lg:w-[30%]"
>
	<div class="flex items-center">
		<CloseButton on:click={toggleSidebar} class="mb-4 dark:text-white" />
	</div>
	<Sidebar class=" z-50 w-full">
		<SidebarWrapper class="overflow-y-auto bg-white py-6 lg:py-12">
			<SidebarGroup class="flex h-full flex-col justify-between">
				{#each headerMenu as category, i}
					{#if i === 0 || i === 1}
						<li class="list-none">
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
												on:click={toggleSidebar}
											/>
										</li>
									{/each}
								</ul>
							</SidebarDropdownWrapper>
						</li>
					{:else}
						<li>
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
												on:click={() => (sidebarHidden = true)}
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
					on:click={() => (sidebarHidden = true)}
				></SidebarItem>
				<SidebarItem
					class="text-sm"
					label="Contact"
					href="/contact"
					on:click={() => (sidebarHidden = true)}
				></SidebarItem>
			</SidebarGroup> -->
		</SidebarWrapper>
	</Sidebar>
</Drawer>
