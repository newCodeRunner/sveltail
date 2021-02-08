<script>
  import Icon from './Icon.svelte';
  import Image from './Image.svelte';

  // Globals
  import { getString, getIcon, getBoolean, getColor, getHeight, getWidth, getFontSize, isString } from '../js/helpers';
  
  let _class, _letter, _icon, _fontSize, _circle, _img, _colorBg, _colorText, _height, _width, _size;

  $: _size = getString($$props.size, 'md');
  $: _class = getString($$props.class);
  $: _icon = getIcon($$props.icon);
  $: _img = getString($$props.img, null);
  $: _letter = isString($$props.letter) ? String($$props.letter).toUpperCase().substr(0, 1) : null;
  $: _circle = getBoolean($$props.circle);
  $: _colorBg = getColor($$props.colorBg, 'transparent');
  $: _colorText = getColor($$props.colorText, 'current');
  $: _height = getHeight($$props.size, 'md');
  $: _width = getWidth($$props.size, 'md');
  $: _fontSize = getFontSize($$props.size, 'md');
</script>

{#if process.env.platform === 'ns-android' || process.env.platform === 'ns-ios'}
  <span />
{/if}

{#if process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios'}
  {#if _icon}
    <Icon
      class="
        border
        bg-{_colorBg}
        text-{_colorText}
        border-{_colorBg === 'transparent' ? _colorText : _colorBg}
        {_circle ? 'rounded-full' : ''}
        {_class}
      "
      icon={_icon}
      size={_size}
    />
  {:else if _img}
    <Image
      class="
        border
        bg-{_colorBg}
        text-{_colorText}
        border-{_colorBg === 'transparent' ? _colorText : _colorBg}
        {_circle ? 'rounded-full object-cover' : ''}
        {_class}
      "
      img={_img}
    />
  {:else}
    <div
      class="
        flex
        justify-center
        items-center
        border
        bg-{_colorBg}
        text-{_colorText}
        border-{_colorBg === 'transparent' ? _colorText : _colorBg}
        {_circle ? 'rounded-full' : ''}
        {_height} 
        {_width}
        {_class}
      "
    > 
      {#if _letter}
        <span style="font-size: {_fontSize}px;">{_letter}</span>
      {:else}
        <slot />
      {/if}
    </div>
  {/if}
{/if}
  