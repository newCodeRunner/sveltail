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
    height: helpers.getHeight($$props.size),
    width: helpers.getWidth($$props.size),
    textSize: helpers.getTextSize($$props.size),
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
  <button
    class="outline-none {props.class}"
    on:click={onClick}
    aria-label={props.label ? props.label : 'Action Button'}
    disabled={loading}
  >
    <div
      class="
        w-full
        inline-flex
        items-center
        hover:opacity-75
        bg-{props.colorBg}
        text-{props.colorText}
        {props.height}
        {props.flat ? '' : `border border-${props.colorBg}`}
        {props.circle ? '' : 'p-2'} 
        {props.rounded || props.pill ? 'rounded' : ''}
        {props.pill || props.circle ? 'rounded-full' : ''}
      "
    >
      {#if props.icon}
        <div class="h-full {props.width} {props.circle ? 'p-2' : ''}">
          <Icon icon={props.icon} class="h-full w-full" />
        </div>
      {/if}
      {#if props.label}<div class="h-fit px-3 {props.textSize}">{props.label}</div>{/if}
      {#if props.iconRight}
        <div class="h-full {props.width} {props.circle ? 'p-2' : ''}">
          <Icon icon={props.iconRight} class="h-full w-full" />
        </div>
      {/if}
    </div>
  </button>
{/if}
