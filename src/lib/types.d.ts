export type testItem = {
	type: 'test';
	content: string;
	sub_content: {
		[key: string]: string;
	};
	title: string;
	description: string;
	category: string;
	tags: string[];
	date: Date;
	count: number;
	authorized: boolean;
	labels: {
		name: string;
	}[];
};

export type indexContentConfig = {
	siteTitlePrefix: string;
	siteTitleSuffix: string;
	siteSubtitle: string;
	siteSubtitleBold: string;
	repoSourceLink: boolean;
	repoSourceLinkText: string;
};

export type mobileMenuConfig = {
	burgerHoverSlide: boolean;
	burgerToXAnimation: boolean;
	xHoverScale: boolean;
	menuAnimation: boolean;
	menuItemsOpacityAnimation: boolean;
	animationSettings: {
		burgerSlideOut: { duration: number };
		burgerSlideBack: { duration: number };
		burgerToX: { duration: number };
		burgerFade: { duration: number };
		xToFull: { duration: number };
		xHoverScale: { duration: number; scale: number };
		menuSlideIn: { duration: number };
		menuSlideOut: { duration: number };
		menuFadeIn: { duration: number; delay: number; offsetDelay: number };
	};
};

// let menuConfig = {
// 	burgerHoverSlide: true,
// 	burgerToXAnimation: true,
// 	xHoverScale: true,
// 	menuAnimation: true,
// 	menuItemsOpacityAnimation: true,
// 	animationSettings: {
// 		burgerSlideOut: {duration: .4},
// 		burgerSlideBack: {duration: .3},
// 		burgerToX: {duration: .5},
// 		burgerFade: {duration: .5},
// 		xToFull: {duration: .2},
// 		xHoverScale: {duration: .2, scale: 1.25},
// 		menuSlideIn: {duration: .5},
// 		menuSlideOut: {duration: .3},
// 		menuFadeIn: {delay: .05, duration: .5, offsetDelay: .1}
// 	}

// }

// use e.g. /** @type {import('$lib/types').testItem} */
