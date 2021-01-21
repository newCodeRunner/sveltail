const isArray = (value) => value && typeof value === 'object' && value.constructor === Array;

module.exports = (css) => {
  const modifiedCSS = { ...css };

  // Update Brand Theme if user Eemoved from Preferences
  if (!modifiedCSS.theme) modifiedCSS.extend = {};
  if (!modifiedCSS.theme.extend) modifiedCSS.theme.extend = {};
  if (!modifiedCSS.theme.extend.colors) modifiedCSS.extend.colors = {};
  if (!modifiedCSS.theme.extend.colors.brand) modifiedCSS.theme.extend.colors.brand = '#009999';
  if (!modifiedCSS.theme.extend.colors.accent) modifiedCSS.theme.extend.colors.accent = '#e6b89c';
  if (!modifiedCSS.theme.extend.colors.primary) modifiedCSS.theme.extend.colors.primary = '#0496ff';
  if (!modifiedCSS.theme.extend.colors.secondary) modifiedCSS.theme.extend.colors.secondary = '#5eb1bf';
  if (!modifiedCSS.theme.extend.colors.info) modifiedCSS.theme.extend.colors.info = '#818181';
  if (!modifiedCSS.theme.extend.colors.light) modifiedCSS.theme.extend.colors.light = '#ffffff';
  if (!modifiedCSS.theme.extend.colors.dark) modifiedCSS.theme.extend.colors.dark = '#000000';
  if (!modifiedCSS.theme.extend.colors.success) modifiedCSS.theme.extend.colors.success = '#90be6d';
  if (!modifiedCSS.theme.extend.colors.warning) modifiedCSS.theme.extend.colors.warning = '#ff9f1c';
  if (!modifiedCSS.theme.extend.colors.danger) modifiedCSS.theme.extend.colors.danger = '#d81159';

  // Setup Purging
  if (isArray(modifiedCSS.purge)) {
    modifiedCSS.purge = {
      content: modifiedCSS.purge,
    };
  }
  if (!modifiedCSS.purge) modifiedCSS.purge = { content: [] };
  modifiedCSS.purge.content.push('./src/**/*.html');
  modifiedCSS.purge.content.push('./src/**/*.svelte');
  modifiedCSS.purge.content.push('./node_modules/sveltail/lib/**/*');

  // Set up WhiteList
  if (!modifiedCSS.purge.options) modifiedCSS.purge.options = {};
  if (!modifiedCSS.purge.options.safelist) modifiedCSS.purge.options.safelist = [];

  // Whitelist background classes
  modifiedCSS.purge.options.safelist.push('bg-transparent');
  modifiedCSS.purge.options.safelist.push('bg-current');
  modifiedCSS.purge.options.safelist.push('bg-brand');
  modifiedCSS.purge.options.safelist.push('bg-accent');
  modifiedCSS.purge.options.safelist.push('bg-primary');
  modifiedCSS.purge.options.safelist.push('bg-secondary');
  modifiedCSS.purge.options.safelist.push('bg-info');
  modifiedCSS.purge.options.safelist.push('bg-light');
  modifiedCSS.purge.options.safelist.push('bg-dark');
  modifiedCSS.purge.options.safelist.push('bg-success');
  modifiedCSS.purge.options.safelist.push('bg-warning');
  modifiedCSS.purge.options.safelist.push('bg-danger');

  // Whitelist text classes
  modifiedCSS.purge.options.safelist.push('text-transparent');
  modifiedCSS.purge.options.safelist.push('text-current');
  modifiedCSS.purge.options.safelist.push('text-brand');
  modifiedCSS.purge.options.safelist.push('text-accent');
  modifiedCSS.purge.options.safelist.push('text-primary');
  modifiedCSS.purge.options.safelist.push('text-secondary');
  modifiedCSS.purge.options.safelist.push('text-info');
  modifiedCSS.purge.options.safelist.push('text-light');
  modifiedCSS.purge.options.safelist.push('text-dark');
  modifiedCSS.purge.options.safelist.push('text-success');
  modifiedCSS.purge.options.safelist.push('text-warning');
  modifiedCSS.purge.options.safelist.push('text-danger');

  return modifiedCSS;
};
