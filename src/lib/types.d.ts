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



// use e.g. /** @type {import('$lib/types').testItem} */
