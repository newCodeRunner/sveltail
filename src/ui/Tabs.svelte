<script>
    import Icon from './Icon.svelte';

    // Color
    const activeClass = $$props.activeClass === undefined ? 'bg-primary text-white' : $$props.activeClass;

    // Type
    const spacedTabs = $$props.spacedTabs === undefined ? false : $$props.spacedTabs;

    // State
    let currentTab = 0;

    // Content
    const items = $$props.items === undefined ? null : $$props.items;
</script>

<ul class="flex border-b">
  {#each items as item}
    <li
      class="-mb-px {spacedTabs ? 'mr-1' : ''}"
      on:click={() => {
        currentTab = !item.disabled ? item.tab : currentTab;
      }}
    >
      <div
        class="
          inline-block
          border-l
          border-t
          border-r
          rounded-t
          py-2
          px-4
          font-semibold
          {item.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          {currentTab === item.tab ? activeClass : ''}
        "
      >   
        {#if item.icon}<Icon icon={item.icon} size="md" />{/if}
        {item.label}
      </div>
    </li>
  {/each}
</ul>
<div>
  <slot />
</div>