<script>
  import { getString, getBoolean, getColor } from '../js/helpers';

  import IconDismiss from '../icons/Dismiss.svelte';

  // Globals
  let _class;
  let _colorBg;
  let _colorText;
  let _title;
  let _message;
  let _dismissable;
  let _iconSize;

  $: _class = getString($$props.class);
  $: _title = getString($$props.title, null);
  $: _message = getString($$props.message, null);
  $: _dismissable = getBoolean($$props.dismissable);
  $: _iconSize = getString($$props.iconSize, 'md');
  $: _colorBg = getColor($$props.colorBg, 'info');
  $: _colorText = getColor($$props.colorText, 'white');
  
  let banner;

  const _dismiss = () => {
    if (process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios') {
      if (banner) banner.remove();
    }
  };
</script>

<div bind:this={banner} role="alert" class="bg-{_colorBg} text-{_colorText} {_class}">
  <div class="flex justify-between items-center p-4">
    <div class="flex items-center">
      <div class="px-2">
        <slot name="prepend" />
        <slot>
          {#if _title}<p class="font-bold">{_title}</p>{/if}
          {#if _message}<p>{_message}</p>{/if}
        </slot>
        <slot name="append" />
      </div>
    </div>
    {#if _dismissable}
      <div on:click={_dismiss}>
        <IconDismiss size={_iconSize} />
      </div>
    {/if}
  </div>
</div>
