<script>
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { getColor, getString, getHeight, getWidth } from '../js/helpers';

  import IconArrowRight from '../icons/ArrowRight.svelte';

  let _class, _innerClass, _label, _name, _borderColor, _textColor, _iconHeight, _iconWidth;
  $: _class = getString($$props.class);
  $: _innerClass = getString($$props.innerClass);
  $: _label = getString($$props.label);
  $: _name = getString(String($$props.name));
  $: _borderColor = getColor($$props.colorBorder, null);
  $: _textColor = getColor($$props.colorText, 'current');

  $: _iconHeight = getHeight($$props.iconSize, 'xs');
  $: _iconWidth = getWidth($$props.iconSize, 'xs');

  let _expand = false;

  let _single = false;
  let _accordian;
  let parent;

  const _collapse = ({ detail }) => {
    if (detail !== _name) _expand = false;
  };
  const _toggle = () => {
    _expand = !_expand;
  };

  $:  if (_expand && _single) parent.dispatchEvent(new CustomEvent('accordian-change', { detail: _name }));
 
  onMount(() => {
    parent = _accordian.parentElement;

    const selected = parent.getAttribute('accordian');
    if (selected === _name) _expand = true;

    _single = parent.getAttribute('single') === 'true';

    parent.addEventListener('accordian-change', _collapse);
    return () => {
      parent.removeEventListener('accordian-change', _collapse);
    };
  });
</script>

<div
  bind:this={_accordian}
  class="w-full cursor-pointer text-{_textColor} overflow-hidden {_borderColor ? `border-l-2 border-${_borderColor}` : ''}"
>
  <div class="{_class} flex items-center hover:bg-info hover:text-dark dark:hover:text-light" on:click={_toggle}>
    {#if _label}<div>{_label}</div>{/if}
    <div class="flex-1" />
    <IconArrowRight class="p-2 transition transform {_expand ? 'rotate-90' : 'rotate-0'}" />
  </div>
  {#if _expand}
    <div
      class="w-full {_innerClass}" 
      in:fly="{{ y: -20, duration: 200 }}"
      out:fly="{{ y: -20, duration: 150 }}"
    >
      <slot />
    </div>
  {/if}
</div>