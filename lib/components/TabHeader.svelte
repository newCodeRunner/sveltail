<script>
  import { onMount } from 'svelte';
  import { Icon } from 'sveltail';
  import { getString, getIcon, getSize } from '../js/helpers';

  let _name, _class, _activeClass, _label, _icon, _iconRight;
  $: _name = getString(String($$props.name));
  $: _class = getString($$props.class);
  $: _activeClass = getString($$props.activeClass);
  $: _label = getString($$props.label);
  $: _icon = getIcon($$props.icon);
  $: _iconRight = getIcon($$props.iconRight);
  $: _size = getSize($$props.size, 'md');

  let _active;
  let _tabHeader;
  let parent;

  const _activate = () => {
    _active = true;
    parent.dispatchEvent(new CustomEvent('tab-change', { detail: _name }));
  };

  onMount(() => {
    parent = _tabHeader;
    while (!parent.classList.contains('st-tab-container')) {
      parent = parent.parentElement;  
    }

    const selectedTab = parent.getAttribute('initial');
    if (selectedTab === _name) _activate();
  });
</script>
  
<li
  bind:this={_tabHeader}
  on:click={_activate}
>
  <div class="flex justify-center items-center cursor-pointer px-2 {_class} {_active ? _activeClass : ''}">
    {#if _icon}
      <Icon icon={_icon} size={_size} />
    {/if}
    {#if _label}
      <div class="mx-2 whitespace-nowrap">{_label}</div>
    {/if}
    {#if _iconRight}
      <Icon icon={_iconRight} size={_size} />
    {/if}

    <slot />
  </div> 
</li>
