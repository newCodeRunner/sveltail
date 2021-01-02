<script>
  import { createEventDispatcher } from 'svelte';
  import Icon from './Icon.svelte';
  import { getString, getArray, getHeight, getTextSize, getBoolean, getIcon } from '../js/helpers';

  // Globals
  const dispatch = createEventDispatcher();

  let tabIndex = 0;
  let _tabs, _size, _height, _textSize, _noBorder;

  const updateIndex = (index) => {
    tabIndex = index;
    dispatch('tabClicked', tabIndex);
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
    <ul class="flex">
      {#each _tabs as tab (tab.id)}
        <li
          class="
            cursor-pointer
            {tabIndex === tab.id ? 'border-l border-t border-r' : 'border-b'}
            {_noBorder ? 'border-none' : 'rounded-t'}
            {tab.class}
          "
          on:click={updateIndex(tab.id)}
        >
          <div
            class="
              px-2
              py-1
              inline-flex
              justify-center
              items-center
              {tabIndex === tab.id ? _activeClass : ''}
              {_height}
            "
          >
            {#if tab.icon}<Icon icon={tab.icon} size={_size} />{/if}
            {#if tab.label}<div class="{_textSize} mx-2 whitespace-nowrap">{tab.label}</div>{/if}
            {#if tab.iconRight}<Icon icon={tab.iconRight} size={_size} />{/if}
          </div>
        </li>
      {/each}
      <li class="flex-grow h-100 {_noBorder ? 'border-none' : 'border-b'}" />
    </ul>

    <div class="{_noBorder ? 'border-none' : 'border-l border-b border-r rounded-b'}">
      <slot />
    </div>
  </div>
{/if}