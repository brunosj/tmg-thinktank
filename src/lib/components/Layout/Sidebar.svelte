<script lang="ts">
	import type { Programme } from '$lib/types/types';

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
	import { generateProgrammeLinks } from '$utils/utils';

	interface Props {
		sidebarHidden?: boolean;
		programmes: Programme[];
	}

	let { sidebarHidden = $bindable(true), programmes }: Props = $props();

	let transitionParamsRight = {
		x: 320,
		duration: 200,
		easing: sineIn
	};

	let toggleSidebar = $derived(() => {
		sidebarHidden = !sidebarHidden;
	});

	const programmeLinks = generateProgrammeLinks(programmes);
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
				<!-- Dynamic Programmes Section -->
				<li class="list-none">
					<SidebarDropdownWrapper
						label="Programmes"
						class="group flex w-full items-center rounded-md p-1 text-lg font-semibold text-blue-normal transition duration-75 hover:bg-blue-light lg:p-2 lg:text-2xl"
						isOpen
					>
						<ul>
							{#each programmeLinks as programme}
								<li>
									<SidebarDropdownItem
										label={programme.title}
										href={programme.to}
										class="flex items-center rounded-md p-1 pl-12 text-sm font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 lg:text-base"
										on:click={() => (sidebarHidden = true)}
									/>
								</li>
							{/each}
						</ul>
					</SidebarDropdownWrapper>
				</li>

				<!-- Other Menu Categories -->
				{#each headerMenu as category, i}
					{#if i === 0}
						<li class="list-none">
							<SidebarDropdownWrapper
								label={category.category}
								class="group flex w-full items-center rounded-md p-1 text-lg font-semibold text-blue-normal  transition duration-75 hover:bg-blue-light lg:p-2 lg:text-2xl"
								isOpen
							>
								<ul>
									{#each category.links as link}
										<li>
											<SidebarDropdownItem
												label={link.title}
												href={link.to}
												class="flex items-center rounded-md p-1 pl-12 text-sm font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 lg:text-base"
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
								class="group flex w-full items-center rounded-md p-1 text-lg font-semibold text-blue-normal  transition duration-75 hover:bg-blue-light lg:p-2 lg:text-2xl"
							>
								<ul>
									{#each category.links as link}
										<li>
											<SidebarDropdownItem
												label={link.title}
												href={link.to}
												class="flex items-center rounded-md p-1 pl-12 text-sm font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 lg:text-base"
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
