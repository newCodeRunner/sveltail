A Cross Platform Svelte Solution allowing you to develop Electron, Cordova, NativeScript apps from a single code base.

Uses Tailwind CSS.

# Installation

Notes:
    1. Please use npm or yarn depending on your preference for the following instructions.

1. Create a new folder and open it in terminal
2. Run `npm init` and follow the instructions
3. Add Sveltail to your project ocally in your project (Recommended)
    1. Run `yarn add sveltail --dev` or `npm install sveltail --also=dev`.
    2. Add the following to your "package.json" file in project folder.
        `
            "scripts": {
                // Other Scripts here
                "sveltail": "sveltail"
            }
        `
        and run `yarn sveltail config` or `npm run sveltail config` and follow instructions. 
        
        Or

        You can also run Sveltail directly `npx sveltail config`

    Note: Adding sveltail globally is not recommended as sveltail also comes packed with UI components, that are irrelevant for CLI usage only, and things might not work as expected.

4. Svelte CLI will automatically create the `svelte.config.js` files and other recommended settings for the project and some useful scripts to package.json in the root folder.
5. Add cordova mode `yarn sveltail add --cordova` or `npx sveltail add --cordova`.
6. Take cordova for a test drive `yarn sveltail dev --cordova --ios` or ``yarn sveltail dev --cordova --ios` or use the script added by sveltail to your package.json `yarn st-dev-cor-ios`.

# Test Drive
1. You can quickly clone the repo at https://github.com/newCodeRunner/sveltail-example.git.
2. Run `yarn install` (Recommended) or `npm install`.
3. Run `yarn st-dev` to test the app and UI out in browser.
3. Run `yarn st-dev-cor-ios` to test the app and UI out in Cordova.
