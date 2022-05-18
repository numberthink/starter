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

// use e.g. /** @type {import('$lib/types').testItem} */
