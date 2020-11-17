<script>
  import { createEventDispatcher } from 'svelte';

  import Icon from './Icon.svelte';
  
  // Global
  const dispatch = createEventDispatcher();
  const navMode = $$props.navMode === undefined ? false : $$props.navMode;
  const separators = $$props.separators === undefined ? false : $$props.separators;

  const props = $$props;
</script>

<div class="grid gap-8 px-5 py-5">
  {#if navMode === false}
    {#each props.arrayItems as item}
      <div
        class="-m-3 p-1 flex items-start space-x-4 rounded-lg hover:opacity-50 cursor-pointer"
        on:click={() => (item.disabled ? null : dispatch('itemClicked'))}
      >
        {#if item.icon !== null}<Icon icon={item.icon} size="sm" />{/if}
        <div class="space-y-1">
          <p class="text-base leading-6 font-medium">{item.title}</p>
          {#if item.body !== null}<p class="text-sm leading-5">{item.body}</p>{/if}
        </div>
      </div>
      {#if separators === true}<div class="border-t border-gray-100"></div>{/if}
    {/each}
  {:else}
    {#each props.arrayItems as item}
      <a
        href={item.href}
        class="-m-3 p-1 inline-flex space-x-4 rounded-lg hover:opacity-70"
        on:click={() => (item.disabled ? null : dispatch('itemClicked'))}
      >
        {#if item.icon !== null}<Icon icon={item.icon} size="sm"/>{/if}
        <div class="space-y-1"><p class="text-base leading-6 font-medium">{item.label}</p></div>
      </a>
      {#if separators === true}<div class="border-t border-gray-100"></div>{/if}
    {/each}
  {/if}
</div>
