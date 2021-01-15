<script>
  import { onMount } from 'svelte';
  import { getString } from '../js/helpers';

  let _class, _name;
  $: _class = getString($$props.class);
  $: _name = getString(String($$props.name));

  let _active = false;
  const _toggleState = ({ detail }) => {
    _active = _name === detail;
  };
  
  let _tabItem;
  onMount(() => {
    let parent = _tabItem;
    while (!parent.classList.contains('st-tab-container')) {
      parent = parent.parentElement;  
    }

    const selectedTab = parent.getAttribute('initial');
    if (selectedTab === _name) _active = true;

    parent.addEventListener('tab-change', _toggleState);
    return () => {
      parent.removeEventListener('tab-change', _toggleState);
    };
  });
</script>

<div bind:this={_tabItem} class="{_active ? _class : ''}">
  {#if _active}
    <slot />
  {/if}
</div>