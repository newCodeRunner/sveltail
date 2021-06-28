const isArray = (value) => value && typeof value === 'object' && value.constructor === Array;

module.exports = (css, cwd) => {
  const currDirectory = cwd.replace(/\\/g, '/');

  const modifiedCSS = { ...css };

  // Setup Purging
  if (!modifiedCSS.purge) modifiedCSS.purge = { content: [], css: [] };
  if (isArray(modifiedCSS.purge)) modifiedCSS.purge.content = modifiedCSS.purge;

  modifiedCSS.purge.content.push(`${currDirectory}/src/**/*.html`);
  modifiedCSS.purge.content.push(`${currDirectory}/src/**/*.svelte`);
  modifiedCSS.purge.content.push(`${currDirectory}/node_modules/sveltail/lib/**/*.svelte`);

  modifiedCSS.purge.content.push(`${currDirectory}/node_modules/sveltail/lib/**/*.js`);

  modifiedCSS.purge.css.push(`${currDirectory}/src/**/*.css`);
  modifiedCSS.purge.css.push(`${currDirectory}/node_modules/sveltail/lib/css/**/*.css`);

  return modifiedCSS;
};
