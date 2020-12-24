<script>
  import { getContext } from 'svelte';
  import Icon from './Icon.svelte';

  // Globals
  const { helpers } = getContext('$$app');
  const props = {
    class: helpers.isString($$props.class) ? $$props.class : '',
    title: helpers.isString($$props.title) ? $$props.title : null,
    message: helpers.isString($$props.message) ? $$props.message : null,
    icon: helpers.getIcon($$props.icon),
    dismissable: helpers.getBoolean($$props.dismissable),
    colorBg: helpers.getColor($$props.colorBg, 'info'),
    colorText: helpers.getColor($$props.colorText, 'white'),
  };
  
  let banner;

  const dismiss = () => {
    if (process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios') {
      if (banner) banner.remove();
    }
  };
</script>

<div
  bind:this={banner}
  role="alert"
  class="bg-{props.colorBg} text-{props.color} {props.class}"
>
  <div class="flex justify-between items-center p-4">
    <div class="flex items-center">
      {#if props.icon}<Icon icon={props.icon} size="md" />{/if}
      <div class="px-2">
        {#if props.title}<p class="font-bold">{props.title}</p>{/if}
        {#if props.message}<p>{props.message}</p>{/if}
        <slot />
      </div>
    </div>
    {#if props.dismissable}
      <Icon
        class="cursor-pointer transition ease-in-out transform hover:scale-110"
        icon="fas fa-times-circle"
        size="md"
        on:click={dismiss}
      />
    {/if}
  </div>
</div>
