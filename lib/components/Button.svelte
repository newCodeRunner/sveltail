<script>
  import { createEventDispatcher, getContext } from 'svelte';
  import Icon from './Icon.svelte';

  // Globals
  const dispatch = createEventDispatcher();
  const { helpers } = getContext('$$app');
  const props = {
    class: helpers.isString($$props.class) ? $$props.class : '',
    label: helpers.isString($$props.label) ? $$props.label : null,
    icon: helpers.getIcon($$props.icon),
    iconRight: helpers.getIcon($$props.iconRight),
    flat: helpers.getBoolean($$props.flat),
    circle: helpers.getBoolean($$props.circle),
    rounded: helpers.getBoolean($$props.rounded),
    pill: helpers.getBoolean($$props.pill),
    colorBg: helpers.getColor($$props.colorBg, 'primary'),
    colorText: helpers.getColor($$props.colorText, 'white'),
    height: helpers.getHeight($$props.size, 'md'),
    width: helpers.getWidth($$props.size, 'md'),
    textSize: helpers.getTextSize($$props.size, 'md'),
  };
  const onClick = () => {
    dispatch('click');
  };
  export let loading = false;
</script>

{#if process.env.platform === 'ns-android' || process.env.platform === 'ns-ios'}
  <button backgroundColor={props.colorBg} on:tap={onClick} >
    <formattedString color={props.colorText}>
      {#if props.icon}<Icon icon={props.icon.text} class={props.icon.class} />{/if}
      {#if props.label}<span text={props.label} />{/if}
      {#if props.iconRight}<Icon icon={props.iconRight.text} class={props.iconRight.class} />{/if}
    </formattedString>
  </button>
{/if}

{#if process.env.platform !== 'ns-android' && process.env.platform !== 'ns-ios'}
  <div>
    <button
      class="
        flex
        justify-center
        items-center
        relative
        transition ease-in-out
        transform hover:bg-{props.colorText} hover:text-{props.colorBg === 'transparent' ? 'black' : props.colorBg} dark:hover:text-{props.colorBg === 'transparent' ? 'white' : props.colorBg}
        bg-{props.colorBg}
        text-{props.colorText}       
        {props.flat ? '' : `border border-${props.colorBg === 'transparent' ? props.colorText : props.colorBg}`}
        {props.rounded || props.pill ? 'rounded' : ''}
        {props.pill || props.circle ? 'rounded-full' : ''}
        {props.pill ? 'p-4' : 'p-2'}
        {props.circle ? props.width : ''}
        {props.height}
        {props.class}
      "
      on:click={onClick}
      aria-label={props.label ? `Button ${props.label}` : 'Action Button'}
      disabled={loading}
    >
      <div class="st-effect-ripple bg-{props.colorBg === 'transparent' ? props.colorText : props.colorBg}" />
      {#if props.icon}
        <Icon icon={props.icon} class="mx-1" size={$$props.size} />
      {/if}
      {#if props.label}<div class="{props.textSize} whitespace-nowrap">{props.label}</div>{/if}
      {#if props.iconRight}
        <Icon icon={props.iconRight} class="mx-1" size={$$props.size} />
      {/if}
    </button>
  </div>
{/if}
