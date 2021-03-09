<script>
  import { createEventDispatcher } from 'svelte';

  import { getString, getBoolean } from '../js/helpers';

  // Globals
  const dispatch = createEventDispatcher();

  let _class, _innerClass, _activeClass, _title, _description, _noRipple;

  $: _class = getString($$props.class);
  $: _innerClass = getString($$props._innerClass);
  $: _titleClass = getString($$props.titleClass);
  $: _descriptionClass = getString($$props.descriptionClass);
  $: _activeClass = getString($$props.activeClass, 'text-primary');
  $: _title = getString($$props.title, null);
  $: _description = getString($$props.description, null);
  $: _active = getBoolean($$props.active);
  $: _noRipple = getBoolean($$props.noRipple);
  $: _onClick  = () => {
    dispatch('click');
  };
</script>

<li
  class="
    relative
    flex
    {_active ? _activeClass : 'cursor-pointer hover:bg-info'}
    {_class}
  "
  on:click={_onClick}
>
  {#if !_noRipple && !_active}
    <div class="st-effect-ripple bg-info" />
  {/if}

  <slot name="icon" />

  <slot>
    <div class={_innerClass}>
      {#if _title}<p class="{_titleClass}">{_title}</p>{/if}
      {#if _description}<p class="mt-1 {_descriptionClass}">{_description}</p>{/if}
    </div>
  </slot>
</li>
