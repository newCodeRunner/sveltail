<script>
  import { createEventDispatcher } from 'svelte';
  import Icon from './Icon.svelte';

  import { getString, getIcon, getBoolean, getColor, getHeight, getWidth, getTextSize } from '../js/helpers';

  // Globals
  const dispatch = createEventDispatcher();

  let _class, _label, _icon, _iconRight, _flat, _circle, _rounded, _caps, _pill, _colorBg, _colorText, _height, _width, _textSize, _size;

  $: _size = getString($$props.size, 'md');
  $: _class = getString($$props.class);
  $: _label = getString($$props.label, null);
  $: _icon = getIcon($$props.icon);
  $: _iconRight = getIcon($$props.iconRight);
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
    dispatch('click');
    evt.target.blur();
  };
  const onBlur = () => {
    dispatch('blur');
  };
  
  export let loading = false;
</script>

{#if process.env.platform === 'ns-android' || process.env.platform === 'ns-ios'}
  <button backgroundColor={_colorBg} on:tap={onClick} >
    <formattedString color={_colorText}>
      {#if _icon}<Icon icon={_icon.text} class={_icon.class} />{/if}
      {#if _label}<span text={_label} />{/if}
      {#if _iconRight}<Icon icon={_iconRight.text} class={_iconRight.class} />{/if}
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
        hover:bg-{_colorText === 'current' ? 'info' : _colorText}
        hover:text-{_colorBg === 'transparent' ? 'white' : _colorBg}
      transform
        focus:bg-{_colorText === 'current' ? 'info' : _colorText}
        focus:text-{_colorBg === 'transparent' ? 'white' : _colorBg}
      bg-{_colorBg}
      text-{_colorText}  
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
    <div class="st-effect-ripple bg-{_colorBg === 'transparent' ? _colorText : _colorBg}" />
    {#if _icon}<Icon icon={_icon} size={_size} />{/if}
    {#if _label}<div class="{_textSize} mx-2 whitespace-nowrap">{_caps ? _label.toUpperCase() : _label}</div>{/if}
    {#if _iconRight}<Icon icon={_iconRight} size={_size} />{/if}
  </button>
{/if}
