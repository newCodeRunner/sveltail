<script>
  import { getString, getBoolean, getColor, getHeight, getTextSize } from '../js/helpers';
  import IconDismiss from '../icons/Dismiss.svelte';

  // Globals
  let _size, _class, _label, _pill, _rounded, _dismissable, _colorBg, _colorText, _height, _textSize;

  $: _size = getString($$props.size, 'md');
  $: _class = getString($$props.class);
  $: _label = getString($$props.label, null);
  $: _pill = getBoolean($$props.pill);
  $: _rounded = getBoolean($$props.rounded);
  $: _dismissable = getBoolean($$props.dismissable);
  $: _colorBg = getColor($$props.colorBg, 'primary');
  $: _colorText = getColor($$props.colorText, 'white');
  $: _height = getHeight($$props.size, 'md');
  $: _textSize = getTextSize($$props.size, 'md');

  let chip;
  const dismiss = () => {
    if (process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios') {
      if (chip) chip.remove();
    }
  };
</script>

{#if process.env.platform === 'ns-android' || process.env.platform === 'ns-ios'}
  <span />
{/if}

{#if process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios'}
  <div
    bind:this="{chip}"
    class="
      inline-flex
      justify-center
      items-center
      border
      bg-{_colorBg}
      text-{_colorText}
      border-{_colorBg === 'transparent' ? _colorText : _colorBg}
      {_rounded || _pill ? 'rounded' : ''}
      {_pill ? 'rounded-full px-4' : 'px-2'}
      {_class}
      {_height}
    "
  >
    <slot name="left" />  
    {#if _label}<div class="{_textSize} mx-2 whitespace-nowrap">{_label}</div>{/if}
    {#if _dismissable}
      <div class="cursor-pointer" on:click={dismiss}>
        <IconDismiss size={_size} />
      </div>
    {/if}
  </div>
{/if}
  