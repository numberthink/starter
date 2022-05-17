import {REPO_URL} from './siteConfig.js';

export const menuLayout = {'options': [

        {'name': 'Home','type': 'route','href': '/','index': 0},
        {'name': 'About', 'type': 'route','href': '/about','index': 1},
        {'name': 'About2', 'type': 'route','href': '/about','index': 2},
        {'name': 'About3', 'type': 'route','href': '/about','index': 3},
    
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