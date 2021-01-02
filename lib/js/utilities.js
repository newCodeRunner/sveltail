/* eslint-disable object-curly-newline */
import { readable } from 'svelte/store';
import { set, setAll, get, getAll, transact, clear, has, remove, each, add, keys, size, clearAll } from 'store2';

let routerObj;
let loaderObj;
let notifierObj;
let alerterObj;

// Export Utitily References
export const router = readable(null, (setVal) => {
  setVal(routerObj);
  return () => {};
});
export const loader = readable(null, (setVal) => {
  setVal(loaderObj);
  return () => {};
});
export const notifier = readable(null, (setVal) => {
  setVal(notifierObj);
  return () => {};
});
export const alerter = readable(null, (setVal) => {
  setVal(alerterObj);
  return () => {};
});
export const localStorage = readable({
  set,
  setAll,
  get,
  getAll,
  transact,
  clear,
  has,
  remove,
  each,
  add,
  keys,
  size,
  clearAll,
});

// Export Utilty Setters
export const setRouter = readable((val) => {
  routerObj = val;
});
export const setLoader = readable((val) => {
  if (!loaderObj) loaderObj = val;
});
export const setNotifier = readable((val) => {
  if (!notifierObj) notifierObj = val;
});
export const setAlerter = readable((val) => {
  if (!alerterObj) alerterObj = val;
});
