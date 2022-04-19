import {REPO_URL} from './siteConfig.js';

export const menuLayout = {'options': [

        {'name': 'Home','type': 'route','href': '/'},
        {'name': 'About', 'type': 'route','href': '/about'},
        {'name': 'Three', 'type': 'route','href': '/threesandbox'}
    
]};

export const footerLayout = {'columns': [
    [
        {'name': 'Home','type': 'route','href': '/'},
        {'name': 'About', 'type': 'route','href': '/about'},
        {'name': 'Instagram','type': 'link','href': 'https://instagram.com/numberthink'}
    ],
    [
        {'name': 'Twitter','type': 'link','href': 'https://twitter.com/intent/follow?screen_name=bkmetaverse'},
        {'name': 'Youtube','type': 'link','href': 'https://youtube.com/numberthink'},
        {'name': 'Github','type': 'link','href': REPO_URL},

    ]
]};