<script>
  // Globals
  let src = null;
  const props = $$props;

  if (props.icon !== null) {
    let type;
    const [prefix, svgID] = props.icon.split(' ');
    if (prefix === 'gg') type = 'css-gg.svg#all_gg-';
    else if (prefix === 'fas') type = 'fa-solid.svg#solid_';
    else if (prefix === 'fab') type = 'fa-brands.svg#brands_';
    else if (prefix === 'far') type = 'fa-regular.svg#regular_';

    if (svgID) src = `/svg/${type}${svgID.replace('fa-', '')}`;
  }
</script>

{#if src}
  <svg class="text-{props.color} {props.class} {props.sizeClass}"><use width="100%" height="100%" fill="currentColor" xlink:href={src} href={src} /></svg>
{/if}
