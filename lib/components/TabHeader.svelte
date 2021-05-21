<script>
  import { onMount } from 'svelte';
  import { getString, isFunction } from '../js/helpers';

  let _name;
  let _class;
  let _activeClass;
  let _label;

  $: _name = getString(String($$props.name));
  $: _class = getString($$props.class);
  $: _activeClass = getString($$props.activeClass, 'border-b-2 border-primary text-primary');
  $: _label = getString($$props.label);

  let _active;
  let _tabHeader;
  let parent;

  const _activate = () => {
    _active = true;
    parent.dispatchEvent(new CustomEvent('tab-change', { detail: _name }));
  };

  const _toggleState = ({ detail }) => {
    _active = _name === detail;
  };

  onMount(() => {
    parent = _tabHeader;
    while (!parent.classList.contains('st-tab-container')) {
      parent = parent.parentElement;
    }

    const selectedTab = parent.getAttribute('initial');
    if (selectedTab === _name) _activate();

    parent.addEventListener('tab-change', _toggleState);
    return () => {
      parent.removeEventListener('tab-change', _toggleState);
    };
  });
</script>
  
<li
  bind:this={_tabHeader}
  on:click={_activate}
>
  <div class="flex justify-center items-center cursor-pointer px-2 py-1 mt-1 mb-2 {_class} {_active ? _activeClass : ''}">
    <slot>
      <slot name="left" />
      {#if _label}
        <div class="mx-2 whitespace-nowrap">{_label}</div>
      {/if}
      <slot name="right" />
    </slot>
  </div> 
</li>
