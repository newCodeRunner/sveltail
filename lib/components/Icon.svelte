<script>
  import { createEventDispatcher } from 'svelte';
  import { getString, getFontSize } from '../js/helpers';

  // Globals
  const dispatch = createEventDispatcher();

  let _class, _icon, _fontSize;

  $:  _icon = getString($$props.icon, null);
  $:  _class = getString($$props.class);
  $:  _fontSize = getFontSize($$props.size, 'md');

  if ($$props.fontSize) _fontSize = $$props.fontSize;
  const onClick = () => {
    dispatch('click');
  };
</script>

{#if _icon}
  {#if process.env.platform === 'ns-android' || process.env.platform === 'ns-ios'}
    <span text={String.fromCharCode(_icon.text)} class="{_class} {_icon.class}" />
  {/if}

  {#if process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios'}
    <i class="{_class} {_icon}" style="font-size: {_fontSize}px;" on:click={onClick} />
  {/if}
{/if}
