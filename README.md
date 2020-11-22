A Cross Platform Svelte Solution allowing you to develop Electron, Cordova, NativeScript apps from a single code base.

Uses Tailwind CSS.

# Installation

Notes:
    1. Please use npm or yarn depending on your preference for the following instructions.

1. Create a new folder and open it in terminal
2. Run `npm init` and follow the instructions
3. Add Sveltail to your project through
    a. Globally (Recommended)
        1. `npm install sveltail -g`
        2. In your project directory, open a terminal and run `svelte config`.
    b. Locally in your project
        1. Run `yarn add sveltail` or `npm install svelte`.
        2. Add the following to your "package.json" file in project folder.
            `
                "scripts": {
                    // Other Scripts here
                    "sveltail-config": "sveltail config"
                }
            `
        3. Run `yarn svelte-config` or `npm svelte-config` and follow instructions. 
4. Svelte CLI will automatically create the `svelte.config.js` files and other recommended settings from the project.
5. Run `yarn install` or `npm install`.