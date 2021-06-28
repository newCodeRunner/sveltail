/* eslint-disable max-len */
export const isString = (value) => typeof value === 'string' || value instanceof String;
export const isNumber = (value) => typeof value === 'number' && value !== Infinity;
export const isBoolean = (value) => typeof value === 'boolean';
export const isArray = (value) => value && typeof value === 'object' && value.constructor === Array;
export const isObject = (value) => value && typeof value === 'object' && value.constructor === Object;
export const isFunction = (value) => typeof value === 'function';
export const isNull = (value) => value === null;
export const isUndefined = (value) => typeof value === 'undefined';
export const isNullOrUndefined = (value) => typeof value === 'undefined' || value === null;

export const getArray = (items, def) => {
  let arr = [];
  if (items) {
    if (isArray(items)) arr = items;
    else if (isObject(items)) arr = [items];
    else if (def !== undefined) arr = def;
  } else if (def !== undefined) arr = def;
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
  getArray,
  getBoolean,
  getString,
  getNumber,
};
