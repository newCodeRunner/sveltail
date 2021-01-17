<script>
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { Icon } from 'sveltail';
  import { getColor, getString } from '../js/helpers';

  let _class, _label, _name, _borderColor, _textColor;
  $: _class = getString($$props.class);
  $: _label = getString($$props.label);
  $: _name = getString(String($$props.name));
  $: _borderColor = getColor($$props.borderColor, 'primary');
  $: _textColor = getColor($$props.textColor, 'primary');

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

<div bind:this={_accordian} class="my-2 w-full overflow-hidden border-l-2 border-{_borderColor}">
  <div class="flex items-center p-2 cursor-pointer text-{_textColor} hover:opacity-75" on:click={_toggle}>
    <Icon icon="fas fa-chevron-circle-right" size="sm" class="transition transform {_expand ? 'rotate-90' : 'rotate-0'}" />
    {#if _label}
      <span class="px-2">{_label}</span>
    {/if}
  </div>
  {#if _expand}
    <div
      class="w-full {_class}" 
      in:fly="{{ y: -20, duration: 200 }}"
      out:fly="{{ y: -20, duration: 150 }}"
    >
      <slot />
    </div>
  {/if}
</div>