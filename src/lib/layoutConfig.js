export const menuLayout = {
	options: [
		{ name: 'Home', type: 'route', href: '/', index: 0 },
		{ name: 'About', type: 'route', href: '/about', index: 1 }
	]
};
export const footerLayout = {
	columns: [
		[
			{ name: 'Home', type: 'route', href: '/' },
			{ name: 'About', type: 'route', href: '/about' },
			{ name: 'Instagram', type: 'link', href: 'https://instagram.com/numberthink' }
		],
		[
			{
				name: 'Twitter',
				type: 'link',
				href: 'https://twitter.com/intent/follow?screen_name=bkmetaverse'
			},
			{ name: 'Youtube', type: 'link', href: 'https://youtube.com/numberthink' },
			{ name: 'Github', type: 'link', href: 'https://github.com/numberthink/starter' }
		]
	]
};
