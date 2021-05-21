<script>
  import { createEventDispatcher } from 'svelte';
import { prevent_default } from 'svelte/internal';
  import { getString, getBoolean, getColor, getHeight, getWidth, getTextSize } from '../js/helpers';

  // Globals
  const dispatch = createEventDispatcher();

  let _class, _label, _flat, _circle, _rounded, _caps, _pill, _colorBg, _colorText, _height, _width, _textSize, _size;

  $: _size = getString($$props.size, 'md');
  $: _class = getString($$props.class);
  $: _label = getString($$props.label, null);
  $: _flat = getBoolean($$props.flat);
  $: _circle = getBoolean($$props.circle);
  $: _rounded = getBoolean($$props.rounded);
  $: _caps = getBoolean($$props.caps);
  $: _pill = getBoolean($$props.pill);
  $: _colorBg = getColor($$props.colorBg, 'transparent');
  $: _colorText = getColor($$props.colorText, 'current');
  $: _height = getHeight($$props.size, 'md');
  $: _width = getWidth($$props.size, 'md');
  $: _textSize = getTextSize($$props.size, 'md');
  $: _disabled = getBoolean($$props.disabled);

  const onClick = (evt) => {
    if (_disabled) evt.preventDefault();
    else dispatch('click');
    evt.target.blur();
  };
  
  export let loading = false;
</script>

{#if process.env.platform === 'ns-android' || process.env.platform === 'ns-ios'}
  <button backgroundColor={_colorBg} on:tap={onClick} >
    <formattedString color={_colorText}>
      {#if _label}<span text={_label} />{/if}
    </formattedString>
  </button>
{/if}

{#if process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios'}
  <button
    class="
      flex
      justify-center
      items-center
      relative
      focus:outline-none
      focus:none
      transition
        ease-in-out
      transform
        {!_disabled ? `hover:bg-${_colorText === 'current' ? 'info' : _colorText}` : ''}
        {!_disabled ? `hover:text-${_colorBg === 'transparent' ? 'light' : _colorBg}` : ''}
      transform
        focus:bg-{_colorText === 'current' ? 'info' : _colorText}
        focus:text-{_colorBg === 'transparent' ? 'light' : _colorBg}
      bg-{_colorBg}
      text-{_colorText}
      {_disabled ? 'cursor-not-allowed' : ''}
      {_flat ? '' : `border border-${_colorBg === 'transparent' ? _colorText : _colorBg}`}
      {_rounded || _pill ? 'rounded' : ''}
      {_pill || _circle ? 'rounded-full' : ''}
      {_pill ? 'px-4' : 'px-2'}
      {_circle || !_label ? _width : ''}
      {_height}
      {_class}
    "
    on:click={onClick}
    aria-label={_label ? `Button ${_label}` : 'Action Button'}
    disabled={loading || _disabled}
  >
    {#if !_disabled}
      <div class="st-effect-ripple bg-{_colorBg === 'transparent' ? _colorText : _colorBg}" />
    {/if}
    <slot name="left" />
    <slot>
      {#if _label}<div class="{_textSize} mx-2 whitespace-nowrap">{_caps ? _label.toUpperCase() : _label}</div>{/if}
    </slot>
    <slot name="right" />
  </button>
{/if}
