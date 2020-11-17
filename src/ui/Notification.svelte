<script>
  import { createEventDispatcher } from 'svelte';

  import Icon from './Icon.svelte';
  import Chip from './Chip.svelte';

  // Internal
  const dispatch = createEventDispatcher();
  const badge = $$props.badge === undefined ? null : $$props.badge;
  const props = $$props;
</script>

<div
  class="
    w-fit
    border
    border-{props.colorBorder}
    bg-{props.colorBg}
    text-{props.colorBody}
    {props.rounded || props.pill ? 'rounded' : ''}
    {props.pill || props.circle ? 'rounded-full' : ''}
    {!badge ? '' : 'relative'}
    {props.class}
  "
>
  <div class="inline-flex px-5 items-center">
    {#if badge}
      <Chip class="absolute top-0 left-0 -mt-4 -ml-3" label={badge} size='xs' color='primary' colorBody="white" noDismiss filled rounded />
    {/if}
    {#if !props.noIcons}<Icon icon={props.icon ? props.Icon : 'fas fa-exclamation'} size="auto" class="w-4 h-4" />{/if}
    <div class="px-5">
      {#if props.title}<p class="font-bold">{props.title}</p>{/if}
      {#if props.body}<p class="text-sm">{props.body}</p>{/if}
    </div>
    {#if !props.noDismiss}
      <Icon icon='fas fa-times' size="auto" class="h-4 w-4 cursor-pointer" on:click={() => dispatch('dismiss')} />
    {/if}
  </div>
</div>
