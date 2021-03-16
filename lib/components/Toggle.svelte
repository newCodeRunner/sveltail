<script>
  import { getString, getColor, getTextSize, getBoolean, isAllowedSize } from '../js/helpers';

  import IconToggle from '../icons/Toggle.svelte';

  let _class, _label, _textSize, _color, _disabled, _size;
  $: _class = getString($$props.class);
  $: _label = getString($$props.label, "");
  $: _textSize = getTextSize($$props.size, "md");
  $: _color = getColor($$props.color, "primary");
  $: _size = isAllowedSize($$props.size) ? getString($$props.size, 'md') : 'md';
  $: _disabled = getBoolean($$props.disabled);

  export let value = false;
  const _update = (evt) => {
    if (!_disabled) value = !value; 
    else evt.preventDefault();
  };
</script>

<div
  class="inline-flex text-{_color} {!_disabled ? 'cursor-pointer' : ''} {_class}"
  on:click={_update}
>
  <IconToggle size={_size} class="{value ? '' : 'text-info transform rotate-180'}" />

  {#if _label}
    <div class="px-2 {_textSize}">{_label}</div>
  {/if}
</div>
