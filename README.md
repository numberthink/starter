### A small toolkit for building websites

NumberThink Starter is a toolkit for quickly designing, prototyping, and deploying a Website. You likely need some familiarity with Javascript, CSS, and HTML to fully customize it to your liking, but anyone with a computer can start using it by cloning or downloading the source code of this project.

It is built using Svelte JS, an open-source Web framework, and comes with a few other useful tools and features, such as:
--Tailwind - a utility-first CSS framework
--ThreeJS - a 3D Javascript library for WebGL.
--Light/Dark Mode - more on this in Styles -> Color Scheme

I personally almost always use these but they can be easily removed if not needed.

### Set up

To get started, create a new directory, open a terminal window, and run the following commands in your project directory:

```bash
npx degit https://github.com/numberthink/starter
npm install
npm run start
```

These commands will create a copy of the Starter in the root of your project directory, install the dependencies, and start a local instance of the site on http://localhost:3000. If you don't already have it, you will need to install [NodeJS] (https://nodejs.dev/) to get the project running,

The bare minimum changes you need to make before deploying a live site are in the Site Config (src/lib/siteConfig.js) where you need to set things like Site Title, Description, Default Images, and the like. These are declared as Javascript constants (i.e. preceded with "const" instead of "let" or "var", which makes it so they can't be changed through reassignment), and are given self-descriptive names like SITE_URL (the URL of your site) and SITE_TITLE (the title of your site). The "export" is so they can be imported and used in other components and places in your site.

```js
export const SITE_URL = 'https://numberthink.com';
export const SITE_TITLE = 'NumberThink Starter';
```

Other important settings to bear in mind are located in the Layout Config (src/lib/layoutConfig.js), where the Main Menu and Footer layouts are set.

Heads Up: You may choose not to use things Twitter URL or Github URL in your site, in which case you can delete those variables from the Site Config. Just make sure to also delete them from the Footer or Main Menu in the Layout Config (which uses the variables set in Site Config to, for example, link to my Twitter in the Footer).
