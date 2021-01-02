<script>
  import Icon from './Icon.svelte';

  import { getString, getIcon, getBoolean, getColor } from '../js/helpers';

  // Globals
  let _class, _icon, _colorBg, _colorText, _title, _message, _dismissable;
  $: _class = getString($$props.class);
  $: _title = getString($$props.title, null);
  $: _message = getString($$props.message, null);
  $: _icon = getIcon($$props.icon);
  $: _dismissable = getBoolean($$props.dismissable);
  $: _colorBg = getColor($$props.colorBg, 'info');
  $: _colorText = getColor($$props.colorText, 'white');
  
  let banner;

  const dismiss = () => {
    if (process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios') {
      if (banner) banner.remove();
    }
  };
</script>

<div bind:this={banner} role="alert" class="bg-{_colorBg} text-{_colorText} {_class}">
  <div class="flex justify-between items-center p-4">
    <div class="flex items-center">
      {#if _icon}<Icon icon={_icon} size="md" />{/if}
      <div class="px-2">
        {#if _title}<p class="font-bold">{_title}</p>{/if}
        {#if _message}<p>{_message}</p>{/if}
        <slot />
      </div>
    </div>
    {#if _dismissable}
      <Icon
        class="cursor-pointer transition ease-in-out transform hover:scale-110"
        icon="fas fa-times-circle"
        size="md"
        on:click={dismiss}
      />
    {/if}
  </div>
</div>
