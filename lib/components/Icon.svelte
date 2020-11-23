<script>
  // Globals
  const { helpers } = getContext('$$app');
  const props = {
    icon: helpers.isString($$props.icon) ? $$props.icon : null,
    class: helpers.isString($$props.class) ? $$props.class : '',
    sizeClass: helpers.getSize($$props.sizeClass),
  };
  let src = null;

  if (props.icon !== null) {
    if (process.env.platform === 'ns-android' || process.env.platform === 'ns-ios') {
      src = props.icon;
    }

    if (process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios') {
      let type;
      const [prefix, svgID] = props.icon.split(' ');
      if (prefix === 'fas') type = 'fa-solid.svg#solid_';
      else if (prefix === 'fab') type = 'fa-brands.svg#brands_';
      else if (prefix === 'far') type = 'fa-regular.svg#regular_';

      if (svgID) src = `/svg/${type}${svgID.replace('fa-', '')}`;
    }
  }
</script>

{#if src}
  {#if process.env.platform === 'ns-android' || process.env.platform === 'ns-ios'}
    <span text={String.fromCharCode(src)} class="{props.class}" />
  {/if}

  {#if process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios'}
    <svg class="text-{props.color} {props.class} {props.sizeClass}"><use width="100%" height="100%" fill="currentColor" xlink:href={src} href={src} /></svg>
  {/if}
{/if}
