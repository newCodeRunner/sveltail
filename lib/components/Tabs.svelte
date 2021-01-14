<script>
  import { createEventDispatcher } from 'svelte';
  import Icon from './Icon.svelte';
  import Button from './Button.svelte';
  import { getString, getArray, getHeight, getTextSize, getBoolean, getIcon } from '../js/helpers';

  // Globals
  const dispatch = createEventDispatcher();

  export let tabModel = 0;
  const _updateIndex = (index) => {
    tabModel = index;
    dispatch('tabClicked', tabModel);
  };

  let _tabWidth = 0;
  let _tabScrollLeft = 0;
  let _tabContainer;
  let _tabs, _size, _height, _textSize, _noBorder;

  const _updateScrollPosition = () => {
    if (_tabContainer) _tabScrollLeft = Math.round(100 * _tabContainer.scrollLeft / (_tabContainer.scrollWidth - _tabContainer.clientWidth));
  };

  const _scrollLeft = () => {
    if (_tabContainer) _tabContainer.scrollLeft = Math.max(_tabContainer.scrollLeft - 15, 0);
  };

  const _scrollRight = () => {
    if (_tabContainer) _tabContainer.scrollLeft = Math.min(_tabContainer.scrollLeft + 15, _tabContainer.scrollWidth - _tabContainer.clientWidth);
  };

  $: _size = getString($$props.size, 'md');
  $: _activeClass = getString($$props.activeClass, 'text-primary border-primary');
  $: _noBorder = getBoolean($$props.noBorder);
  $: _height = getHeight($$props.size, 'md');
  $: _textSize = getTextSize($$props.size, 'md');
  $: _tabs = getArray($$props.tabs).map((i, index) => ({ 
    id: index,
    label: getString(i.label),
    icon: getIcon(i.icon),
    iconRight: getIcon(i.iconRight),
    class: getString(i.class),
  }));
</script>

{#if _tabs.length > 0}
  <div>
    <div class="flex">
      <div class="flex items-center {_noBorder ? 'border-none' : 'border-b'}">
        {#if _tabWidth === 0 && _tabScrollLeft > 0}
          <Button size="sm" flat icon="fas fa-angle-left" on:click={_scrollLeft} />
        {:else}
          <div class="w-9" />
        {/if}
      </div>
      <div bind:this={_tabContainer} class="overflow-auto -w-20 st-tabs" on:scroll={_updateScrollPosition}>
        <ul class="flex">
          {#each _tabs as tab (tab.id)}
            <li
              class="
                p-2
                flex
                justify-center
                items-center
                cursor-pointer
                {tabModel === tab.id ? 'border-l border-t border-r' : 'border-b'}
                {tabModel === tab.id ? _activeClass : ''}
                {_noBorder ? 'border-none' : 'rounded-t'}
                {_height}
                {tab.class}
              "
              on:click={_updateIndex(tab.id)}
            >
              {#if tab.icon}<Icon icon={tab.icon} size={_size} />{/if}
              {#if tab.label}<div class="{_textSize} mx-2 whitespace-nowrap">{tab.label}</div>{/if}
              {#if tab.iconRight}<Icon icon={tab.iconRight} size={_size} />{/if}
            </li>
          {/each}
          <li bind:clientWidth={_tabWidth} class="flex-grow h-100 {_noBorder ? 'border-none' : 'border-b'}" />
        </ul>
      </div>
      <li class="flex-grow flex items-center justify-end {_noBorder ? 'border-none' : 'border-b'}">
        {#if _tabWidth === 0 && _tabScrollLeft < 99}
          <Button size="sm" flat icon="fas fa-angle-right" on:click={_scrollRight} />
        {:else}
          <div class="w-9" />
        {/if}
      </li>
    </div>

    <div class="{_noBorder ? 'border-none' : 'border-l border-b border-r rounded-b'}">
      <slot />
    </div>
  </div>
{/if}

<style>
.st-tabs::-webkit-scrollbar {
  display: none;
}
.st-tabs {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>