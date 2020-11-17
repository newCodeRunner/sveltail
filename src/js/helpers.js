/* eslint-disable max-len */
import { productTheme } from '../../package.json';
import { theme } from '../../build/tailwindcss/config';

export default {
  isString: (value) => typeof value === 'string' || value instanceof String,
  isNumber: (value) => typeof value === 'number' && value !== Infinity,
  isBoolean: (value) => typeof value === 'boolean',
  isArray: (value) => value && typeof value === 'object' && value.constructor === Array,
  isObject: (value) => value && typeof value === 'object' && value.constructor === Object,
  isFunction: (value) => typeof value === 'function',
  isNull: (value) => value === null,
  isUndefined: (value) => typeof value === 'undefined',
  isAllowedColor: (value) => [...Object.keys(productTheme), ...Object.keys(theme.colors)].findIndex((i) => i.split('-')[0] === value) > -1,
  isAllowedSize: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].findIndex((i) => i === value) > -1,
  isAllowedBreakpoint: (value) => Object.keys(theme.screens).findIndex((i) => i === value) > -1,
  getSize(size) {
    let sizeClass = '';

    if (size === 'xs') sizeClass += 'h-8 w-8 ';
    else if (size === 'sm') sizeClass += 'h-10 w-10 ';
    else if (size === 'md') sizeClass += 'h-12 w-12 ';
    else if (size === 'lg') sizeClass += 'h-16 w-16 ';
    else if (size === 'xl') sizeClass += 'h-20 w-20 ';
    else if (size === 'auto') sizeClass += '';

    return sizeClass;
  },
  getHeight(size) {
    let heightClass = '';

    if (size === 'xs') heightClass += 'h-8 ';
    else if (size === 'sm') heightClass += 'h-10 ';
    else if (size === 'md') heightClass += 'h-12 ';
    else if (size === 'lg') heightClass += 'h-16 ';
    else if (size === 'xl') heightClass += 'h-20 ';
    else if (size === 'auto') heightClass += '';

    return heightClass;
  },
  getWidth(size) {
    let widthClass = '';

    if (size === 'xs') widthClass += 'w-8 ';
    else if (size === 'sm') widthClass += 'w-10 ';
    else if (size === 'md') widthClass += 'w-12 ';
    else if (size === 'lg') widthClass += 'w-16 ';
    else if (size === 'xl') widthClass += 'w-20 ';
    else if (size === 'auto') widthClass += '';

    return widthClass;
  },
  getTextSize(size) {
    let textClass = '';

    if (size === 'xs') textClass += 'text-xs leading-none ';
    else if (size === 'sm') textClass += 'text-sm leading-none ';
    else if (size === 'md') textClass += 'text-lg leading-none ';
    else if (size === 'lg') textClass += 'text-2xl leading-none ';
    else if (size === 'xl') textClass += 'text-3xl leading-none ';
    else if (size === 'auto') textClass += '';

    return textClass;
  },
  getIcon(icn) {
    let icon = icn;
    if (this.isUndefined(icn) || this.isNull(icn) || !this.isString(icn)) icon = null;
    if (process.env.platform === 'ns-android' || process.env.platform === 'ns-ios') {
      if (icon) {
        const temp = icn.split(' ');
        icon = {
          class: temp[0],
          text: `0x${temp[2]}`,
        };
      }
    }
    return icon;
  },
  getColor(val, def) {
    let color = val;
    if (this.isUndefined(val) || this.isNull(val) || !this.isString(val) || !this.isAllowedColor(val)) color = def;
    if (process.env.platform === 'ns-android' || process.env.platform === 'ns-ios') {
      color = productTheme[color];
    }
    return color;
  },
  getArray(items) {
    let arr = [];
    if (this.isArray(items)) arr = items;
    else if (this.isObject(items)) arr = [items];
    return arr;
  },
  getBoolean(val) {
    let bool = val;
    if (this.isUndefined(val) || this.isNull(val) || !this.isBoolean(val)) bool = false;
    return bool;
  },
};
