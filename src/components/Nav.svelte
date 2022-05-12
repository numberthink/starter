<script>
	import MobileMenu from './MobileMenu.svelte';
	import { REPO_URL } from '$lib/siteConfig';
	import NavLink from './NavLink.svelte';

	import {colors} from '../stores/layout.js';
	import { menuLayout } from '$lib/layoutConfig';
	import {onColorChange} from '../stores/functions.js';
	let isDark = false;
	if (typeof localStorage !== 'undefined') {
		if (
			localStorage.theme === 'dark' ||
			(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			isDark = true;

			$colors.current_mode = 'dark';
		}
	}
	function toggleDarkMode() {
		if (isDark) {
			document.documentElement.classList.remove('dark');
			localStorage.theme = 'light';
			isDark = false;

			$colors.current_mode = 'light';
		} else {
			document.documentElement.classList.add('dark');
			localStorage.theme = 'dark';
			isDark = true;
			$colors.current_mode = 'dark';
		}
		$onColorChange();

	}
</script>
<!-- text-gray-900 dark:border-gray-700 dark:bg-gray-900
	dark:text-gray-100 -->
	<!-- {#each footerLayout.columns as footerColumn}
	<div class="flex flex-col space-y-4">
		{#each footerColumn as footerRow}
		{#if footerRow.type == 'route'}
		<a class="text2-light transition hover:text1-light dark:text2-dark dark:hover:text1-dark" href={footerRow.href}>{footerRow.name}</a>
		{:else if footerRow.type == 'link'}
		<a
		class="text2-light transition hover:text1-light dark:text2-dark dark:hover:text1-dark"
		target="_blank"
		rel="noopener noreferrer"
		href={footerRow.href}>{footerRow.name}</a>
		{/if}
		{/each}
	</div>
	{/each} -->
<nav
	class="relative mx-auto flex w-full max-w-2xl items-center justify-between
	 bg-opacity-60 py-8 text1-color border-color-1  sm:pb-16"
>
	<!-- <a href="#skip" class="skip-nav">Skip to content</a> -->
	<MobileMenu />
	<ul class="ml-[-0.60rem] flex">
		{#each menuLayout.options as menuOption}
		<li>
			<NavLink href={menuOption.href}>{menuOption.name}</NavLink>
		</li>
		{/each}

	</ul>
	<div class="relative z-10 flex items-center space-x-4">
		<button
			aria-label="Toggle Dark Mode"
			class="ml-1 flex h-9 w-9 items-center justify-center rounded-lg
			transition-all hover:ring-2 surface4-color ring-color-accent-3"
			on:click={toggleDarkMode}
		>
			{#if isDark}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					class="h-5 w-5 text1-color"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728
						0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
					/>
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					class="w-5 h-5 text1-light dark:text1-dark"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
					/>
				</svg>
			{/if}
		</button>
	</div>
</nav>

<style>
	.skip-nav {
		position: absolute;
		left: -25%;
		top: -2rem;
		--tw-translate-y: -3rem;
		padding: 0.75rem 1rem;
		transition-property: transform;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 0.2s;
	}
</style>
