<script>
  import { getContext, createEventDispatcher } from 'svelte';

  // Globals
  const dispatch = createEventDispatcher();
  const { getString, getFontSize } = getContext('$$app').helpers;

  let _class, _icon, _fontSize;

  $:  _icon = getString($$props.icon, null);
  $:  _class = getString($$props.class);
  $:  _fontSize = getFontSize($$props.size, 'md');

  if ($$props.fontSize) props.fontSize = $$props.fontSize;
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
