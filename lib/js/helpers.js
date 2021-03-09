/* eslint-disable max-len */
const colors = JSON.parse(process.env.colors);
const screens = process.env.screens ? JSON.parse(process.env.screens) : { sm: '640px', md: '768px', lg: '1024px' };

export const isString = (value) => typeof value === 'string' || value instanceof String;
export const isNumber = (value) => typeof value === 'number' && value !== Infinity;
export const isBoolean = (value) => typeof value === 'boolean';
export const isArray = (value) => value && typeof value === 'object' && value.constructor === Array;
export const isObject = (value) => value && typeof value === 'object' && value.constructor === Object;
export const isFunction = (value) => typeof value === 'function';
export const isNull = (value) => value === null;
export const isUndefined = (value) => typeof value === 'undefined';
export const isAllowedColor = (value) => [...Object.keys(colors), 'transparent', 'current'].findIndex((i) => i.split('-')[0] === value) > -1;
export const isAllowedSize = (value) => ['xs', 'sm', 'md', 'lg', 'xl', 'auto'].findIndex((i) => i === value) > -1;
export const isAllowedBreakpoint = (value) => Object.keys(screens).findIndex((i) => i === value) > -1;

export const getSize = (size, defaultVal) => {
  let sizeClass = '';

  let calcSize = size;
  if (defaultVal) calcSize = isAllowedSize(size) ? size : defaultVal;

  if (calcSize === 'xs') sizeClass += 'h-8 w-8 ';
  else if (calcSize === 'sm') sizeClass += 'h-9 w-9 ';
  else if (calcSize === 'md') sizeClass += 'h-10 w-10 ';
  else if (calcSize === 'lg') sizeClass += 'h-12 w-12 ';
  else if (calcSize === 'xl') sizeClass += 'h-14 w-14 ';
  else if (calcSize === 'auto') sizeClass += '';

  return sizeClass;
};

export const getHeight = (size, defaultVal) => {
  let heightClass = '';

  let calcSize = size;
  if (defaultVal) calcSize = isAllowedSize(size) ? size : defaultVal;

  if (calcSize === 'xs') heightClass += 'h-8 ';
  else if (calcSize === 'sm') heightClass += 'h-9 ';
  else if (calcSize === 'md') heightClass += 'h-10 ';
  else if (calcSize === 'lg') heightClass += 'h-12 ';
  else if (calcSize === 'xl') heightClass += 'h-14 ';
  else if (calcSize === 'auto') heightClass += '';

  return heightClass;
};

export const getWidth = (size, defaultVal) => {
  let widthClass = '';

  let calcSize = size;
  if (defaultVal) calcSize = isAllowedSize(size) ? size : defaultVal;

  if (calcSize === 'xs') widthClass += 'w-8 ';
  else if (calcSize === 'sm') widthClass += 'w-9';
  else if (calcSize === 'md') widthClass += 'w-10 ';
  else if (calcSize === 'lg') widthClass += 'w-12 ';
  else if (calcSize === 'xl') widthClass += 'w-14 ';
  else if (calcSize === 'auto') widthClass += '';

  return widthClass;
};

export const getTextSize = (size, defaultVal) => {
  let textClass = '';

  let calcSize = size;
  if (defaultVal) calcSize = isAllowedSize(size) ? size : defaultVal;

  if (calcSize === 'xs') textClass += 'text-xs ';
  else if (calcSize === 'sm') textClass += 'text-sm ';
  else if (calcSize === 'md') textClass += 'text-md ';
  else if (calcSize === 'lg') textClass += 'text-lg ';
  else if (calcSize === 'xl') textClass += 'text-xl ';
  else if (calcSize === 'auto') textClass += '';

  return textClass;
};

export const getFontSize = (size, defaultVal) => {
  let fontSize = 0;

  let calcSize = size;
  if (defaultVal) calcSize = isAllowedSize(size) ? size : defaultVal;

  if (calcSize === 'xs') fontSize = 12;
  else if (calcSize === 'sm') fontSize = 16;
  else if (calcSize === 'md') fontSize = 20;
  else if (calcSize === 'lg') fontSize = 24;
  else if (calcSize === 'xl') fontSize = 28;

  return fontSize;
};

export const getColor = (val, defaultVal) => {
  let color = val;
  if (isUndefined(val) || isNull(val) || !isString(val) || !isAllowedColor(val)) color = defaultVal;
  if (process.env.platform === 'ns-android' || process.env.platform === 'ns-ios') {
    if (color === 'transparent') color = '#00FFFFFF';
    else color = colors[color];
  }
  return color;
};

export const getArray = (items, def) => {
  let arr = [];
  if (isArray(items)) arr = items;
  else if (isObject(items)) arr = [items];
  else if (def !== undefined) arr = def;
  return arr;
};

export const getBoolean = (val, def) => {
  let bool = val;
  if (isUndefined(val) || isNull(val) || !isBoolean(val)) bool = def !== undefined ? def : false;
  return bool;
};

export const getString = (val, def) => {
  let str = val;
  if (isUndefined(val) || isNull(val) || !isString(val)) str = def !== undefined ? def : '';
  return str;
};

export const getNumber = (val, def) => {
  let num = val;
  if (isUndefined(val) || isNull(val) || !isNumber(val)) num = def !== undefined ? def : 0;
  return num;
};

export default {
  isString,
  isNumber,
  isBoolean,
  isArray,
  isObject,
  isFunction,
  isNull,
  isUndefined,
  isAllowedColor,
  isAllowedSize,
  isAllowedBreakpoint,
  getSize,
  getHeight,
  getWidth,
  getTextSize,
  getFontSize,
  getColor,
  getArray,
  getBoolean,
  getString,
  getNumber,
};
