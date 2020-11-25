/* eslint-disable max-len */
const colors = JSON.parse(process.env.colors);
const screens = JSON.parse(process.env.screens);

export default () => ({
  isString: (value) => typeof value === 'string' || value instanceof String,
  isNumber: (value) => typeof value === 'number' && value !== Infinity,
  isBoolean: (value) => typeof value === 'boolean',
  isArray: (value) => value && typeof value === 'object' && value.constructor === Array,
  isObject: (value) => value && typeof value === 'object' && value.constructor === Object,
  isFunction: (value) => typeof value === 'function',
  isNull: (value) => value === null,
  isUndefined: (value) => typeof value === 'undefined',
  isAllowedColor: (value) => [...Object.keys(colors), 'transparent'].findIndex((i) => i.split('-')[0] === value) > -1,
  isAllowedSize: (value) => ['xs', 'sm', 'md', 'lg', 'xl', 'auto'].findIndex((i) => i === value) > -1,
  isAllowedBreakpoint: (value) => Object.keys(screens).findIndex((i) => i === value) > -1,
  getSize(size, defaultVal) {
    let sizeClass = '';

    let calcSize = size;
    if (defaultVal) calcSize = this.isAllowedSize(size) ? size : defaultVal;

    if (calcSize === 'xs') sizeClass += 'h-8 w-8 ';
    else if (calcSize === 'sm') sizeClass += 'h-10 w-10 ';
    else if (calcSize === 'md') sizeClass += 'h-12 w-12 ';
    else if (calcSize === 'lg') sizeClass += 'h-16 w-16 ';
    else if (calcSize === 'xl') sizeClass += 'h-20 w-20 ';
    else if (calcSize === 'auto') sizeClass += '';

    return sizeClass;
  },
  getHeight(size, defaultVal) {
    let heightClass = '';

    let calcSize = size;
    if (defaultVal) calcSize = this.isAllowedSize(size) ? size : defaultVal;

    if (calcSize === 'xs') heightClass += 'h-8 ';
    else if (calcSize === 'sm') heightClass += 'h-10 ';
    else if (calcSize === 'md') heightClass += 'h-12 ';
    else if (calcSize === 'lg') heightClass += 'h-16 ';
    else if (calcSize === 'xl') heightClass += 'h-20 ';
    else if (calcSize === 'auto') heightClass += '';

    return heightClass;
  },
  getWidth(size, defaultVal) {
    let widthClass = '';

    let calcSize = size;
    if (defaultVal) calcSize = this.isAllowedSize(size) ? size : defaultVal;

    if (calcSize === 'xs') widthClass += 'w-8 ';
    else if (calcSize === 'sm') widthClass += 'w-10 ';
    else if (calcSize === 'md') widthClass += 'w-12 ';
    else if (calcSize === 'lg') widthClass += 'w-16 ';
    else if (calcSize === 'xl') widthClass += 'w-20 ';
    else if (calcSize === 'auto') widthClass += '';

    return widthClass;
  },
  getTextSize(size, defaultVal) {
    let textClass = '';

    let calcSize = size;
    if (defaultVal) calcSize = this.isAllowedSize(size) ? size : defaultVal;

    if (calcSize === 'xs') textClass += 'text-xs leading-none ';
    else if (calcSize === 'sm') textClass += 'text-sm leading-none ';
    else if (calcSize === 'md') textClass += 'text-lg leading-none ';
    else if (calcSize === 'lg') textClass += 'text-2xl leading-none ';
    else if (calcSize === 'xl') textClass += 'text-3xl leading-none ';
    else if (calcSize === 'auto') textClass += '';

    return textClass;
  },
  getFontSize(size, defaultVal) {
    let fontSize = 0;

    let calcSize = size;
    if (defaultVal) calcSize = this.isAllowedSize(size) ? size : defaultVal;

    if (calcSize === 'xs') fontSize = 16;
    else if (calcSize === 'sm') fontSize = 20;
    else if (calcSize === 'md') fontSize = 28;
    else if (calcSize === 'lg') fontSize = 40;
    else if (calcSize === 'xl') fontSize = 52;

    return fontSize;
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
  getColor(val, defaultVal) {
    let color = val;
    if (this.isUndefined(val) || this.isNull(val) || !this.isString(val) || !this.isAllowedColor(val)) color = defaultVal;
    if (process.env.platform === 'ns-android' || process.env.platform === 'ns-ios') {
      if (color === 'transparent') color = '#00FFFFFF';
      else color = colors[color];
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
});
