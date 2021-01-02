<script>
  import { createEventDispatcher } from 'svelte';
  import Icon from './Icon.svelte';

  import { getString, getArray, isFunction, getIcon, getBoolean } from '../js/helpers';

  // Globals
  const dispatch = createEventDispatcher();

  let _class, _items, _activeClass;

  $: _class = getString($$props.class);
  $: _activeClass = getString($$props.activeClass, 'text-primary bg-gray-400 dark:bg-gray-600');
  $: _items = getArray($$props.items).map((i, index) => ({ 
    id: index,
    active: getBoolean(i.active),
    title: getString(i.title, null),
    description: getString(i.description, null),
    icon: getIcon(i.icon),
    onClick() {
      if (isFunction(i.onClick)) i.onClick();
      dispatch('itemClicked');
    },
    cursor: getBoolean(i.active) ? false : isFunction(i.onClick),
  }));
</script>

<div class="bg-white text-black dark:bg-black dark:text-white {_class}">
  {#each _items as item (item.id)}
    <div
      class="p-3 relative flex items-start rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 {item.cursor ? 'cursor-pointer' : _activeClass}"
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
