<script>
  import { createEventDispatcher } from 'svelte';
  
  import { getString } from '../js/helpers';
  import Button from './Button.svelte';

  // Globals
  const dispatch = createEventDispatcher();

  let _class, _tab;
  $: _class = getString($$props.class);
  $: _tab = getString(String($$props.tab));

  $: dispatch('tabClicked', _tab);

  let _tabWidth = 0;
  let _tabScrollLeft = 0;
  let _stripHeight = 0;
  let _tabContainer;

  const _updateScrollPosition = () => {
    if (_tabContainer) _tabScrollLeft = Math.round(100 * _tabContainer.scrollLeft / (_tabContainer.scrollWidth - _tabContainer.clientWidth));
  };

  const _scrollLeft = () => {
    if (_tabContainer) _tabContainer.scrollLeft = Math.max(_tabContainer.scrollLeft - 15, 0);
  };

  const _scrollRight = () => {
    if (_tabContainer) _tabContainer.scrollLeft = Math.min(_tabContainer.scrollLeft + 15, _tabContainer.scrollWidth - _tabContainer.clientWidth);
  };
</script>

<div class="st-tab-container {_class}" initial={_tab}>
  <div bind:clientHeight={_stripHeight} class="flex">
    <div>
      {#if _tabWidth === 0 && _tabScrollLeft > 0}
        <Button class="flex-none" size="sm" flat icon="fas fa-angle-left" on:click={_scrollLeft} />
      {:else}
        <div class="w-9" />
      {/if}
    </div>
    <div bind:this={_tabContainer} class="overflow-auto -w-20 st-tabs" on:scroll={_updateScrollPosition}>
      <ul class="flex">
        <slot />
        <li bind:clientWidth={_tabWidth} class="flex-grow h-100" />
      </ul>
    </div>
    <div>
      {#if _tabWidth === 0 && _tabScrollLeft < 99}
        <Button class="flex-none" size="sm" flat icon="fas fa-angle-right" on:click={_scrollRight} />
        {:else}
        <div class="w-9" />
      {/if}
    </div>
  </div>
  
  <div style="height: calc(100% - {_stripHeight}px);">
    <slot name="content" />
  </div>
</div>

<style>
.st-tabs::-webkit-scrollbar {
  display: none;
}
.st-tabs {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>