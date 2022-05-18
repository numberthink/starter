<script context="module">
	import {
		SITE_URL,
		REPO_URL,
		SITE_TITLE,
		SITE_DESCRIPTION,
		DEFAULT_OG_IMAGE,
		MY_TWITTER_HANDLE
	} from '../lib/siteConfig.js';
	
	export const prerender = true; 
</script>

<script>

const contentConfig = {
    siteTitlePrefix: 'This is',
    siteTitleSuffix: '!',
    siteSubtitle: 'A starter kit for ',
    siteSubtitleBold: 'SvelteKit + Tailwind + ThreeJS.',
	repoSourceLink: true,
	repoSourceLinkText: 'View source here!'
}

</script>

<svelte:head>
	<title>{SITE_TITLE}</title>
	<link rel="canonical" href={SITE_URL} />
	<meta property="og:url" content={SITE_URL} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={SITE_TITLE} />
	<meta name="Description" content={SITE_DESCRIPTION} />
	<meta property="og:description" content={SITE_DESCRIPTION} />
	<meta property="og:image" content={DEFAULT_OG_IMAGE} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:creator" content={'@' + MY_TWITTER_HANDLE} />
	<meta name="twitter:title" content={SITE_TITLE} />
	<meta name="twitter:description" content={SITE_DESCRIPTION} />
	<meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
</svelte:head>

<div
	class="mx-auto min-h-screen max-w-2xl border-color-1 px-4 pb-16
	 pt-4 sm:px-8 color-1-surface-1"
>
	<div class="flex flex-col-reverse items-start sm:flex-row">
		<div class="flex flex-col pr-8">
			<h1 class="relative mb-3 mr-16 text-3xl
			 sm:text-4xl font-bold tracking-tight color-1-text-2
			  md:text-5xl">
				{contentConfig.siteTitlePrefix}<br/>
				<strong>
					<span class="relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-2 before:color-1-surface-3 before:rounded-sm">
						
						<span class="relative skew-y-2">{SITE_TITLE}{contentConfig.siteTitleSuffix}</span>
					</span>
					
				</strong>
			</h1>

			<h2 class="relative mb-1 mt-4 color-1-text-1 text-lg ">
				{contentConfig.siteSubtitle} 
				{#if contentConfig?.siteSubtitleBold && contentConfig.siteSubtitleBold.length>0}
				<span class="font-semibold">{contentConfig.siteSubtitleBold}</span>
				{/if}
			</h2>

			{#if contentConfig?.repoSourceLink}
			<p class="relative mt-2 text-base color-1-text-2 
			hover:color-1-text-1">

				<a
				class="flex items-center rounded-lg"
				href={REPO_URL}
				aria-label="GitHub source"
			>
				<svg aria-hidden="true" class="h-7 w-7 pr-1" fill="currentColor" viewBox="0 0 24 24">
					<path
						fill-rule="evenodd"
						d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483
						0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608
						1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088
						2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988
						1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112
						6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202
						2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566
						4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019
						10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
						clip-rule="evenodd"
					/>
				</svg>
				<span>{contentConfig.repoSourceLinkText}</span>
			</a>
			</p>
			{/if}
		</div>
	</div>



</div>
