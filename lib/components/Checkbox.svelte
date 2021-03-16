<script>
  import { getString, getColor, getTextSize, getBoolean, isAllowedSize } from '../js/helpers';
  
  import IconChecked from '../icons/Checked.svelte';
  import IconUnchecked from '../icons/Unchecked.svelte';

  let _class, _label, _textSize, _color, _disabled;
  $: _class = getString($$props.class);
  $: _label = getString($$props.label, null);
  $: _textSize = getTextSize($$props.size, 'md');
  $: _color = getColor($$props.color, 'current');
  $: _size = isAllowedSize($$props.size) ? getString($$props.size, 'md') : 'md';
  $: _disabled = getBoolean($$props.disabled);

  const _update = (evt) => {
    if (!_disabled) value = !value; 
    else evt.preventDefault();
  };
  export let value = false;
</script>

<div
  class="inline-flex text-{_color} {!_disabled ? 'cursor-pointer' : ''} {_class}"
  on:click={_update}
>
  {#if value}
    <IconChecked size={_size} />
  {:else}
    <IconUnchecked size={_size} />
  {/if}

  {#if _label}
    <div class="px-2 {_textSize}">{_label}</div>
  {/if}
</div>
