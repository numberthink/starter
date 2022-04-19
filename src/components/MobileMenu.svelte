<script>
	import { menuLayout } from '$lib/layoutConfig';
	let menuOpening = false;
	let menuOpen = false;
	let menuClosing = false;
	let menuOpenTime;
	let burgerHovering;
	let endBurgerHovering;
	let menuTest = true;

let menuAnimations = {
	burger_slide_out: {duration: .5},
	burger_slide_back: {duration: .3},
	burger_to_x: {duration: 1},
	burger_fade: {duration: .5},
	x_to_full: {duration: .2},
	menu_slide_in: {duration: 1},
	menu_slide_out: {duration: .5}
}

const startBurgerHover = () => {
	if (menuClosing || menuOpening) {
		return;
	}
	burgerHovering=true;
	endBurgerHovering = false;
}
const endBurgerHover = () => {
	if (menuClosing || menuOpening) {
		return;
	}
	burgerHovering=false;
	endBurgerHovering = true;
}
const burgerClick = () => {
	if (menuOpen) {
		menuOpen = !menuOpen;
		menuOpening = false
		menuClosing = true;
		setTimeout(() => (menuClosing = false), menuAnimations.menu_slide_out.duration*1000);
		endBurgerHovering = true;
		burgerHovering=false;
	}
	else if (menuOpening) {
		clearTimeout(menuOpenTime);
		menuClosing = true;
		setTimeout(() => (menuClosing = false),menuAnimations.menu_slide_out.duration*1000);
		endBurgerHovering = true;
		burgerHovering=false;
		menuOpening = false;	
	}
	else {
		menuOpening = true;
		menuOpenTime = setTimeout(() => (menuOpen = true), 1000);
		menuClosing = false;
		endBurgerHovering = false;
		burgerHovering=false;

	}

}
</script>

<div class="md:hidden">

	<button
		class="relative z-20 flex items-center justify-center"
		aria-label="Toggle menu"
		type="button"
		
		on:mouseenter={startBurgerHover} on:mouseleave={endBurgerHover}
		on:click={burgerClick}
	>

			<svg
				class="absolute h-5 w-5 text-gray-900 dark:text-gray-100"
				width="20"
				height="20"
				viewBox="0 0 20 20"
				fill="none"
				class:xBurgerFade={menuOpening}
				><path
					d="M1 10H19"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				</svg
			>
			<svg
				class="absolute h-5 w-5 text-gray-900 dark:text-gray-100"
				width="20"
				height="20"
				viewBox="0 0 20 20"
				fill="none"
				class:burgerAnimate={burgerHovering}
				class:endBurgerAnimate={endBurgerHovering}
				class:xBurgerAnimate1={menuOpening}
				class:xBurgerFade={menuOpen}
				><path
					d="M1 5H19"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				</svg
			><svg
			class="absolute h-5 w-5 text-gray-900 dark:text-gray-100"
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			class:burgerAnimate={burgerHovering}
			class:endBurgerAnimate={endBurgerHovering}
			class:xBurgerAnimate2={menuOpening}
			class:xBurgerFade={menuOpen}
			><path
			d="M1 15H19"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
			</svg
		>

		
	</button>
	
	{#if menuOpening || menuClosing}
		<div id="blocker" class="menuBlocker absolute inset-0 min-h-screen min-w-full" on:click={burgerClick}>

		</div>
		<ul
			class="rounded-md w-full px-4 pb-4 sm:max-w-xl absolute flex flex-col text-2xl surface2-color"
			class:menuActive={menuOpening}
			class:menuInactive={menuClosing}
		>
		{#each menuLayout.options as menuOption}
		<li class="border-b border-gray-300 font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100">
			<a
			class="flex w-auto py-2"
			sveltekit:prefetch
			on:click={burgerClick}
			href={menuOption.href}>{menuOption.name}</a
		>
			
		</li>
		{/each}
		</ul>
		<button
		class="relative z-20 flex items-center justify-center text2-color hover:text1-color opacity-100 scale-0"
		aria-label="Toggle menu"
		type="button"
		class:xBurgerAfterAnimate={menuOpen}
		on:click={burgerClick}
	>
		<svg
				class="h-5 w-5 absolute"
				viewBox="0 0 20 20"
				width="20"
				height="20"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				fill="none"
				shape-rendering="geometricPrecision"
				data-hide="true"><path d="M17.5 2.5L2.5 17.5" /><path d="M2.5 2.5l15 15" /></svg
			>
			</button>
	<!-- </div> -->
	{/if}
</div>

<style lang="postcss">
	
	.xBurgerFade {
		transition: opacity 500ms ease;
		opacity: 0;
	}
	.xBurgerAnimate1 {
		animation: burger-to-x-1 1s ease-in;
		transform: translateX(10%) translateY(25%) rotate(-45deg);
	}
	.xBurgerAnimate2 {
		animation: burger-to-x-2 1s ease-in;
		transform: translateX(10%) translateY(-25%) rotate(45deg);
	}
	.xBurgerAfterAnimate {
		animation: burger-x-grow .2s linear;
		transform: scale(1);
		opacity: 1;
	}
	.xBurgerAfterAnimate:hover {
		transition: transform 200ms ease;
		transform: scale(1.25);
	}
	.burgerAnimate {
      animation: burger-shift .5s ease-out;
      transform: translateX(30%);
	  /* transform: translate(-50%, -50%) scale(1); */

	}
	.endBurgerAnimate {
      animation: burger-shift-back .3s ease-out;
      transform: translateX(0%);
	  /* transform: translate(-50%, -50%) scale(1); */

	}
	.menuInactive {
		transform: translateX(-100%);
		opacity: 0;
		animation: menu-slide-reverse .5s ease-out;
		z-index: 12;
	
	}
	.menuActive {
		transform: translateX(0%);
		animation: menu-slide .5s ease-out;
		z-index: 12;
	}
	.menuBlocker {
		z-index: 11;
	}

	
	@keyframes burger-shift {
		0% {
			transform: translateX(0%)
		}
		100% {
			transform: translateX(30%)
		}
	}
	@keyframes burger-shift-back {
		0% {
			transform: translateX(30%)
		}
		100% {
			transform: translateX(0%)
		}
	}
	@keyframes menu-slide {
		0% {
			transform: translateX(-60%)
		}
		100% {
			transform: translateX(0%)
		}
	}
	@keyframes menu-slide-reverse {
		0% {
			transform: translateX(0%);
			opacity: 1;
		}
		100% {
			transform: translateX(-100%);
			opacity: 0;
		}
	}
	@keyframes burger-to-x-1 {
		0% {
			transform: translateX(30%) translateY(0%) rotate(-0deg);
		}
		100% {
			transform: translateX(10%) translateY(25%) rotate(-45deg);
		}
	}
	@keyframes burger-to-x-2 {
		0% {
			transform: translateX(30%) translateY(0%) rotate(0deg);
		}
		100% {
			transform: translateX(10%) translateY(-25%) rotate(45deg);
		}
	}
	@keyframes burger-x-grow {
		0% {
			transform: scale(0.8);
		}
		100% {
			transform: scale(1.0);
		}
	}
</style>
