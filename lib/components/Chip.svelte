<script>
  import { getContext } from 'svelte';
  import Icon from './Icon.svelte';

  // Globals
  const { helpers } = getContext('$$app');
  const props = {
    class: helpers.isString($$props.class) ? $$props.class : '',
    icon: helpers.getIcon($$props.icon),
    label: helpers.isString($$props.label) ? $$props.label : null,
    pill: helpers.getBoolean($$props.pill),
    rounded: helpers.getBoolean($$props.rounded),
    dismissable: helpers.getBoolean($$props.dismissable),
    colorBg: helpers.getColor($$props.colorBg, 'primary'),
    colorText: helpers.getColor($$props.colorText, 'white'),
    height: helpers.getHeight($$props.size, 'md'),
    textSize: helpers.getTextSize($$props.size, 'md'),
  };

  let chip;
  const dismiss = () => {
    if (process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios') {
      if (chip) chip.remove();
    }
  };
</script>

{#if process.env.platform === 'ns-android' || process.env.platform === 'ns-ios'}
  <span />
{/if}

{#if process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios'}
  <div
    bind:this="{chip}"
    class="
      inline-flex
      justify-center
      items-center
      border
      py-2
      bg-{props.colorBg}
      text-{props.colorText}
      border-{props.colorBg === 'transparent' ? props.colorText : props.colorBg}
      {props.rounded || props.pill ? 'rounded' : ''}
      {props.pill ? 'rounded-full px-4' : 'px-2'}
      {props.class}
      {props.height}
    "
  >
    {#if props.icon}<Icon icon={props.icon} class="ml-1 mr-2" size={$$props.size} />{/if}
    {#if props.label}<div class="{props.textSize}">{props.label}</div>{/if}
    {#if props.dismissable}
      <div
        class="
          ml-4
          mr-1
          p-0
          cursor-pointer
          transition ease-in-out
          transform hover:scale-110
        "
        on:click={dismiss}
      >  
        <Icon icon="fas fa-times-circle" size={$$props.size} />
      </div>
    {/if}
  </div>
{/if}
  