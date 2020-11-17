<script>
  import Icon from './Icon.svelte';

  // Global
  let chip;
  const dismissChip = () => {
    chip.parentNode.removeChild(chip);
  };

  const props = $$props;
</script>

<div
  bind:this={chip}
  class="
    inline-flex
    items-center
    justify-center
    border
    border-{props.color}
    p-2
    {props.height}
    {props.rounded || props.pill ? 'rounded' : ''}
    {props.pill ? 'rounded-full' : ''}
    {props.filled ? `bg-${props.color} text-${props.colorBody}` : `text-${props.color}` }
    {props.class}
  "
> 
  {#if props.icon}<span class='h-full'><Icon icon={props.icon} size="auto" class="h-full {props.width}" /></span>{/if}
  {#if props.label}<span>{props.label}</span>{/if}
  {#if !props.noDismiss}
    <span class="ml-2 h-4 w-4 cursor-pointer" on:click={dismissChip}>
      <Icon icon="fas fa-times-circle" size="auto" class="h-full w-full" />
    </span>
  {/if}
</div>
