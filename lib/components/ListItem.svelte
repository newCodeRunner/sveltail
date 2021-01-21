<script>
  import { createEventDispatcher } from 'svelte';
  import Icon from './Icon.svelte';

  import { getString, getIcon, getBoolean } from '../js/helpers';

  // Globals
  const dispatch = createEventDispatcher();

  let _class, _activeClass, _title, _description, _noRipple;

  $: _class = getString($$props.class);
  $: _titleClass = getString($$props.titleClass);
  $: _descriptionClass = getString($$props.descriptionClass);
  $: _activeClass = getString($$props.activeClass, 'text-primary');
  $: _title = getString($$props.title, null);
  $: _description = getString($$props.description, null);
  $: _active = getBoolean($$props.active);
  $: _noRipple = getBoolean($$props.noRipple);
  $: _icon = getIcon($$props.icon);
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

  <slot name="icon">
    {#if _icon}
      <Icon icon={_icon} size="md" class="ml-1 mr-4" />
    {/if}
  </slot>
  
  <slot>
    <div class="ml-4">
      {#if _title}<p class="{_titleClass}">{_title}</p>{/if}
      {#if _description}<p class="mt-1 {_descriptionClass}">{_description}</p>{/if}
    </div>
  </slot>
</li>
