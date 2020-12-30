/* eslint-disable import/prefer-default-export */
import { writable, readable } from 'svelte/store';

export const writableGlobal = writable(null);
export const readableGlobal = readable(null);
