<script>
  import { getContext, createEventDispatcher } from 'svelte';
  import Icon from './Icon.svelte';

  // Globals
  const dispatch = createEventDispatcher();
  const { getString, getArray, isFunction } = getContext('$$app').helpers;

  let _class, _items;

  $: _class = getString($$props.class);
  $: _items = getArray($$props.items).map((i, index) => ({ 
    id: index,
    title: getString(i.title, null),
    description: getString(i.description, null),
    icon: getIcon(i.icon),
    onClick() {
      if (isFunction(i.onClick)) i.onClick();
      dispatch('itemClicked');
    },
    cursor: isFunction(i.onClick),
  }));
</script>

<div class="bg-white text-black dark:bg-black dark:text-white {_class}">
  {#each _items as item (item.id)}
    <div
      class="p-3 relative flex items-start rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 {item.cursor ? 'cursor-pointer' : ''}"
      on:click={item.onClick}
    >
      {#if item.cursor}<div class="st-effect-ripple bg-gray-300 dark:bg-gray-700" />{/if}
      {#if item.icon}<Icon icon={item.icon} size="md" class="ml-1 mr-4" />{/if}
      <div class="ml-4">
        {#if item.title}<p class="text-base font-medium">{item.title}</p>{/if}
        {#if item.description}<p class="mt-1 text-sm">{item.description}</p>{/if}
      </div>
    </div>
  {/each}
</div>
