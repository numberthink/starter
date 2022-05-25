<script>
	import MobileMenu from './MobileMenu.svelte';
	import { REPO_URL } from '$lib/siteConfig';
	import NavLink from './NavLink.svelte';
	import { colors } from '../stores/layout.js';
	import { menuLayout } from '$lib/layoutConfig';
	if (typeof localStorage !== 'undefined') {
		if (
			localStorage.theme === 'dark' ||
			(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			$colors.currentTheme = 'dark';
		}
	}
	function toggleDarkMode() {
		if ($colors.currentTheme == 'dark') {
			document.documentElement.classList.remove('dark');
			localStorage.theme = 'light';
			$colors.currentTheme = 'light';
		} else {
			document.documentElement.classList.add('dark');
			localStorage.theme = 'dark';
			$colors.currentTheme = 'dark';
		}
	}
</script>

<nav
	class="color-1-text-1 color-1-border-1 relative mx-auto flex w-full max-w-4xl
	 items-center justify-between bg-opacity-60 py-8 md:px-6 z-20"
>
	<MobileMenu />
	<ul class="ml-[-0.60rem] flex">
		{#each menuLayout.options as menuOption}
			<li>
				<NavLink href={menuOption.href}>{menuOption.name}</NavLink>
			</li>
		{/each}
	</ul>

	<div class="relative flex items-center space-x-4">
		<button
			aria-label="Toggle Dark Mode"
			class="color-2-surface-1 color-1-ring-1 ml-1 flex h-9 w-9 items-center
			justify-center rounded-lg hover:ring-2"
			on:click={toggleDarkMode}
		>
			{#if $colors.currentTheme == 'dark'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					class="color-1-text-1 h-5 w-5"
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
					class="w-5 h-5 color-1-text-1"
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
