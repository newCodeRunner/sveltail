<script>
  import Button from './Button.svelte';

  // Globals
  const dropdownLabel = $$props.labelDropDown === undefined ? 'Actions' : $$props.labelDropDown;
  const dropdownClass = $$props.classDropDown === undefined ? '' : $$props.classDropDown;

  const props = $$props;
</script>

<div class="{props.breakpoint}:flex {props.breakpoint}:items-center {props.breakpoint}:justify-between p-2 bg-{props.colorBg}">
  <div class="flex-1">
    <slot name="title">
      {#if props.title}
        <h2 class="text-2xl font-bold leading-7 text-{props.colorTitle} sm:text-3xl sm:leading-9 sm:truncate">{props.title}</h2>
      {/if}
    </slot>
    <div class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap">
      <slot name='content' />
    </div>
  </div>
  <slot name="actions">
    {#if props.arrayItems}
      <div class="mt-5 flex {props.breakpoint}:mt-0 lg:ml-4">
        <div class="hidden sm:inline-flex">
          {#each props.arrayItems as btn}
            <Button icon={btn.icon} label={btn.label} size={props.actionSize} color={btn.color} on:click={btn.click} />
          {/each}
        </div>
        <Button class="sm:hidden {dropdownClass}" items={props.arrayItems} label={dropdownLabel} size={props.actionSize} />
      </div>      
    {/if}
  </slot>
</div>
