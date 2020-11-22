/*
In NativeScript, the app.js file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/
import { svelteNative } from 'svelte-native';
import App from '../../src/layouts/Native.svelte';

svelteNative(App, {});
